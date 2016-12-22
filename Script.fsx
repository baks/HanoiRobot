#r "node_modules/fable-core/Fable.Core.dll"
 
open Fable.Core
open Fable.Import
open Fable.Import.Browser
 
type Message = { ``type``:int; body:Body option } 
and Body = { bodyPart:string; value:float }
 
type RobotResponse = { ``type``:int; body:RobotResponseBody option } 
and RobotResponseBody = { bodyPart:string; currentValue:float; towerNumber:int; diskNumber:int; state:int[][] }
 
type Side =
    | Left
    | Right
 
type BodyPart =
    | Arm
    | Forearm
    | Hand
 
let robotBodyPartToString robotBodyPart  =
    match robotBodyPart with
    | (Right, Arm) -> "rightArm"
    | (Right, Forearm) -> "rightForearm"
    | (Right, BodyPart.Hand) -> "rightHand"
    | (Left, Arm) -> "leftArm"
    | (Left, Forearm) -> "leftForearm"
    | (Left, BodyPart.Hand) -> "leftHand"
 
let createRobotBodyPartFromString (bodyPart) =
    match bodyPart with
    | "rightArm" -> (Right,Arm)
    | "rightForearm" -> (Right,Forearm)
    | "rightHand" -> (Right,BodyPart.Hand)
    | "leftArm" -> (Left,Arm)
    | "leftForearm" -> (Left,Forearm)
    | "leftHand" -> (Left,BodyPart.Hand)
 
type RobotCommand = 
    | Connect 
    | Activate 
    | Move of RobotBodyPart * float 
    | Hand of RobotBodyPart  
 
    member self.ToMessageData() =
        match self with
        | Connect -> (0,None)
        | Activate -> (1,None)
        | Move (part,value) -> (2,Some { bodyPart = robotBodyPartToString part; value = value})
        | Hand part -> (3,Some { bodyPart = robotBodyPartToString part; value = 0.0})
 
and RobotBodyPart = Side * BodyPart
 
type Disk = 
    | Disk1
    | Disk2 
    | Disk3
 
    static member Create(number) =
        match number with
        | 0 -> Disk1
        | 1 -> Disk2
        | 2 -> Disk3
 
type Tower =
    | Tower1
    | Tower2
    | Tower3
 
    static member Create(number) =
        match number with
        | 0 -> Tower1
        | 1 -> Tower2
        | 2 -> Tower3
 
type MoveDetails = { BodyPart : RobotBodyPart; CurrentValue : float }
 
type HanoiState = { Tower1 : Disk list; Tower2: Disk list; Tower3: Disk list }
    with 
        static member Create(arrayState:int[][]) =
            let tower1 = arrayState.[0]
            let tower2 = arrayState.[1]
            let tower3 = arrayState.[2]
            let createDisks x = Array.map Disk.Create x |> List.ofArray
            { Tower1 = tower1 |> createDisks; Tower2 = tower2 |> createDisks; Tower3 = tower3 |> createDisks }
 
type RobotReaction = 
    | Connected 
    | Activated 
    | Moved of MoveDetails
    | LimitReached of RobotResponse
    | HandOpened 
    | HandClosed 
    | Disk 
    | DiskEnter of Disk
    | DiskLeave of Disk
    | Hanoi of HanoiState
    | TowerEnter of Tower
    | TowerLeave of Tower
    | InvalidMessage 
    | UnknownBodyPart
 
    static member FromMessage (x:RobotResponse) =
        match x.``type`` with
        | 0 -> Connected
        | 1 -> Activated
        | 2 -> Moved { BodyPart = createRobotBodyPartFromString (x.body.Value.bodyPart); CurrentValue = x.body.Value.currentValue }
        | 3 -> LimitReached x
        | 4 -> HandOpened
        | 5 -> HandClosed
        | 6 -> Disk
        | 7 -> DiskEnter (Disk.Create x.body.Value.diskNumber)
        | 8 -> DiskLeave (Disk.Create x.body.Value.diskNumber)
        | 9 -> Hanoi (HanoiState.Create x.body.Value.state)
        | 16 -> TowerEnter (Tower.Create x.body.Value.towerNumber)
        | 17 -> TowerLeave (Tower.Create x.body.Value.towerNumber)
        | 18 -> InvalidMessage
        | 19 -> UnknownBodyPart
 
