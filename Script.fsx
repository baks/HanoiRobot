#r "node_modules/fable-core/Fable.Core.dll"
 
open Fable.Core
open Fable.Import
open Fable.Import.Browser
 
type Message = { ``type``:int; body:Body option } 
and Body = { bodyPart:string; value:float }
 
type RobotResponse = { ``type``:int; body:RobotResponseBody option } 
and RobotResponseBody = { bodyPart:string; currentValue:float; towerNumber:int; diskNumber:int; state:int[][] }
 
type RobotCommand = 
    | Connect 
    | Activate 
    | Move of BodyPart * float 
    | Hand of BodyPart  
 
    member self.ToMessageData() =
        match self with
        | Connect -> (0,None)
        | Activate -> (1,None)
        | Move (part,value) -> (2,Some { bodyPart = part.ToString(); value = value})
        | Hand part -> (3,Some { bodyPart = part.ToString(); value = 0.0})
 
and BodyPart = 
    | RightArm 
    | RightForearm 
    | RightHand 
    | LeftArm 
    | LeftForearm 
    | LeftHand
 
    static member Create(bodyPart) =
        match bodyPart with
        | "rightArm" -> RightArm
        | "rightForearm" -> RightForearm
        | "rightHand" -> RightHand
        | "leftArm" -> LeftArm
        | "leftForearm" -> LeftForearm
        | "leftHand" -> LeftHand
 
type Disk = 
    | Disk1
    | Disk2 
    | Disk3
 
    static member Create(number) =
        match number with
        | 1 -> Disk1
        | 2 -> Disk2
        | 3 -> Disk3
 
type Tower =
    | Tower1
    | Tower2
    | Tower3
 
    static member Create(number) =
        match number with
        | 1 -> Tower1
        | 2 -> Tower2
        | 3 -> Tower3
 
type MoveDetails = { BodyPart : BodyPart; CurrentValue : float }
 
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
    | LimitReached 
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
        | 2 -> Moved { BodyPart = BodyPart.Create(x.body.Value.bodyPart); CurrentValue = x.body.Value.currentValue }
        | 3 -> LimitReached
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
 
let listenToRobot (me:MessageEvent) =
    let msg = JS.JSON.parse (me.data :?> string) |> ignore
    let tp : RobotResponse = msg |> unbox
    robotEvent.Trigger (RobotReaction.FromMessage tp)
    obj()
 
let buildMessage (command:RobotCommand) =
    let (t,b) = command.ToMessageData()
    { ``type`` = t; Message.body = b }
    |> JS.JSON.stringify
 
let sendMessageToRobot (iframe:HTMLIFrameElement) port commandMessage =
    let message = buildMessage commandMessage
    iframe.contentWindow.postMessage (message, "*", port |> FSharp.Core.Option.map (fun x -> [|x|]))
 
let cover = document.getElementById "cover" :?> HTMLIFrameElement
 
let startRobotAgent() =
    let messageChannel = MessageChannel.Create()
    messageChannel.port1.onmessage <- System.Func<MessageEvent,obj>(listenToRobot)
 
 
let onlyMoved = function | Moved _ -> true | _ -> false
let onlyHanoi = function | Hanoi _ -> true | _ -> false
 
let initialRobotState : System.Collections.Generic.IDictionary<BodyPart, float option> = 
    dict [ (RightArm, None); (RightForearm, None); (RightHand, None); (LeftArm, None); (LeftForearm, None); (LeftHand, None) ]
 
let robotState() =
    robotEvent.Publish
    |> Observable.filter onlyMoved
    |> Observable.scan (fun (previousState:System.Collections.Generic.IDictionary<BodyPart, float option>) (Moved moveDetails) -> 
        previousState.[moveDetails.BodyPart] <- Some moveDetails.CurrentValue
        previousState) initialRobotState
 
let hanoiState() =
    robotEvent.Publish
    |> Observable.filter onlyHanoi
    |> Observable.scan (fun previousHanoiState (Hanoi state) ->
        state
        ) { Tower1 = [Disk3;Disk2;Disk1]; Tower2 = List.empty; Tower3 = List.empty }
 
cover.addEventListener("load", unbox startRobotAgent)