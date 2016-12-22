(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "fable-core/umd/Symbol", "fable-core/umd/Util", "fable-core/umd/List", "fable-core/umd/Seq", "fable-core/umd/Event", "fable-core/umd/String", "fable-core/umd/Observable", "fable-core/umd/Choice", "fable-core/umd/Async", "fable-core/umd/AsyncBuilder"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("fable-core/umd/Symbol"), require("fable-core/umd/Util"), require("fable-core/umd/List"), require("fable-core/umd/Seq"), require("fable-core/umd/Event"), require("fable-core/umd/String"), require("fable-core/umd/Observable"), require("fable-core/umd/Choice"), require("fable-core/umd/Async"), require("fable-core/umd/AsyncBuilder"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Symbol, global.Util, global.List, global.Seq, global.Event, global.String, global.Observable, global.Choice, global.Async, global.AsyncBuilder);
        global.Script = mod.exports;
    }
})(this, function (exports, _Symbol2, _Util, _List, _Seq, _Event2, _String, _Observable, _Choice, _Async, _AsyncBuilder) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.tower2Pos = exports.tower1Pos = exports.initialState = exports.executeCommand = exports.messageChannel = exports.cover = exports.i = exports.robotPartsEvent = exports.robotEvent = exports.RobotReaction = exports.HanoiState = exports.MoveDetails = exports.Tower = exports.Disk = exports.RobotCommand = exports.BodyPart = exports.Side = exports.RobotResponseBody = exports.RobotResponse = exports.Body = exports.Message = undefined;
    exports.robotBodyPartToString = robotBodyPartToString;
    exports.createRobotBodyPartFromString = createRobotBodyPartFromString;
    exports.listenToRobot = listenToRobot;
    exports.buildMessage = buildMessage;
    exports.sendMessageToRobot = sendMessageToRobot;
    exports.moved = moved;
    exports.onlyHanoi = onlyHanoi;
    exports.onlyDiskEnter = onlyDiskEnter;
    exports.onlyLimitReached = onlyLimitReached;
    exports.onlyDisk = onlyDisk;
    exports.onlyTowerEnter = onlyTowerEnter;
    exports.bodyPartToIdx = bodyPartToIdx;
    exports.only = only;
    exports.rightRobotParts = rightRobotParts;
    exports.robotState = robotState;
    exports.hanoiState = hanoiState;
    exports.moveBodyPart = moveBodyPart;
    exports.moveBodyPartTo = moveBodyPartTo;
    exports.pickDisk = pickDisk;
    exports.dropDisk = dropDisk;
    exports.move = move;
    exports.hanoi = hanoi;
    exports.startRobotAgent = startRobotAgent;

    var _Symbol3 = _interopRequireDefault(_Symbol2);

    var _List2 = _interopRequireDefault(_List);

    var _Event3 = _interopRequireDefault(_Event2);

    var _Choice2 = _interopRequireDefault(_Choice);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }

        return obj;
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var Message = exports.Message = function () {
        function Message(type, body) {
            _classCallCheck(this, Message);

            this.type = type;
            this.body = body;
        }

        _createClass(Message, [{
            key: _Symbol3.default.reflection,
            value: function () {
                return {
                    type: "Script.Message",
                    interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                    properties: {
                        type: "number",
                        body: (0, _Util.Option)(Body)
                    }
                };
            }
        }, {
            key: "Equals",
            value: function (other) {
                return (0, _Util.equalsRecords)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function (other) {
                return (0, _Util.compareRecords)(this, other);
            }
        }]);

        return Message;
    }();

    (0, _Symbol2.setType)("Script.Message", Message);

    var Body = exports.Body = function () {
        function Body(bodyPart, value) {
            _classCallCheck(this, Body);

            this.bodyPart = bodyPart;
            this.value = value;
        }

        _createClass(Body, [{
            key: _Symbol3.default.reflection,
            value: function () {
                return {
                    type: "Script.Body",
                    interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                    properties: {
                        bodyPart: "string",
                        value: "number"
                    }
                };
            }
        }, {
            key: "Equals",
            value: function (other) {
                return (0, _Util.equalsRecords)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function (other) {
                return (0, _Util.compareRecords)(this, other);
            }
        }]);

        return Body;
    }();

    (0, _Symbol2.setType)("Script.Body", Body);

    var RobotResponse = exports.RobotResponse = function () {
        function RobotResponse(type, body) {
            _classCallCheck(this, RobotResponse);

            this.type = type;
            this.body = body;
        }

        _createClass(RobotResponse, [{
            key: _Symbol3.default.reflection,
            value: function () {
                return {
                    type: "Script.RobotResponse",
                    interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                    properties: {
                        type: "number",
                        body: (0, _Util.Option)(RobotResponseBody)
                    }
                };
            }
        }, {
            key: "Equals",
            value: function (other) {
                return (0, _Util.equalsRecords)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function (other) {
                return (0, _Util.compareRecords)(this, other);
            }
        }]);

        return RobotResponse;
    }();

    (0, _Symbol2.setType)("Script.RobotResponse", RobotResponse);

    var RobotResponseBody = exports.RobotResponseBody = function () {
        function RobotResponseBody(bodyPart, currentValue, towerNumber, diskNumber, state) {
            _classCallCheck(this, RobotResponseBody);

            this.bodyPart = bodyPart;
            this.currentValue = currentValue;
            this.towerNumber = towerNumber;
            this.diskNumber = diskNumber;
            this.state = state;
        }

        _createClass(RobotResponseBody, [{
            key: _Symbol3.default.reflection,
            value: function () {
                return {
                    type: "Script.RobotResponseBody",
                    interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                    properties: {
                        bodyPart: "string",
                        currentValue: "number",
                        towerNumber: "number",
                        diskNumber: "number",
                        state: (0, _Util.Array)((0, _Util.Array)("number"))
                    }
                };
            }
        }, {
            key: "Equals",
            value: function (other) {
                return (0, _Util.equalsRecords)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function (other) {
                return (0, _Util.compareRecords)(this, other);
            }
        }]);

        return RobotResponseBody;
    }();

    (0, _Symbol2.setType)("Script.RobotResponseBody", RobotResponseBody);

    var Side = exports.Side = function () {
        function Side(caseName, fields) {
            _classCallCheck(this, Side);

            this.Case = caseName;
            this.Fields = fields;
        }

        _createClass(Side, [{
            key: _Symbol3.default.reflection,
            value: function () {
                return {
                    type: "Script.Side",
                    interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                    cases: {
                        Left: [],
                        Right: []
                    }
                };
            }
        }, {
            key: "Equals",
            value: function (other) {
                return (0, _Util.equalsUnions)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function (other) {
                return (0, _Util.compareUnions)(this, other);
            }
        }]);

        return Side;
    }();

    (0, _Symbol2.setType)("Script.Side", Side);

    var BodyPart = exports.BodyPart = function () {
        function BodyPart(caseName, fields) {
            _classCallCheck(this, BodyPart);

            this.Case = caseName;
            this.Fields = fields;
        }

        _createClass(BodyPart, [{
            key: _Symbol3.default.reflection,
            value: function () {
                return {
                    type: "Script.BodyPart",
                    interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                    cases: {
                        Arm: [],
                        Forearm: [],
                        Hand: []
                    }
                };
            }
        }, {
            key: "Equals",
            value: function (other) {
                return (0, _Util.equalsUnions)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function (other) {
                return (0, _Util.compareUnions)(this, other);
            }
        }]);

        return BodyPart;
    }();

    (0, _Symbol2.setType)("Script.BodyPart", BodyPart);

    function robotBodyPartToString(robotBodyPart_0, robotBodyPart_1) {
        var robotBodyPart = [robotBodyPart_0, robotBodyPart_1];

        if (robotBodyPart[0].Case === "Left") {
            if (robotBodyPart[1].Case === "Forearm") {
                return "leftForearm";
            } else {
                if (robotBodyPart[1].Case === "Hand") {
                    return "leftHand";
                } else {
                    return "leftArm";
                }
            }
        } else {
            if (robotBodyPart[1].Case === "Forearm") {
                return "rightForearm";
            } else {
                if (robotBodyPart[1].Case === "Hand") {
                    return "rightHand";
                } else {
                    return "rightArm";
                }
            }
        }
    }

    function createRobotBodyPartFromString(bodyPart) {
        var $var1 = null;

        switch (bodyPart) {
            case "rightArm":
                {
                    $var1 = [new Side("Right", []), new BodyPart("Arm", [])];
                    break;
                }

            case "rightForearm":
                {
                    $var1 = [new Side("Right", []), new BodyPart("Forearm", [])];
                    break;
                }

            case "rightHand":
                {
                    $var1 = [new Side("Right", []), new BodyPart("Hand", [])];
                    break;
                }

            case "leftArm":
                {
                    $var1 = [new Side("Left", []), new BodyPart("Arm", [])];
                    break;
                }

            case "leftForearm":
                {
                    $var1 = [new Side("Left", []), new BodyPart("Forearm", [])];
                    break;
                }

            case "leftHand":
                {
                    $var1 = [new Side("Left", []), new BodyPart("Hand", [])];
                    break;
                }

            default:
                {
                    throw new Error("C:\\Repositories\\HanoiRobot\\Script.fsx", 32, 10);
                }
        }

        return $var1;
    }

    var RobotCommand = exports.RobotCommand = function () {
        function RobotCommand(caseName, fields) {
            _classCallCheck(this, RobotCommand);

            this.Case = caseName;
            this.Fields = fields;
        }

        _createClass(RobotCommand, [{
            key: _Symbol3.default.reflection,
            value: function () {
                return {
                    type: "Script.RobotCommand",
                    interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                    cases: {
                        Activate: [],
                        Connect: [],
                        Hand: [(0, _Util.Tuple)([Side, BodyPart])],
                        Move: [(0, _Util.Tuple)([Side, BodyPart]), "number"]
                    }
                };
            }
        }, {
            key: "Equals",
            value: function (other) {
                return (0, _Util.equalsUnions)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function (other) {
                return (0, _Util.compareUnions)(this, other);
            }
        }, {
            key: "ToMessageData",
            value: function () {
                return this.Case === "Activate" ? [1, null] : this.Case === "Move" ? [2, new Body(robotBodyPartToString(this.Fields[0][0], this.Fields[0][1]), this.Fields[1])] : this.Case === "Hand" ? [3, new Body(robotBodyPartToString(this.Fields[0][0], this.Fields[0][1]), 0)] : [0, null];
            }
        }]);

        return RobotCommand;
    }();

    (0, _Symbol2.setType)("Script.RobotCommand", RobotCommand);

    var Disk = exports.Disk = function () {
        function Disk(caseName, fields) {
            _classCallCheck(this, Disk);

            this.Case = caseName;
            this.Fields = fields;
        }

        _createClass(Disk, [{
            key: _Symbol3.default.reflection,
            value: function () {
                return {
                    type: "Script.Disk",
                    interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                    cases: {
                        Disk1: [],
                        Disk2: [],
                        Disk3: []
                    }
                };
            }
        }, {
            key: "Equals",
            value: function (other) {
                return (0, _Util.equalsUnions)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function (other) {
                return (0, _Util.compareUnions)(this, other);
            }
        }], [{
            key: "Create",
            value: function (number) {
                var $var2 = null;

                switch (number) {
                    case 0:
                        {
                            $var2 = new Disk("Disk1", []);
                            break;
                        }

                    case 1:
                        {
                            $var2 = new Disk("Disk2", []);
                            break;
                        }

                    case 2:
                        {
                            $var2 = new Disk("Disk3", []);
                            break;
                        }

                    default:
                        {
                            throw new Error("C:\\Repositories\\HanoiRobot\\Script.fsx", 61, 14);
                        }
                }

                return $var2;
            }
        }]);

        return Disk;
    }();

    (0, _Symbol2.setType)("Script.Disk", Disk);

    var Tower = exports.Tower = function () {
        function Tower(caseName, fields) {
            _classCallCheck(this, Tower);

            this.Case = caseName;
            this.Fields = fields;
        }

        _createClass(Tower, [{
            key: _Symbol3.default.reflection,
            value: function () {
                return {
                    type: "Script.Tower",
                    interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                    cases: {
                        Tower1: [],
                        Tower2: [],
                        Tower3: []
                    }
                };
            }
        }, {
            key: "Equals",
            value: function (other) {
                return (0, _Util.equalsUnions)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function (other) {
                return (0, _Util.compareUnions)(this, other);
            }
        }], [{
            key: "Create",
            value: function (number) {
                var $var3 = null;

                switch (number) {
                    case 0:
                        {
                            $var3 = new Tower("Tower1", []);
                            break;
                        }

                    case 1:
                        {
                            $var3 = new Tower("Tower2", []);
                            break;
                        }

                    case 2:
                        {
                            $var3 = new Tower("Tower3", []);
                            break;
                        }

                    default:
                        {
                            throw new Error("C:\\Repositories\\HanoiRobot\\Script.fsx", 72, 14);
                        }
                }

                return $var3;
            }
        }]);

        return Tower;
    }();

    (0, _Symbol2.setType)("Script.Tower", Tower);

    var MoveDetails = exports.MoveDetails = function () {
        function MoveDetails(bodyPart, currentValue) {
            _classCallCheck(this, MoveDetails);

            this.BodyPart = bodyPart;
            this.CurrentValue = currentValue;
        }

        _createClass(MoveDetails, [{
            key: _Symbol3.default.reflection,
            value: function () {
                return {
                    type: "Script.MoveDetails",
                    interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                    properties: {
                        BodyPart: (0, _Util.Tuple)([Side, BodyPart]),
                        CurrentValue: "number"
                    }
                };
            }
        }, {
            key: "Equals",
            value: function (other) {
                return (0, _Util.equalsRecords)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function (other) {
                return (0, _Util.compareRecords)(this, other);
            }
        }]);

        return MoveDetails;
    }();

    (0, _Symbol2.setType)("Script.MoveDetails", MoveDetails);

    var HanoiState = exports.HanoiState = function () {
        function HanoiState(tower1, tower2, tower3) {
            _classCallCheck(this, HanoiState);

            this.Tower1 = tower1;
            this.Tower2 = tower2;
            this.Tower3 = tower3;
        }

        _createClass(HanoiState, [{
            key: _Symbol3.default.reflection,
            value: function () {
                return {
                    type: "Script.HanoiState",
                    interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                    properties: {
                        Tower1: (0, _Util.makeGeneric)(_List2.default, {
                            T: Disk
                        }),
                        Tower2: (0, _Util.makeGeneric)(_List2.default, {
                            T: Disk
                        }),
                        Tower3: (0, _Util.makeGeneric)(_List2.default, {
                            T: Disk
                        })
                    }
                };
            }
        }, {
            key: "Equals",
            value: function (other) {
                return (0, _Util.equalsRecords)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function (other) {
                return (0, _Util.compareRecords)(this, other);
            }
        }], [{
            key: "Create",
            value: function (arrayState) {
                var tower1 = arrayState[0];
                var tower2 = arrayState[1];
                var tower3 = arrayState[2];

                var createDisks = function createDisks(x) {
                    return (0, _List.ofArray)(Array.from((0, _Seq.map)(function (arg00) {
                        return Disk.Create(arg00);
                    }, x)));
                };

                return new HanoiState(createDisks(tower1), createDisks(tower2), createDisks(tower3));
            }
        }]);

        return HanoiState;
    }();

    (0, _Symbol2.setType)("Script.HanoiState", HanoiState);

    var RobotReaction = exports.RobotReaction = function () {
        function RobotReaction(caseName, fields) {
            _classCallCheck(this, RobotReaction);

            this.Case = caseName;
            this.Fields = fields;
        }

        _createClass(RobotReaction, [{
            key: _Symbol3.default.reflection,
            value: function () {
                return {
                    type: "Script.RobotReaction",
                    interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                    cases: {
                        Activated: [],
                        Connected: [],
                        Disk: [],
                        DiskEnter: [Disk],
                        DiskLeave: [Disk],
                        HandClosed: [],
                        HandOpened: [],
                        Hanoi: [HanoiState],
                        InvalidMessage: [],
                        LimitReached: [RobotResponse],
                        Moved: [MoveDetails],
                        TowerEnter: [Tower],
                        TowerLeave: [Tower],
                        UnknownBodyPart: []
                    }
                };
            }
        }, {
            key: "Equals",
            value: function (other) {
                return (0, _Util.equalsUnions)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function (other) {
                return (0, _Util.compareUnions)(this, other);
            }
        }], [{
            key: "FromMessage",
            value: function (x) {
                var $var4 = null;

                switch (x.type) {
                    case 0:
                        {
                            $var4 = new RobotReaction("Connected", []);
                            break;
                        }

                    case 1:
                        {
                            $var4 = new RobotReaction("Activated", []);
                            break;
                        }

                    case 2:
                        {
                            $var4 = new RobotReaction("Moved", [new MoveDetails(createRobotBodyPartFromString(x.body.bodyPart), x.body.currentValue)]);
                            break;
                        }

                    case 3:
                        {
                            $var4 = new RobotReaction("LimitReached", [x]);
                            break;
                        }

                    case 4:
                        {
                            $var4 = new RobotReaction("HandOpened", []);
                            break;
                        }

                    case 5:
                        {
                            $var4 = new RobotReaction("HandClosed", []);
                            break;
                        }

                    case 6:
                        {
                            $var4 = new RobotReaction("Disk", []);
                            break;
                        }

                    case 7:
                        {
                            $var4 = new RobotReaction("DiskEnter", [Disk.Create(x.body.diskNumber)]);
                            break;
                        }

                    case 8:
                        {
                            $var4 = new RobotReaction("DiskLeave", [Disk.Create(x.body.diskNumber)]);
                            break;
                        }

                    case 9:
                        {
                            $var4 = new RobotReaction("Hanoi", [HanoiState.Create(x.body.state)]);
                            break;
                        }

                    case 16:
                        {
                            $var4 = new RobotReaction("TowerEnter", [Tower.Create(x.body.towerNumber)]);
                            break;
                        }

                    case 17:
                        {
                            $var4 = new RobotReaction("TowerLeave", [Tower.Create(x.body.towerNumber)]);
                            break;
                        }

                    case 18:
                        {
                            $var4 = new RobotReaction("InvalidMessage", []);
                            break;
                        }

                    case 19:
                        {
                            $var4 = new RobotReaction("UnknownBodyPart", []);
                            break;
                        }

                    default:
                        {
                            throw new Error("C:\\Repositories\\HanoiRobot\\Script.fsx", 105, 14);
                        }
                }

                return $var4;
            }
        }]);

        return RobotReaction;
    }();

    (0, _Symbol2.setType)("Script.RobotReaction", RobotReaction);
    var robotEvent = exports.robotEvent = new _Event3.default();
    var robotPartsEvent = exports.robotPartsEvent = new _Event3.default();
    var i = exports.i = 0;

    function listenToRobot(me) {
        return i < 1000 ? function () {
            var msg = JSON.parse(me.data);
            var tp = msg;
            (0, _String.fsFormat)("%A")(function (x) {
                console.log(x);
            })(msg);
            robotEvent.Trigger(RobotReaction.FromMessage(tp));
            robotPartsEvent.Trigger(RobotReaction.FromMessage(tp));
            exports.i = i = i + 1;
            return {};
        }() : {};
    }

    function buildMessage(command) {
        var patternInput = command.ToMessageData();
        return function (arg00) {
            return JSON.stringify(arg00);
        }(new Message(patternInput[0], patternInput[1]));
    }

    function sendMessageToRobot(iframe, port, commandMessage) {
        var message = buildMessage(commandMessage);
        var ports = port == null ? [] : [port];
        iframe.contentWindow.postMessage(message, "*", ports);
    }

    var cover = exports.cover = document.getElementById("cover");
    var messageChannel = exports.messageChannel = new MessageChannel();

    var executeCommand = exports.executeCommand = function () {
        var port = null;
        return function (commandMessage) {
            sendMessageToRobot(cover, port, commandMessage);
        };
    }();

    function moved(_arg1) {
        return _arg1.Case === "Moved" ? true : false;
    }

    function onlyHanoi(_arg1) {
        return _arg1.Case === "Hanoi" ? true : false;
    }

    function onlyDiskEnter(_arg1) {
        return _arg1.Case === "DiskEnter" ? true : false;
    }

    function onlyLimitReached(_arg1) {
        return _arg1.Case === "LimitReached" ? true : false;
    }

    function onlyDisk(_arg1) {
        return _arg1.Case === "Disk" ? true : false;
    }

    function onlyTowerEnter(x, _arg1) {
        var _target1 = function _target1() {
            return false;
        };

        if (_arg1.Case === "TowerEnter") {
            if (x.Equals(_arg1.Fields[0])) {
                var y = _arg1.Fields[0];
                return true;
            } else {
                return _target1();
            }
        } else {
            return _target1();
        }
    }

    var initialState = exports.initialState = [0, 0, 0, 0, 0, 0];

    function bodyPartToIdx(_arg1_0, _arg1_1) {
        var _arg1 = [_arg1_0, _arg1_1];

        if (_arg1[0].Case === "Left") {
            if (_arg1[1].Case === "Forearm") {
                return 4;
            } else {
                if (_arg1[1].Case === "Hand") {
                    return 5;
                } else {
                    return 3;
                }
            }
        } else {
            if (_arg1[1].Case === "Forearm") {
                return 1;
            } else {
                if (_arg1[1].Case === "Hand") {
                    return 2;
                } else {
                    return 0;
                }
            }
        }
    }

    function only(x) {
        return function (source) {
            return (0, _Observable.filter)(x, source);
        }(robotEvent.Publish);
    }

    var tower1Pos = exports.tower1Pos = (0, _List.ofArray)([-19, 59, 20]);
    var tower2Pos = exports.tower2Pos = (0, _List.ofArray)([-18, 6, 21]);

    function rightRobotParts(side) {
        var tupledArg = (0, _Observable.split)(function (_arg1) {
            var _target1 = function _target1(arg) {
                return new _Choice2.default("Choice2Of2", [arg]);
            };

            if (_arg1.Case === "Moved") {
                if (_arg1.Fields[0].BodyPart[1].Case === "Arm") {
                    var arg = _arg1;
                    var side_1 = _arg1.Fields[0].BodyPart[0];
                    return new _Choice2.default("Choice1Of2", [arg]);
                } else {
                    return _target1(_arg1);
                }
            } else {
                return _target1(_arg1);
            }
        }, only(function (_arg1) {
            return moved(_arg1);
        }));

        var func = function func(arm) {
            return function (rest) {
                var patternInput = (0, _Observable.split)(function (_arg2) {
                    var _target1 = function _target1(arg) {
                        return new _Choice2.default("Choice2Of2", [arg]);
                    };

                    if (_arg2.Case === "Moved") {
                        if (_arg2.Fields[0].BodyPart[1].Case === "Forearm") {
                            var arg = _arg2;
                            var side_1 = _arg2.Fields[0].BodyPart[0];
                            return new _Choice2.default("Choice1Of2", [arg]);
                        } else {
                            return _target1(_arg2);
                        }
                    } else {
                        return _target1(_arg2);
                    }
                }, rest);
                return [arm, patternInput[0], patternInput[1]];
            };
        };

        return func(tupledArg[0])(tupledArg[1]);
    }

    function robotState(state) {
        return function () {
            var collector = function collector(previousState) {
                return function (_arg1) {
                    return _arg1.Case === "Moved" ? (previousState[bodyPartToIdx(_arg1.Fields[0].BodyPart[0], _arg1.Fields[0].BodyPart[1])] = _arg1.Fields[0].CurrentValue, previousState) : function () {
                        throw new Error("C:\\Repositories\\HanoiRobot\\Script.fsx", 209, 63);
                    }();
                };
            };

            return function (source) {
                return (0, _Observable.scan)(function ($var5, $var6) {
                    return collector($var5)($var6);
                }, state, source);
            };
        }()(only(function (_arg1) {
            return moved(_arg1);
        }));
    }

    function hanoiState() {
        return (0, _Observable.scan)(function (previousHanoiState, _arg1) {
            return _arg1.Case === "Hanoi" ? _arg1.Fields[0] : function () {
                throw new Error("C:\\Repositories\\HanoiRobot\\Script.fsx", 216, 48);
            }();
        }, new HanoiState((0, _List.ofArray)([new Disk("Disk3", []), new Disk("Disk2", []), new Disk("Disk1", [])]), new _List2.default(), new _List2.default()), function (source) {
            return (0, _Observable.filter)(function (_arg1) {
                return onlyHanoi(_arg1);
            }, source);
        }(robotEvent.Publish));
    }

    function moveBodyPart(current, target, bodyPart_0, bodyPart_1) {
        var bodyPart = [bodyPart_0, bodyPart_1];

        if (!(0, _Util.equals)(current, target)) {
            var moveFactor = 1;
            var moveValue = (0, _Util.compare)(current, target) < 0 ? 1 : -1;
            executeCommand(new RobotCommand("Move", [bodyPart, moveFactor * moveValue]));
        }
    }

    function moveBodyPartTo(side, targetPos, state) {
        var patternInput = rightRobotParts(side);
        var armSubscriber = (0, _Observable.subscribe)(function (_arg1) {
            if (_arg1.Case === "Moved") {
                moveBodyPart(_arg1.Fields[0].CurrentValue, (0, _Seq.item)(0, targetPos), side, new BodyPart("Arm", []));
            }
        }, patternInput[0]);
        var forearmSubscriber = (0, _Observable.subscribe)(function (_arg2) {
            if (_arg2.Case === "Moved") {
                moveBodyPart(_arg2.Fields[0].CurrentValue, (0, _Seq.item)(1, targetPos), side, new BodyPart("Forearm", []));
            }
        }, patternInput[1]);
        var handSubscriber = (0, _Observable.subscribe)(function (_arg3) {
            if (_arg3.Case === "Moved") {
                moveBodyPart(_arg3.Fields[0].CurrentValue, (0, _Seq.item)(2, targetPos), side, new BodyPart("Hand", []));
            }
        }, patternInput[2]);
        var patternInput_1 = state[bodyPartToIdx(side, new BodyPart("Arm", []))];

        if (patternInput_1 != null) {
            var patternInput_2 = state[bodyPartToIdx(side, new BodyPart("Forearm", []))];

            if (patternInput_2 != null) {
                var patternInput_3 = state[bodyPartToIdx(side, new BodyPart("Hand", []))];

                if (patternInput_3 != null) {
                    var _ref;

                    moveBodyPart(patternInput_1, (0, _Seq.item)(0, targetPos), side, new BodyPart("Arm", []));
                    moveBodyPart(patternInput_2, (0, _Seq.item)(1, targetPos), side, new BodyPart("Forearm", []));
                    moveBodyPart(patternInput_3, (0, _Seq.item)(2, targetPos), side, new BodyPart("Hand", []));
                    return _ref = {}, _defineProperty(_ref, _Symbol3.default.reflection, {
                        "interfaces": ["System.IDisposable"]
                    }), _defineProperty(_ref, "Dispose", function () {
                        armSubscriber.Dispose();
                        forearmSubscriber.Dispose();
                        handSubscriber.Dispose();
                    }), _ref;
                } else {
                    throw new Error("C:\\Repositories\\HanoiRobot\\Script.fsx", 250, 8);
                }
            } else {
                throw new Error("C:\\Repositories\\HanoiRobot\\Script.fsx", 249, 8);
            }
        } else {
            throw new Error("C:\\Repositories\\HanoiRobot\\Script.fsx", 248, 8);
        }
    }

    function pickDisk(side) {
        executeCommand(new RobotCommand("Hand", [[side, new BodyPart("Hand", [])]]));
    }

    function dropDisk(side) {
        executeCommand(new RobotCommand("Hand", [[side, new BodyPart("Hand", [])]]));
    }

    function move(state, source, target) {
        return function (builder_) {
            return builder_.Delay(function () {
                var matchValue = [source, target];

                var _target1 = function _target1() {
                    return builder_.Return(state);
                };

                if (matchValue[0].Case === "Tower1") {
                    if (matchValue[1].Case === "Tower2") {
                        var _ret = function () {
                            var subscriber = moveBodyPartTo(new Side("Right", []), tower1Pos, state);
                            var completed = false;
                            var pickDiskSubscriber = (0, _Observable.subscribe)(function (_arg1) {
                                completed = true;
                            }, only(function (_arg1) {
                                return _arg1.Case === "DiskEnter" ? true : false;
                            }));
                            return {
                                v: builder_.Combine(builder_.While(function () {
                                    return completed === false;
                                }, builder_.Delay(function () {
                                    return builder_.Bind((0, _Async.sleep)(200), function () {
                                        return builder_.Return();
                                    });
                                })), builder_.Delay(function () {
                                    subscriber.Dispose();
                                    pickDiskSubscriber.Dispose();
                                    pickDisk(new Side("Right", []));
                                    return builder_.Bind((0, _Async.sleep)(200), function () {
                                        state[0] = (0, _Seq.item)(0, tower1Pos);
                                        state[1] = (0, _Seq.item)(1, tower1Pos);
                                        state[2] = (0, _Seq.item)(2, tower1Pos);
                                        var moveToTargetSubscriber = moveBodyPartTo(new Side("Right", []), tower2Pos, state);
                                        completed = false;
                                        var dropDiskSubscriber = (0, _Observable.subscribe)(function (x) {
                                            completed = true;
                                        }, only(function (_arg4) {
                                            return _arg4.Case === "TowerEnter" ? true : false;
                                        }));
                                        return builder_.Combine(builder_.While(function () {
                                            return completed === false;
                                        }, builder_.Delay(function () {
                                            return builder_.Bind((0, _Async.sleep)(200), function () {
                                                return builder_.Return();
                                            });
                                        })), builder_.Delay(function () {
                                            moveToTargetSubscriber.Dispose();
                                            dropDiskSubscriber.Dispose();
                                            return builder_.Bind((0, _Async.sleep)(200), function () {
                                                dropDisk(new Side("Right", []));
                                                state[0] = (0, _Seq.item)(0, tower2Pos);
                                                state[1] = (0, _Seq.item)(1, tower2Pos);
                                                state[2] = (0, _Seq.item)(2, tower2Pos);
                                                return builder_.Return(state);
                                            });
                                        }));
                                    });
                                }))
                            };
                        }();

                        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
                    } else {
                        return _target1();
                    }
                } else {
                    return _target1();
                }
            });
        }(_AsyncBuilder.singleton);
    }

    function hanoi(state, n, source, target) {
        return function (builder_) {
            return builder_.Delay(function () {
                return n > 0 ? builder_.Bind(hanoi(state, n - 1, source, target), function (_arg1) {
                    return builder_.Bind(move(_arg1, source, new Tower("Tower2", [])), function (_arg2) {
                        return builder_.Return(_arg2);
                    });
                }) : builder_.Return(state);
            });
        }(_AsyncBuilder.singleton);
    }

    function startRobotAgent() {
        sendMessageToRobot(cover, messageChannel.port2, new RobotCommand("Connect", []));

        messageChannel.port1.onmessage = function (delegateArg0) {
            return listenToRobot(delegateArg0);
        };

        (0, _Observable.add)(function (x) {
            executeCommand(new RobotCommand("Activate", []));
            (0, _Observable.add)(function (x_1) {
                (function (arg00) {
                    (0, _Async.startImmediate)(arg00);
                })((0, _Async.ignore)(hanoi(initialState, 3, new Tower("Tower1", []), new Tower("Tower3", []))));
            }, (0, _Observable.filter)(function (_arg2) {
                return _arg2.Case === "Activated" ? true : false;
            }, robotEvent.Publish));
        }, (0, _Observable.filter)(function (_arg1) {
            return _arg1.Case === "Connected" ? true : false;
        }, robotEvent.Publish));
    }

    cover.addEventListener("load", function () {
        startRobotAgent();
    });
});
//# sourceMappingURL=Script.js.map