let robotEvent = new Event<_>()
let robotPartsEvent = new Event<_>()
 
let mutable i = 0
let listenToRobot (me:MessageEvent) =
    if i < 1000 then
        let msg = JS.JSON.parse (me.data :?> string)
        let tp : RobotResponse = msg |> unbox
        printfn "%A" (msg)
        robotEvent.Trigger (RobotReaction.FromMessage tp)
        
        //function looks the same when comparing them by string
        robotPartsEvent.Trigger (RobotReaction.FromMessage tp)
        i <- i + 1
        obj()
    else
        obj()
 
let buildMessage (command:RobotCommand) =
    let (t,b) = command.ToMessageData()
    { ``type`` = t; Message.body = b }
    |> JS.JSON.stringify
 
let sendMessageToRobot (iframe:HTMLIFrameElement) (port:MessagePort option) commandMessage =
    let message = buildMessage commandMessage
    let ports = match port with | Some x -> [|x|] | None -> [||]
    iframe.contentWindow.postMessage (message, "*", ports)
 
let cover = document.getElementById "cover" :?> HTMLIFrameElement
let messageChannel = MessageChannel.Create()
 
let executeCommand = sendMessageToRobot cover None
 
let moved = function | Moved _ -> true | _ -> false
let onlyHanoi = function | Hanoi _ -> true | _ -> false
let onlyDiskEnter = function | DiskEnter _ -> true | _ -> false
let onlyLimitReached = function | LimitReached _ -> true | _ -> false
let onlyDisk = function | Disk -> true | _ -> false
let onlyTowerEnter x = function | TowerEnter y when x = y -> true | _ -> false
 
//
//let initialState : (float option) [] =
//    [|
//        None; None; None; None; None; None
//    |]
 
 
let initialState : (float option) [] =
    [|
        Some 0.0; Some 0.0; Some 0.0; Some 0.0; Some 0.0; Some 0.0
    |]
 
let bodyPartToIdx = function
    | (Right,Arm) -> 0
    | (Right,Forearm) -> 1
    | (Right,BodyPart.Hand) -> 2
    | (Left,Arm) -> 3
    | (Left,Forearm) -> 4
    | (Left,BodyPart.Hand) -> 5
 
//let initialRobotState : System.Collections.Generic.IDictionary<BodyPart, float option> = 
//    dict [ (RightArm, None); (RightForearm, None); (RightHand, None); (LeftArm, None); (LeftForearm, None); (LeftHand, None) ]
 
let only x =
    robotEvent.Publish
    |> Observable.filter x
 
let tower1Pos = [-19.0;59.0;20.0]
let tower2Pos = [-18.0;6.0;21.0]
 
let rightRobotParts side =
    only moved
    |> Observable.split (
        function
        | Moved { BodyPart = (side,Arm) } as arg ->  Choice1Of2 arg
        | _ as arg -> Choice2Of2 arg)
    ||> (fun arm rest -> 
        let forearm, hand = 
            rest 
            |> Observable.split (
                function 
                | Moved { BodyPart = (side,Forearm) } as arg -> Choice1Of2 arg
                | _ as arg -> Choice2Of2 arg)
 
        (arm, forearm, hand))
 
let robotState state =
    only moved
    |> Observable.scan (fun (previousState:(float option) []) (Moved moveDetails) -> 
        previousState.[bodyPartToIdx moveDetails.BodyPart] <- Some moveDetails.CurrentValue
        previousState) state
 
let hanoiState() =
    robotEvent.Publish
    |> Observable.filter onlyHanoi
    |> Observable.scan (fun previousHanoiState (Hanoi state) ->
        state
        ) { Tower1 = [Disk3;Disk2;Disk1]; Tower2 = List.empty; Tower3 = List.empty }
 
 
let moveBodyPart current target bodyPart =
    if current <> target then
        let moveFactor = 1.0
        let moveValue = if current < target then 1.0 else -1.0
        executeCommand (Move (bodyPart, moveFactor * moveValue))
 
let moveBodyPartTo side (targetPos:float list) (state:(float option)[]) =
    let arm,forearm,hand = rightRobotParts side
 
    let armSubscriber =
        arm
        |> Observable.subscribe (function
            | (Moved moveDetails) -> moveBodyPart moveDetails.CurrentValue targetPos.[0] (side,Arm)
            | _ -> ())
 
    let forearmSubscriber =
        forearm
        |> Observable.subscribe (function
            | (Moved moveDetails) -> moveBodyPart moveDetails.CurrentValue targetPos.[1] (side,Forearm)
            | _ -> ())
 
    let handSubscriber =
        hand
        |> Observable.subscribe (function
            | (Moved moveDetails) -> moveBodyPart moveDetails.CurrentValue targetPos.[2] (side,BodyPart.Hand)
            | _ -> ())
 
    let (Some currentArm) = state.[bodyPartToIdx (side,Arm)]
    let (Some currentForearm) = state.[bodyPartToIdx (side,Forearm)]
    let (Some currentHand) = state.[bodyPartToIdx (side,BodyPart.Hand)]
    moveBodyPart currentArm targetPos.[0] (side, Arm)
    moveBodyPart currentForearm targetPos.[1] (side, Forearm)
    moveBodyPart currentHand targetPos.[2] (side, BodyPart.Hand)
 
    { 
    new System.IDisposable with
        member x.Dispose() =
            armSubscriber.Dispose()
            forearmSubscriber.Dispose()
            handSubscriber.Dispose() 
    }
 
let pickDisk side =
    executeCommand (RobotCommand.Hand (side, BodyPart.Hand))
 
let dropDisk side =
    executeCommand (RobotCommand.Hand (side, BodyPart.Hand))
    
 
let move state source target = 
    async {
        match source,target with
        | Tower1,Tower2 -> 
            let subscriber = moveBodyPartTo Right tower1Pos state
            
            let mutable completed = false
 
            let pickDiskSubscriber = 
                only (function | DiskEnter _ -> true | _ -> false)
                |> Observable.subscribe (fun _ -> completed <- true)
 
            while completed = false do
                do! Async.Sleep 200
 
            subscriber.Dispose()
            pickDiskSubscriber.Dispose()
 
            pickDisk Right
 
            do! Async.Sleep 200
 
            state.[0] <- Some tower1Pos.[0]
            state.[1] <- Some tower1Pos.[1]
            state.[2] <- Some tower1Pos.[2]
 
            let moveToTargetSubscriber = moveBodyPartTo Right tower2Pos state
 
            completed <- false
 
            let dropDiskSubscriber =
                only (function | TowerEnter target -> true | _ -> false)
                |> Observable.subscribe(fun x -> completed <- true)
 
            while completed = false do
                do! Async.Sleep 200
 
            moveToTargetSubscriber.Dispose()
            dropDiskSubscriber.Dispose()
            do! Async.Sleep 200
            dropDisk Right
            state.[0] <- Some tower2Pos.[0]
            state.[1] <- Some tower2Pos.[1]
            state.[2] <- Some tower2Pos.[2]
 
            return state
        | _ -> return state
    }
 
let rec hanoi state n (source:Tower) (target:Tower) = 
    async {
        if n > 0 then
            let! state = hanoi state (n-1) source target
 
            let! state = move state source Tower2
            return state
            //do! hanoi state (n-1) target source
 
            //do! move state Tower2 target
 
            //do! hanoi state (n-1) source target
        else
            return state
    }
 
let startRobotAgent() =
    sendMessageToRobot cover (Some messageChannel.port2) Connect
    
    messageChannel.port1.onmessage <- System.Func<MessageEvent,obj>(listenToRobot)
 
    robotEvent.Publish
    |> Observable.filter (function | Connected -> true |  _ -> false)
    |> Observable.add (fun x ->
 
        executeCommand Activate
 
        robotEvent.Publish
        |> Observable.filter (function | Activated -> true | _ -> false)
        |> Observable.add (fun x -> hanoi initialState 3 Tower1 Tower3 |> Async.Ignore |> Async.StartImmediate)
    )
 
 
cover.addEventListener("load", unbox startRobotAgent)