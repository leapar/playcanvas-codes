var UiControl = pc.createScript("uiControl");
UiControl.attributes.add("uiAssets", {
    type: "asset",
    array: !0
}),
UiControl.attributes.add("uiHtml", {
    type: "asset"
}),
UiControl.prototype.initialize = function() {
    document.body.addEventListener("touchmove", function(e) {
        e.preventDefault()
    }, {
        passive: !1
    }),
    $(document.body).append(this.editImgUrl(this.uiHtml.resource));
    for (var e = 0; e < this.uiAssets.length; e++)
        this.createElement(this.uiAssets[e])
}
,
UiControl.prototype.createElement = function(e) {
    switch (e.type) {
    case "css":
        var t = document.createElement("style");
        t.innerHTML = this.editImgUrl(e.resource),
        document.head.appendChild(t);
        break;
    case "script":
        var i = document.createElement("script");
        t.src = e.getFileUrl(),
        document.body.appendChild(i)
    }
}
,
UiControl.prototype.editImgUrl = function(e) {
    var t = e.match(/\$(\d){8}\%/g);
    if (null === t)
        return e;
    for (var i = 0; i < t.length; i++) {
        var s = t[i].substr(1, 8)
          , n = this.app.assets.get(s);
        if (null != n) {
            var a = n.getFileUrl();
            e = e.replace(t[i], a)
        }
    }
    return e
}
;
var CameraHandle = pc.createScript("cameraHandle");
CameraHandle.attributes.add("StepData", {
    type: "asset"
}),
CameraHandle.camScript,
CameraHandle.prototype.initialize = function() {
    CameraHandle.camScript = this.entity.script.camera,
    pc.events.on("StepChange", this.onStepChange, this),
    this.stepData = this.StepData.resources
}
,
CameraHandle.prototype.onStepChange = function(e) {
    var t = new pc.Vec2(this.stepData[e].rotX,this.stepData[e].rotY)
      , i = this.stepData[e].dist
      , s = this.stepData[e].panX
      , n = this.stepData[e].panY;
    CameraHandle.camScript.translateCam(s, n),
    CameraHandle.camScript.rotateByDegree(t, i),
    CameraHandle.camScript.rotLocked = this.stepData[e].lockRot,
    CameraHandle.camScript.zoomLocked = this.stepData[e].lockZoom,
    CameraHandle.camScript.panLocked = this.stepData[e].lockPan,
    CameraHandle.camScript.rotXLocked = this.stepData[e].lockRotX,
    CameraHandle.camScript.rotYLocked = this.stepData[e].lockRotY,
    CameraHandle.camScript.lockX = this.stepData[e].lockX,
    CameraHandle.camScript.lockY = this.stepData[e].lockY,
    CameraHandle.camScript.step_Rotate = this.stepData[e].autoRotate,
    null !== this.stepData[e].maxup ? CameraHandle.camScript.maxElevationUp = this.stepData[e].maxup : CameraHandle.camScript.maxElevationUp = angle_maxUp,
    null !== this.stepData[e].maxdown ? CameraHandle.camScript.maxElevationDown = this.stepData[e].maxdown : CameraHandle.camScript.maxElevationDown = angle_maxDown,
    null !== this.stepData[e].maxdist ? CameraHandle.camScript.maxDistance = this.stepData[e].maxdist : CameraHandle.camScript.maxDistance = distance_max,
    null !== this.stepData[e].mindist ? CameraHandle.camScript.minDistance = this.stepData[e].mindist : CameraHandle.camScript.minDistance = distance_min
}
;
var UieventControl = pc.createScript("uieventControl");
UieventControl.attributes.add("TotalStep", {
    type: "number"
}),
UieventControl.attributes.add("MainCamera", {
    type: "entity"
}),
UieventControl.attributes.add("stp4Pos", {
    type: "entity",
    array: !0
});
var total_number, div, mScroll, timepoint, timelineg, timeCanRot, current_number = 0, str_index = "msg_1", canclick = !1, isWeChart = !1;
UieventControl.prototype.initialize = function() {
    /*var e = document.createElement("script");
    e.src = "https://res.wx.qq.com/open/js/jweixin-1.3.2.js",
    document.body.appendChild(e),
    e.addEventListener("load", function() {
        wx.miniProgram.getEnv(function(e) {
            isWeChart = e.miniprogram
        })
    }),*/
    $("#rightBtn").on("click", this.changeStep),
    $("#leftBtn").on("click", this.changeStep),
    $("#btnlink").on("click", this.BtnLink),
    $(".btnAudio").on("click", this.BtnPlay),
    $("#stp3_btn1").on("click", function() {
        pc.events.fire("PointChange_3", 1)
    }),
    $("#stp3_btn2").on("click", function() {
        pc.events.fire("PointChange_3", 2)
    }),
    $("#stp3_btn3").on("click", function() {
        pc.events.fire("PointChange_3", 3)
    }),
    $("#stp3_btn4").on("click", function() {
        pc.events.fire("PointChange_3", 4)
    }),
    $("#stp3_btn5").on("click", function() {
        pc.events.fire("PointChange_3", 5)
    }),
    $("#CS").on("click", function() {
        canclick && pc.events.fire("PointChange_4", 1)
    }),
    $("#FJ").on("click", function() {
        canclick && pc.events.fire("PointChange_4", 2)
    }),
    $("#WD").on("click", function() {
        canclick && pc.events.fire("PointChange_4", 3)
    }),
    $("#MZ").on("click", function() {
        canclick && pc.events.fire("PointChange_4", 4)
    }),
    pc.events.on("PointChange_3", this.Stp3_Point, this),
    pc.events.on("PointChange_4", this.Stp4_Point, this),
    total_number = this.TotalStep - 1,
    this.bl_First = !0,
    pc.events.on("StepChange", this.OnStepChange, this),
    document.getElementById("timeline").style.width = document.body.offsetWidth + "px",
    (div = this).stp1 = document.getElementsByClassName("step1title")[0].style,
    div.timelinegold = document.getElementsByClassName("timelinegold")[0].style,
    div.timepoint = document.getElementsByClassName("timepoint")[0].style,
    div.timeyear = document.getElementsByClassName("timeyear")[0].style,
    div.timenum = document.getElementsByClassName("timenum")[0].style,
    div.timepoint2 = document.getElementsByClassName("timepoint2")[0].style,
    div.timeyear2 = document.getElementsByClassName("timeyear2")[0].style,
    div.timenum2 = document.getElementsByClassName("timenum2")[0].style,
    div.how = document.getElementsByClassName("imagehow")[0].style,
    div.title = document.getElementsByClassName("stptitle"),
    div.stp2bg1 = document.getElementsByClassName("stp2bg1")[0].style,
    div.stp2bg2 = document.getElementsByClassName("stp2bg2")[0].style,
    div.stp2icon = document.getElementsByClassName("stp2icon")[0].style,
    div.stp3btn = document.getElementsByClassName("stp3PointActive"),
    div.stp5link = document.getElementById("btnlink").style,
    div.stp5msg = document.getElementsByClassName("stp5msg")[0].style,
    div.timelinegold.overflow = "hidden",
    mScroll = new IScroll("#wrapper1",{
        scrollY: !0,
        freeScroll: !0,
        scrollbars: !0,
        bounce: !1
    }),
    div.stp2bg2.display = "none",
    this.stp4_ISPos = !1,
    this.point_1 = new pc.Vec3,
    this.point_2 = new pc.Vec3,
    this.point_3 = new pc.Vec3,
    this.point_4 = new pc.Vec3,
    this.Dong = 0,
    this.dong = !0,
    this.fu = !1,
    this.dong1 = !0,
    this.dong2 = !0,
    this.dong3 = !0,
    this.dong4 = !0
}
,
UieventControl.prototype.BtnPlay = function(e) {
    "isplay" === e.currentTarget.id ? (pc.events.fire("audio:pause", e),
    document.getElementById("isplay").style.display = "none",
    document.getElementById("noplay").style.display = "block") : (pc.events.fire("audio:play", e),
    document.getElementById("isplay").style.display = "block",
    document.getElementById("noplay").style.display = "none")
}
,
UieventControl.prototype.BtnLink = function() {
    pc.events.fire("replace:share")
}
,
UieventControl.prototype.OnStepChange = function(e) {
    if (!(total_number < e)) {
        clearTimeout(timelineg),
        clearTimeout(timepoint),
        clearTimeout(timeCanRot);
        for (var t = 0; t < div.title.length; t++)
            div.title[t].style.opacity = e - 1 === t ? 1 : 0;
        switch (1 !== e ? (div.stp2bg1.opacity = 0,
        div.stp2bg2.display = "none",
        div.stp2icon.opacity = 0) : (div.stp2bg1.opacity = 1,
        div.stp2bg2.display = "block",
        div.stp2icon.opacity = 1),
        4 !== e ? (div.stp5msg.opacity = 0,
        div.stp5link.display = "none") : (div.stp5msg.opacity = 1,
        div.stp5link.display = "block"),
        e) {
        case 0:
            this.bl_First ? (this.bl_First = !1,
            timelineg = setTimeout(function() {
                div.timelinegold.width = "100%",
                div.timepoint.transform = "scale(1)",
                div.timeyear.opacity = 1,
                div.timenum.opacity = 1,
                div.timepoint2.transform = "scale(1)",
                div.timeyear2.opacity = 1,
                div.timenum2.opacity = 1,
                div.how.opacity = 1
            }
            .bind(this), 1200),
            timepoint = setTimeout(function() {
                div.timelinegold.overflow = "unset",
                canclick = !0,
                document.getElementById("rightBtn").style.opacity = 1,
                document.getElementById("leftBtn").style.opacity = 1,
                document.getElementsByClassName("iconElement")[0].style.opacity = 1
            }
            .bind(this), 2200)) : (div.how.opacity = 0,
            div.stp1.opacity = 1,
            clearTimeout(timelineg),
            clearTimeout(timepoint),
            div.timelinegold.transition = "all 0.3s",
            div.timepoint.transition = "all 0.3s",
            div.timeyear.transition = "all 0.3s",
            div.timenum.transition = "all 0.3s",
            div.timepoint2.transition = "all 0.3s",
            div.timeyear2.transition = "all 0.3s",
            div.timenum2.transition = "all 0.3s",
            div.timeyear.opacity = 1,
            div.timenum.opacity = 1,
            div.timepoint.transform = "scale(1)",
            div.timeyear2.opacity = 1,
            div.timenum2.opacity = 1,
            div.timepoint2.transform = "scale(1)",
            div.timelinegold.width = "100%",
            div.timelinegold.opacity = 1);
            break;
        case 1:
            mScroll.refresh(),
            div.timelinegold.opacity = 0,
            div.stp1.opacity = 0,
            this.Step3(0),
            this.Stp3_Hide(),
            floor3_point = 0;
            break;
        case 2:
            floor3_point = 0,
            div.timelinegold.opacity = 0,
            div.stp1.opacity = 0,
            this.Step3(1),
            this.Step4(0),
            this.Stp4_Hide(),
            floor4_point = 0,
            CanRot = !1;
            break;
        case 3:
            canclick = !1,
            timeCanRot = setTimeout(function() {
                canclick = CanRot = !0
            }
            .bind(this), 1200),
            floor4_point = 0,
            div.timelinegold.opacity = 0,
            div.stp1.opacity = 0,
            this.Step3(0),
            this.Step4(1),
            this.Stp3_Hide(),
            floor3_point = 0;
            break;
        case 4:
            CanRot = !1,
            div.timelinegold.opacity = 0,
            div.stp1.opacity = 0,
            this.Step4(0),
            this.Stp4_Hide(),
            floor4_point = 0
        }
    }
}
,
UieventControl.prototype.changeStep = function(e) {
    if (canclick) {
        "rightBtn" === e.currentTarget.id ? current_number++ : current_number--,
        total_number < current_number ? current_number = 0 : current_number < 0 && (current_number = total_number),
        document.getElementsByClassName("iconActive")[0].className = "iconNormal";
        for (var t = 0; t < document.getElementsByClassName("iconNormal").length; t++)
            t === current_number && (document.getElementsByClassName("iconNormal")[current_number].className = "iconActive");
        pc.events.fire("StepChange", current_number)
    }
}
;
var floor3_point = 0;
UieventControl.prototype.Stp3_Hide = function() {
    for (var e = 0; e < document.getElementsByClassName("stp3PointActive").length; e++)
        document.getElementsByClassName("stp3PointActive")[e].style.opacity = 0;
    document.getElementsByClassName("stp3ZL")[0].style.opacity = 0,
    document.getElementById("stp3_BG").style.opacity = 0
}
,
UieventControl.prototype.Stp3_Point = function(e) {
    this.Stp3_Hide(),
    1 === e && (1 == floor3_point ? (pc.events.fire("StepChange", 2),
    floor3_point = 0) : (floor3_point = 1,
    pc.events.fire("StepChange", 5),
    document.getElementsByClassName("stp3PointActive")[0].style.opacity = 1,
    document.getElementById("stp3_BG").style.opacity = 1)),
    2 === e && (2 == floor3_point ? (pc.events.fire("StepChange", 2),
    floor3_point = 0) : (floor3_point = 2,
    pc.events.fire("StepChange", 6),
    document.getElementsByClassName("stp3PointActive")[1].style.opacity = 1,
    document.getElementById("stp3_BG").style.opacity = 1)),
    3 === e && (3 == floor3_point ? (pc.events.fire("StepChange", 2),
    floor3_point = 0) : (floor3_point = 3,
    pc.events.fire("StepChange", 7),
    document.getElementsByClassName("stp3PointActive")[2].style.opacity = 1,
    document.getElementById("stp3_BG").style.opacity = 1)),
    4 === e && (4 == floor3_point ? (pc.events.fire("StepChange", 2),
    floor3_point = 0) : (floor3_point = 4,
    pc.events.fire("StepChange", 8),
    document.getElementsByClassName("stp3PointActive")[3].style.opacity = 1,
    document.getElementById("stp3_BG").style.opacity = 1)),
    5 === e && (5 == floor3_point ? (pc.events.fire("StepChange", 2),
    floor3_point = 0) : (floor3_point = 5,
    pc.events.fire("StepChange", 9),
    document.getElementsByClassName("stp3PointActive")[4].style.opacity = 1,
    document.getElementById("stp3_BG").style.opacity = 1))
}
;
var floor4_point = 0;
UieventControl.prototype.Stp4_Hide = function() {
    for (var e = 0; e < document.getElementsByClassName("stp4PosActive").length; e++)
        document.getElementsByClassName("stp4PosActive")[e].style.opacity = 0;
    for (e = 0; e < document.getElementsByClassName("stp4msg").length; e++)
        document.getElementsByClassName("stp4msg")[e].style.opacity = 0;
    document.getElementsByClassName("stp4top")[0].style.opacity = 0,
    document.getElementsByClassName("stp4PosAni")[1].style.opacity = 0,
    document.getElementsByClassName("stp4PosAni")[3].style.opacity = 0,
    document.getElementsByClassName("stp4PosAni")[5].style.opacity = 0,
    document.getElementsByClassName("stp4PosAni")[7].style.opacity = 0,
    this.dong1 = !0,
    this.dong2 = !0,
    this.dong3 = !0,
    this.dong4 = !0
}
,
UieventControl.prototype.Stp4_Point = function(e) {
    this.Stp4_Hide(),
    1 === e && (1 == floor4_point ? (pc.events.fire("StepChange", 3),
    floor4_point = 0) : (document.getElementsByClassName("stp4PosActive")[0].style.opacity = 1,
    document.getElementsByClassName("stp4msg")[0].style.opacity = 1,
    document.getElementsByClassName("stp4PosAni")[1].style.opacity = 1,
    pc.events.fire("StepChange", 10),
    floor4_point = 1,
    this.dong1 = !1)),
    2 === e && (2 == floor4_point ? (pc.events.fire("StepChange", 3),
    floor4_point = 0) : (document.getElementsByClassName("stp4PosActive")[1].style.opacity = 1,
    document.getElementsByClassName("stp4msg")[1].style.opacity = 1,
    document.getElementsByClassName("stp4PosAni")[3].style.opacity = 1,
    pc.events.fire("StepChange", 11),
    floor4_point = 2,
    this.dong2 = !1)),
    3 === e && (3 == floor4_point ? (pc.events.fire("StepChange", 3),
    floor4_point = 0) : (document.getElementsByClassName("stp4PosActive")[2].style.opacity = 1,
    document.getElementsByClassName("stp4msg")[2].style.opacity = 1,
    document.getElementsByClassName("stp4PosAni")[5].style.opacity = 1,
    pc.events.fire("StepChange", 12),
    floor4_point = 3,
    this.dong3 = !1)),
    4 === e && (4 == floor4_point ? (pc.events.fire("StepChange", 3),
    floor4_point = 0) : (document.getElementsByClassName("stp4PosActive")[3].style.opacity = 1,
    document.getElementsByClassName("stp4msg")[3].style.opacity = 1,
    document.getElementsByClassName("stp4PosAni")[7].style.opacity = 1,
    pc.events.fire("StepChange", 13),
    floor4_point = 4,
    this.dong4 = !1))
}
,
UieventControl.prototype.Step3 = function(e) {
    0 === e ? $(".stp3PointNormal").css("pointer-events", "none") : $(".stp3PointNormal").css("pointer-events", "auto"),
    document.getElementById("stp3").style.opacity = e,
    document.getElementsByClassName("stp3msg")[0].style.opacity = e,
    document.getElementsByClassName("stp3ZL")[0].style.opacity = e
}
,
UieventControl.prototype.Step4 = function(e) {
    0 === e ? ($(".stp4Pos").css("pointer-events", "none"),
    this.stp4_ISPos = !1) : ($(".stp4Pos").css("pointer-events", "auto"),
    this.stp4_ISPos = !0),
    document.getElementById("stp4_Pos").style.opacity = e,
    document.getElementsByClassName("stp4top")[0].style.opacity = e
}
,
UieventControl.prototype.update = function(e) {
    this.stp4_ISPos && (this.MainCamera.camera.worldToScreen(this.stp4Pos[0].getPosition(), this.point_1),
    this.MainCamera.camera.worldToScreen(this.stp4Pos[1].getPosition(), this.point_2),
    this.MainCamera.camera.worldToScreen(this.stp4Pos[2].getPosition(), this.point_3),
    this.MainCamera.camera.worldToScreen(this.stp4Pos[3].getPosition(), this.point_4),
    this.dong && (this.Dong < 0 && (this.fu = !1),
    8 <= this.Dong && (this.fu = !0),
    this.fu && (e = -e),
    this.Dong += 5 * e,
    this.dong1 && (this.point_1.y += -2 * this.Dong),
    this.dong2 && (this.point_2.y += 1 * this.Dong),
    this.dong3 && (this.point_3.y += -1 * this.Dong),
    this.dong4 && (this.point_4.y += 2 * this.Dong)),
    document.getElementById("CS").style.transform = "translate(" + this.point_1.x + "px," + this.point_1.y + "px)",
    document.getElementById("FJ").style.transform = "translate(" + this.point_2.x + "px," + this.point_2.y + "px)",
    document.getElementById("WD").style.transform = "translate(" + this.point_3.x + "px," + this.point_3.y + "px)",
    document.getElementById("MZ").style.transform = "translate(" + this.point_4.x + "px," + this.point_4.y + "px)")
}
;
var cachedX, cachedY, pinchScale, panWheelX, panWheelY, currtentValue, Camera = pc.createScript("camera");
Camera.attributes.add("maxElevationUp", {
    type: "number",
    default: -90
}),
Camera.attributes.add("maxElevationDown", {
    type: "number",
    default: 0
}),
Camera.attributes.add("maxElevationLeft", {
    type: "number",
    default: -30
}),
Camera.attributes.add("maxElevationRight", {
    type: "number",
    default: 30
}),
Camera.attributes.add("rotLerpSpeed", {
    type: "number",
    default: .3
}),
Camera.attributes.add("panLerpSpeed", {
    type: "number",
    default: .2
}),
Camera.attributes.add("zoomLerpSpeed", {
    type: "number",
    default: .2
}),
Camera.attributes.add("pinchSensitivity", {
    type: "number",
    default: .1
}),
Camera.attributes.add("yawSensitivity", {
    type: "number",
    default: .2
}),
Camera.attributes.add("minDistance", {
    type: "number",
    default: .5
}),
Camera.attributes.add("maxDistance", {
    type: "number",
    default: 10
}),
Camera.attributes.add("handpickCenter", {
    type: "entity"
}),
Camera.attributes.add("WY", {
    type: "entity"
}),
Camera.attributes.add("SJ", {
    type: "entity"
}),
Camera.attributes.add("YG", {
    type: "entity"
}),
Camera.attributes.add("YC", {
    type: "entity"
}),
Camera.attributes.add("ZL", {
    type: "entity"
}),
Camera.attributes.add("WaiteNum", {
    type: "number",
    default: 5
}),
Camera.attributes.add("autoSpeed", {
    type: "number",
    default: 30
}),
Camera.attributes.add("clampRotY", {
    type: "boolean",
    default: !1
});
var angle_maxUp, angle_maxDown, distance_max, distance_min, bl_AutoRotate = !1, fl_time = 0, blCanControl = !0, CanRot = !1, startY = 0;
Object.assign(pc.events, {
    _callbacks: {},
    _callbackActive: {}
}),
Camera.prototype.swap = function(e) {}
,
Camera.extend({
    initialize: function() {
        angle_maxUp = this.maxElevationUp,
        angle_maxDown = this.maxElevationDown,
        distance_max = this.maxDistance,
        distance_min = this.minDistance,
        pc.events.on("StepChange", this.onStepChange, this),
        (window.camera = this).viewPos = new pc.Vec3,
        this.targetViewPos = new pc.Vec3,
        this.viewPosOffset = new pc.Vec3,
        this.targetViewPosOffset = new pc.Vec3,
        this.distance = 3,
        this.targetDistance = 3,
        this.rotX = 0,
        this.rotY = -1.6,
        this.targetRotX = 0,
        this.targetRotY = -1.6,
        this.quatA = new pc.Quat,
        this.quatB = new pc.Quat,
        this.transformStarted = !1,
        this.panX = 0,
        this.panY = 1.7,
        this.targetPanX = 0,
        this.targetPanY = 1.7,
        this.zoomLocked = !0,
        this.rotLocked = !0,
        this.panLocked = !0,
        this.lockX = !1,
        this.lockY = !1,
        this.runEnable = !0,
        this.operating = !1,
        this.step_Rotate = !1,
        this.endRot = 0,
        this.app.mouse.disableContextMenu(),
        this.setBestCameraPositionForModel(),
        this.camAnchor = this.entity.getParent().findByName("CamAnchor"),
        this.hammer = new Hammer(this.app.graphicsDevice.canvas),
        this.hammer.add(new Hammer.Pan({
            event: "pan2",
            pointers: 2,
            threshold: 35
        })),
        this.hammer.get("pinch").set({
            threshold: 0
        }).recognizeWith([this.hammer.get("pan2")]),
        this.hammer.get("pan").set({
            threshold: 0
        }),
        this.hammer.on("pan2start", function(e) {
            panWheelX = e.center.x,
            panWheelY = e.center.y
        }
        .bind(this)),
        this.hammer.on("pan2move", function(e) {
            var t = this.distance / 500
              , i = e.center.x - panWheelX
              , s = e.center.y - panWheelY;
            this.pan(i * -t, s * t),
            panWheelX = e.center.x,
            panWheelY = e.center.y
        }
        .bind(this)),
        pc.events.on("StepChange", function(e) {
            this.targetViewPos.copy(this.handpickCenter.getPosition()),
            document.getElementById("ID_imagehow").style.opacity = 0,
            5 === e && this.targetViewPos.copy(this.WY.getPosition()),
            6 === e && this.targetViewPos.copy(this.SJ.getPosition()),
            7 === e && this.targetViewPos.copy(this.YG.getPosition()),
            8 === e && this.targetViewPos.copy(this.YC.getPosition()),
            9 === e && this.targetViewPos.copy(this.ZL.getPosition())
        }
        .bind(this)),
        this.hammer.on("panstart", function(e) {
            if (cachedX = e.center.x,
            cachedY = e.center.y,
            !this.transformStarted) {
                var t = e.srcEvent
                  , i = void 0 !== t.touches ? t.touches.length : 1;
                this.panning = 2 === i,
                this.dragStarted = !0,
                document.getElementById("ID_imagehow").style.opacity = 0
            }
        }
        .bind(this)),
        this.hammer.on("panmove", function(e) {
            var t = e.center.y - cachedY
              , i = e.center.x - cachedX;
            this.orbit(t * -this.yawSensitivity, i * -this.yawSensitivity),
            blCanControl ? startY = 0 : startY += i / 2,
            cachedX = e.center.x,
            cachedY = e.center.y
        }
        .bind(this)),
        this.hammer.on("panend", function(e) {
            this.dragStarted && (this.dragStarted = !1,
            this.panning = !1)
        }
        .bind(this)),
        this.hammer.get("pinch").set({
            enable: !0
        }),
        this.hammer.on("pinchstart ", function(e) {
            pinchScale = e.scale
        }
        .bind(this)),
        this.hammer.on("pinchend", function(e) {}
        .bind(this)),
        this.hammer.on("pinchmove", function(e) {
            var t = e.scale - pinchScale;
            this.dolly(t * -this.pinchSensitivity * 15),
            pinchScale = e.scale
        }
        .bind(this)),
        this.app.mouse.on(pc.input.EVENT_MOUSEMOVE, this.onMouseMove, this),
        this.app.mouse.on(pc.input.EVENT_MOUSEWHEEL, this.onMouseWheel, this),
        this.entity.camera.clearColor.set(1, 1, 1, 1)
    },
    setBestCameraPositionForModel: function() {
        this.app.scene.getModels();
        var e = this.handpickCenter.getPosition();
        this.reset(e, 26)
    },
    reset: function(e, t) {
        this.viewPos.copy(e),
        this.targetViewPos.copy(e),
        this.distance = t,
        this.targetDistance = t
    },
    rotateByDegree: function(e, t) {
        this.targetRotY = e.y,
        this.targetRotY = this.calShortRotate(e.y, this.rotY),
        this.targetRotX = e.x,
        this.targetDistance = t
    },
    calShortRotate: function(e, t) {
        return t < 0 || 360 < t ? t - t % 360 + e : e
    },
    pan: function(e, t) {
        blCanControl && (this.panLocked || (fl_time = 0,
        this.targetPanX += e,
        this.targetPanY += t),
        this.operating = !0)
    },
    translateCam: function(e, t) {
        this.targetPanX = e,
        this.targetPanY = t
    },
    dolly: function(e) {
        blCanControl && (this.zoomLocked || (fl_time = 0,
        this.targetDistance += e,
        this.targetDistance < this.minDistance ? this.targetDistance = this.minDistance : this.targetDistance > this.maxDistance && (this.targetDistance = this.maxDistance)),
        this.operating = !0)
    },
    orbit: function(e, t) {
        if ((3 != current_number || CanRot) && blCanControl) {
            if (!this.rotLocked) {
                if (fl_time = 0,
                !this.lockY) {
                    this.targetRotY = this.targetRotY + t;
                    var i = parseInt(this.targetRotY / 360);
                    this.clampRotY && (this.targetRotY = pc.math.clamp(this.targetRotY, 360 * i + this.maxElevationLeft, 360 * i + this.maxElevationRight))
                }
                this.lockX || (this.targetRotX += e,
                this.targetRotX = pc.math.clamp(this.targetRotX, this.maxElevationUp, this.maxElevationDown))
            }
            this.operating = !0
        }
    },
    onMouseWheel: function(e) {
        blCanControl && this.dolly(e.wheel * -this.pinchSensitivity)
    },
    onMouseMove: function(e) {
        if (blCanControl && e.buttons[pc.input.MOUSEBUTTON_RIGHT]) {
            var t = this.distance / 500;
            this.pan(e.dx * -t, e.dy * t)
        }
    },
    clampAngle: function(e) {
        return e < -360 && (e += 360),
        360 < e && (e -= 360),
        e
    },
    getCamYawAngle: function() {
        return this.rotY % 360 < 0 ? 360 + this.rotY % 360 : this.rotY % 360
    },
    update: function(e) {
        this.viewPos.lerp(this.viewPos, this.targetViewPos, e / .1),
        this.distance = pc.math.lerp(this.distance, this.targetDistance, e / this.zoomLerpSpeed),
        this.rotX = pc.math.lerp(this.rotX, this.targetRotX, e / this.rotLerpSpeed),
        3 == current_number && (CanRot || (this.endRot = this.targetRotY),
        CanRot && (this.targetRotY < this.endRot - 30 && (this.targetRotY = this.endRot - 30),
        this.targetRotY > this.endRot + 30 && (this.targetRotY = this.endRot + 30))),
        this.rotY = pc.math.lerpAngle(this.rotY, this.targetRotY, e / this.rotLerpSpeed),
        this.panX = pc.math.lerp(this.panX, this.targetPanX, e / this.panLerpSpeed),
        this.panY = pc.math.lerp(this.panY, this.targetPanY, e / this.panLerpSpeed),
        this.camAnchor.setEulerAngles(this.rotX, this.rotY, 0),
        this.camAnchor.setPosition(this.viewPos),
        this.camAnchor.translateLocal(0, 0, this.distance),
        this.entity.camera.orthoHeight = .4 * this.distance,
        this.entity.setPosition(this.camAnchor.getPosition()),
        this.entity.setRotation(this.camAnchor.getRotation()),
        this.entity.translateLocal(this.panX, this.panY, 0),
        (bl_AutoRotate = fl_time > this.WaiteNum || (fl_time += e,
        !1)) && this.step_Rotate && (this.targetRotY += e * this.autoSpeed)
    },
    onStepChange: function(e) {
        fl_time = 0,
        bl_AutoRotate = !1
    },
    lock: function(e, t, i) {
        this.rotLocked = e,
        this.zoomLocked = t,
        this.panLocked = i
    },
    setTargetPos: function(e) {
        this.rotX = this.targetRotX = e.rotX,
        this.rotY = this.targetRotY = e.rotY,
        this.panX = this.targetPanX = e.panX,
        this.panY = this.targetPanY = e.panY,
        this.distance = this.targetDistance = e.dist,
        this.camAnchor.setEulerAngles(this.rotX, this.rotY, 0),
        this.camAnchor.setPosition(this.viewPos),
        this.camAnchor.translateLocal(0, 0, this.distance),
        this.entity.setPosition(this.camAnchor.getPosition()),
        this.entity.setRotation(this.camAnchor.getRotation()),
        this.entity.translateLocal(this.panX, this.panY, 0)
    },
    getTargetPos: function() {
        return {
            rotX: this.targetRotX,
            rotY: this.targetRotY,
            panX: this.targetPanX,
            panY: this.targetPanY,
            dist: this.targetDistance
        }
    },
    print: function() {},
    print2: function() {
        var e = this.entity.getPosition()
          , t = this.entity.getEulerAngles()
          , i = this.entity.forward;
        this.targetViewPos.x,
        this.targetViewPos.y,
        this.targetViewPos.z,
        e.x,
        e.y,
        e.z,
        t.x,
        t.y,
        t.z,
        i.x,
        i.y,
        i.z,
        this.targetPanX,
        this.targetPanY
    }
}),
function(a, r, u) {
    var f = a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame || a.oRequestAnimationFrame || a.msRequestAnimationFrame || function(e) {
        a.setTimeout(e, 1e3 / 60)
    }
      , m = function() {
        var s = {}
          , n = r.createElement("div").style
          , t = function() {
            for (var e = ["t", "webkitT", "MozT", "msT", "OT"], t = 0, i = e.length; t < i; t++)
                if (e[t] + "ransform"in n)
                    return e[t].substr(0, e[t].length - 1);
            return !1
        }();
        function e(e) {
            return !1 !== t && ("" === t ? e : t + e.charAt(0).toUpperCase() + e.substr(1))
        }
        s.getTime = Date.now || function() {
            return (new Date).getTime()
        }
        ,
        s.extend = function(e, t) {
            for (var i in t)
                e[i] = t[i]
        }
        ,
        s.addEvent = function(e, t, i, s) {
            e.addEventListener(t, i, !!s)
        }
        ,
        s.removeEvent = function(e, t, i, s) {
            e.removeEventListener(t, i, !!s)
        }
        ,
        s.prefixPointerEvent = function(e) {
            return a.MSPointerEvent ? "MSPointer" + e.charAt(7).toUpperCase() + e.substr(8) : e
        }
        ,
        s.momentum = function(e, t, i, s, n, a) {
            var r, o, h = e - t, l = u.abs(h) / i;
            return o = l / (a = void 0 === a ? 6e-4 : a),
            (r = e + l * l / (2 * a) * (h < 0 ? -1 : 1)) < s ? (r = n ? s - n / 2.5 * (l / 8) : s,
            o = (h = u.abs(r - e)) / l) : 0 < r && (r = n ? n / 2.5 * (l / 8) : 0,
            o = (h = u.abs(e) + r) / l),
            {
                destination: u.round(r),
                duration: o
            }
        }
        ;
        var i = e("transform");
        return s.extend(s, {
            hasTransform: !1 !== i,
            hasPerspective: e("perspective")in n,
            hasTouch: "ontouchstart"in a,
            hasPointer: !(!a.PointerEvent && !a.MSPointerEvent),
            hasTransition: e("transition")in n
        }),
        s.isBadAndroid = function() {
            var e = a.navigator.appVersion;
            if (!/Android/.test(e) || /Chrome\/\d/.test(e))
                return !1;
            var t = e.match(/Safari\/(\d+.\d)/);
            return !(t && "object" == typeof t && 2 <= t.length) || parseFloat(t[1]) < 535.19
        }(),
        s.extend(s.style = {}, {
            transform: i,
            transitionTimingFunction: e("transitionTimingFunction"),
            transitionDuration: e("transitionDuration"),
            transitionDelay: e("transitionDelay"),
            transformOrigin: e("transformOrigin"),
            touchAction: e("touchAction")
        }),
        s.hasClass = function(e, t) {
            return new RegExp("(^|\\s)" + t + "(\\s|$)").test(e.className)
        }
        ,
        s.addClass = function(e, t) {
            if (!s.hasClass(e, t)) {
                var i = e.className.split(" ");
                i.push(t),
                e.className = i.join(" ")
            }
        }
        ,
        s.removeClass = function(e, t) {
            if (s.hasClass(e, t)) {
                var i = new RegExp("(^|\\s)" + t + "(\\s|$)","g");
                e.className = e.className.replace(i, " ")
            }
        }
        ,
        s.offset = function(e) {
            for (var t = -e.offsetLeft, i = -e.offsetTop; e = e.offsetParent; )
                t -= e.offsetLeft,
                i -= e.offsetTop;
            return {
                left: t,
                top: i
            }
        }
        ,
        s.preventDefaultException = function(e, t) {
            for (var i in t)
                if (t[i].test(e[i]))
                    return !0;
            return !1
        }
        ,
        s.extend(s.eventType = {}, {
            touchstart: 1,
            touchmove: 1,
            touchend: 1,
            mousedown: 2,
            mousemove: 2,
            mouseup: 2,
            pointerdown: 3,
            pointermove: 3,
            pointerup: 3,
            MSPointerDown: 3,
            MSPointerMove: 3,
            MSPointerUp: 3
        }),
        s.extend(s.ease = {}, {
            quadratic: {
                style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                fn: function(e) {
                    return e * (2 - e)
                }
            },
            circular: {
                style: "cubic-bezier(0.1, 0.57, 0.1, 1)",
                fn: function(e) {
                    return u.sqrt(1 - --e * e)
                }
            },
            back: {
                style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                fn: function(e) {
                    return (e -= 1) * e * (5 * e + 4) + 1
                }
            },
            bounce: {
                style: "",
                fn: function(e) {
                    return (e /= 1) < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375
                }
            },
            elastic: {
                style: "",
                fn: function(e) {
                    return 0 === e ? 0 : 1 == e ? 1 : .4 * u.pow(2, -10 * e) * u.sin((e - .055) * (2 * u.PI) / .22) + 1
                }
            }
        }),
        s.tap = function(e, t) {
            var i = r.createEvent("Event");
            i.initEvent(t, !0, !0),
            i.pageX = e.pageX,
            i.pageY = e.pageY,
            e.target.dispatchEvent(i)
        }
        ,
        s.click = function(e) {
            var t, i = e.target;
            /(SELECT|INPUT|TEXTAREA)/i.test(i.tagName) || ((t = r.createEvent(a.MouseEvent ? "MouseEvents" : "Event")).initEvent("click", !0, !0),
            t.view = e.view || a,
            t.detail = 1,
            t.screenX = i.screenX || 0,
            t.screenY = i.screenY || 0,
            t.clientX = i.clientX || 0,
            t.clientY = i.clientY || 0,
            t.ctrlKey = !!e.ctrlKey,
            t.altKey = !!e.altKey,
            t.shiftKey = !!e.shiftKey,
            t.metaKey = !!e.metaKey,
            t.button = 0,
            t.relatedTarget = null,
            t._constructed = !0,
            i.dispatchEvent(t))
        }
        ,
        s.getTouchAction = function(e, t) {
            var i = "none";
            return "vertical" === e ? i = "pan-y" : "horizontal" === e && (i = "pan-x"),
            t && "none" != i && (i += " pinch-zoom"),
            i
        }
        ,
        s.getRect = function(e) {
            if (e instanceof SVGElement) {
                var t = e.getBoundingClientRect();
                return {
                    top: t.top,
                    left: t.left,
                    width: t.width,
                    height: t.height
                }
            }
            return {
                top: e.offsetTop,
                left: e.offsetLeft,
                width: e.offsetWidth,
                height: e.offsetHeight
            }
        }
        ,
        s
    }();
    function e(e, t) {
        for (var i in this.wrapper = "string" == typeof e ? r.querySelector(e) : e,
        this.scroller = this.wrapper.children[0],
        this.scrollerStyle = this.scroller.style,
        this.options = {
            resizeScrollbars: !0,
            mouseWheelSpeed: 20,
            snapThreshold: .334,
            disablePointer: !m.hasPointer,
            disableTouch: m.hasPointer || !m.hasTouch,
            disableMouse: m.hasPointer || m.hasTouch,
            startX: 0,
            startY: 0,
            scrollY: !0,
            directionLockThreshold: 5,
            momentum: !0,
            bounce: !0,
            bounceTime: 600,
            bounceEasing: "",
            preventDefault: !0,
            preventDefaultException: {
                tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
            },
            HWCompositing: !0,
            useTransition: !0,
            useTransform: !0,
            bindToWrapper: void 0 === a.onmousedown
        },
        t)
            this.options[i] = t[i];
        this.translateZ = this.options.HWCompositing && m.hasPerspective ? " translateZ(0)" : "",
        this.options.useTransition = m.hasTransition && this.options.useTransition,
        this.options.useTransform = m.hasTransform && this.options.useTransform,
        this.options.eventPassthrough = !0 === this.options.eventPassthrough ? "vertical" : this.options.eventPassthrough,
        this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault,
        this.options.scrollY = "vertical" != this.options.eventPassthrough && this.options.scrollY,
        this.options.scrollX = "horizontal" != this.options.eventPassthrough && this.options.scrollX,
        this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough,
        this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold,
        this.options.bounceEasing = "string" == typeof this.options.bounceEasing ? m.ease[this.options.bounceEasing] || m.ease.circular : this.options.bounceEasing,
        this.options.resizePolling = void 0 === this.options.resizePolling ? 60 : this.options.resizePolling,
        !0 === this.options.tap && (this.options.tap = "tap"),
        this.options.useTransition || this.options.useTransform || /relative|absolute/i.test(this.scrollerStyle.position) || (this.scrollerStyle.position = "relative"),
        "scale" == this.options.shrinkScrollbars && (this.options.useTransition = !1),
        this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1,
        this.x = 0,
        this.y = 0,
        this.directionX = 0,
        this.directionY = 0,
        this._events = {},
        this._init(),
        this.refresh(),
        this.scrollTo(this.options.startX, this.options.startY),
        this.enable()
    }
    function o(e, t, i) {
        var s = r.createElement("div")
          , n = r.createElement("div");
        return !0 === i && (s.style.cssText = "position:absolute;z-index:9999",
        n.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px"),
        n.className = "iScrollIndicator",
        "h" == e ? (!0 === i && (s.style.cssText += ";height:7px;left:2px;right:2px;bottom:0",
        n.style.height = "100%"),
        s.className = "iScrollHorizontalScrollbar") : (!0 === i && (s.style.cssText += ";width:7px;bottom:2px;top:2px;right:1px",
        n.style.width = "100%"),
        s.className = "iScrollVerticalScrollbar"),
        s.style.cssText += ";overflow:hidden",
        t || (s.style.pointerEvents = "none"),
        s.appendChild(n),
        s
    }
    function h(e, t) {
        for (var i in this.wrapper = "string" == typeof t.el ? r.querySelector(t.el) : t.el,
        this.wrapperStyle = this.wrapper.style,
        this.indicator = this.wrapper.children[0],
        this.indicatorStyle = this.indicator.style,
        this.scroller = e,
        this.options = {
            listenX: !0,
            listenY: !0,
            interactive: !1,
            resize: !0,
            defaultScrollbars: !1,
            shrink: !1,
            fade: !1,
            speedRatioX: 0,
            speedRatioY: 0
        },
        t)
            this.options[i] = t[i];
        if (this.sizeRatioX = 1,
        this.sizeRatioY = 1,
        this.maxPosX = 0,
        this.maxPosY = 0,
        this.options.interactive && (this.options.disableTouch || (m.addEvent(this.indicator, "touchstart", this),
        m.addEvent(a, "touchend", this)),
        this.options.disablePointer || (m.addEvent(this.indicator, m.prefixPointerEvent("pointerdown"), this),
        m.addEvent(a, m.prefixPointerEvent("pointerup"), this)),
        this.options.disableMouse || (m.addEvent(this.indicator, "mousedown", this),
        m.addEvent(a, "mouseup", this))),
        this.options.fade) {
            this.wrapperStyle[m.style.transform] = this.scroller.translateZ;
            var s = m.style.transitionDuration;
            if (!s)
                return;
            this.wrapperStyle[s] = m.isBadAndroid ? "0.0001ms" : "0ms";
            var n = this;
            m.isBadAndroid && f(function() {
                "0.0001ms" === n.wrapperStyle[s] && (n.wrapperStyle[s] = "0s")
            }),
            this.wrapperStyle.opacity = "0"
        }
    }
    e.prototype = {
        version: "5.2.0-snapshot",
        _init: function() {
            this._initEvents(),
            (this.options.scrollbars || this.options.indicators) && this._initIndicators(),
            this.options.mouseWheel && this._initWheel(),
            this.options.snap && this._initSnap(),
            this.options.keyBindings && this._initKeys()
        },
        destroy: function() {
            this._initEvents(!0),
            clearTimeout(this.resizeTimeout),
            this.resizeTimeout = null,
            this._execEvent("destroy")
        },
        _transitionEnd: function(e) {
            e.target == this.scroller && this.isInTransition && (this._transitionTime(),
            this.resetPosition(this.options.bounceTime) || (this.isInTransition = !1,
            this._execEvent("scrollEnd")))
        },
        _start: function(e) {
            if ((1 == m.eventType[e.type] || 0 === (e.which ? e.button : e.button < 2 ? 0 : 4 == e.button ? 1 : 2)) && this.enabled && (!this.initiated || m.eventType[e.type] === this.initiated)) {
                !this.options.preventDefault || m.isBadAndroid || m.preventDefaultException(e.target, this.options.preventDefaultException) || e.preventDefault();
                var t, i = e.touches ? e.touches[0] : e;
                this.initiated = m.eventType[e.type],
                this.moved = !1,
                this.distX = 0,
                this.distY = 0,
                this.directionX = 0,
                this.directionY = 0,
                this.directionLocked = 0,
                this.startTime = m.getTime(),
                this.options.useTransition && this.isInTransition ? (this._transitionTime(),
                this.isInTransition = !1,
                t = this.getComputedPosition(),
                this._translate(u.round(t.x), u.round(t.y)),
                this._execEvent("scrollEnd")) : !this.options.useTransition && this.isAnimating && (this.isAnimating = !1,
                this._execEvent("scrollEnd")),
                this.startX = this.x,
                this.startY = this.y,
                this.absStartX = this.x,
                this.absStartY = this.y,
                this.pointX = i.pageX,
                this.pointY = i.pageY,
                this._execEvent("beforeScrollStart")
            }
        },
        _move: function(e) {
            if (this.enabled && m.eventType[e.type] === this.initiated) {
                this.options.preventDefault && e.preventDefault();
                var t, i, s, n, a = e.touches ? e.touches[0] : e, r = a.pageX - this.pointX, o = a.pageY - this.pointY, h = m.getTime();
                if (this.pointX = a.pageX,
                this.pointY = a.pageY,
                this.distX += r,
                this.distY += o,
                s = u.abs(this.distX),
                n = u.abs(this.distY),
                !(300 < h - this.endTime && s < 10 && n < 10)) {
                    if (this.directionLocked || this.options.freeScroll || (s > n + this.options.directionLockThreshold ? this.directionLocked = "h" : n >= s + this.options.directionLockThreshold ? this.directionLocked = "v" : this.directionLocked = "n"),
                    "h" == this.directionLocked) {
                        if ("vertical" == this.options.eventPassthrough)
                            e.preventDefault();
                        else if ("horizontal" == this.options.eventPassthrough)
                            return void (this.initiated = !1);
                        o = 0
                    } else if ("v" == this.directionLocked) {
                        if ("horizontal" == this.options.eventPassthrough)
                            e.preventDefault();
                        else if ("vertical" == this.options.eventPassthrough)
                            return void (this.initiated = !1);
                        r = 0
                    }
                    r = this.hasHorizontalScroll ? r : 0,
                    o = this.hasVerticalScroll ? o : 0,
                    t = this.x + r,
                    i = this.y + o,
                    (0 < t || t < this.maxScrollX) && (t = this.options.bounce ? this.x + r / 3 : 0 < t ? 0 : this.maxScrollX),
                    (0 < i || i < this.maxScrollY) && (i = this.options.bounce ? this.y + o / 3 : 0 < i ? 0 : this.maxScrollY),
                    this.directionX = 0 < r ? -1 : r < 0 ? 1 : 0,
                    this.directionY = 0 < o ? -1 : o < 0 ? 1 : 0,
                    this.moved || this._execEvent("scrollStart"),
                    this.moved = !0,
                    this._translate(t, i),
                    300 < h - this.startTime && (this.startTime = h,
                    this.startX = this.x,
                    this.startY = this.y)
                }
            }
        },
        _end: function(e) {
            if (this.enabled && m.eventType[e.type] === this.initiated) {
                this.options.preventDefault && !m.preventDefaultException(e.target, this.options.preventDefaultException) && e.preventDefault(),
                e.changedTouches && e.changedTouches[0];
                var t, i, s = m.getTime() - this.startTime, n = u.round(this.x), a = u.round(this.y), r = u.abs(n - this.startX), o = u.abs(a - this.startY), h = 0, l = "";
                if (this.isInTransition = 0,
                this.initiated = 0,
                this.endTime = m.getTime(),
                !this.resetPosition(this.options.bounceTime)) {
                    if (this.scrollTo(n, a),
                    !this.moved)
                        return this.options.tap && m.tap(e, this.options.tap),
                        this.options.click && m.click(e),
                        void this._execEvent("scrollCancel");
                    if (this._events.flick && s < 200 && r < 100 && o < 100)
                        this._execEvent("flick");
                    else {
                        if (this.options.momentum && s < 300 && (t = this.hasHorizontalScroll ? m.momentum(this.x, this.startX, s, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
                            destination: n,
                            duration: 0
                        },
                        i = this.hasVerticalScroll ? m.momentum(this.y, this.startY, s, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
                            destination: a,
                            duration: 0
                        },
                        n = t.destination,
                        a = i.destination,
                        h = u.max(t.duration, i.duration),
                        this.isInTransition = 1),
                        this.options.snap) {
                            var c = this._nearestSnap(n, a);
                            this.currentPage = c,
                            h = this.options.snapSpeed || u.max(u.max(u.min(u.abs(n - c.x), 1e3), u.min(u.abs(a - c.y), 1e3)), 300),
                            n = c.x,
                            a = c.y,
                            this.directionX = 0,
                            this.directionY = 0,
                            l = this.options.bounceEasing
                        }
                        if (n != this.x || a != this.y)
                            return (0 < n || n < this.maxScrollX || 0 < a || a < this.maxScrollY) && (l = m.ease.quadratic),
                            void this.scrollTo(n, a, h, l);
                        this._execEvent("scrollEnd")
                    }
                }
            }
        },
        _resize: function() {
            var e = this;
            clearTimeout(this.resizeTimeout),
            this.resizeTimeout = setTimeout(function() {
                e.refresh()
            }, this.options.resizePolling)
        },
        resetPosition: function(e) {
            var t = this.x
              , i = this.y;
            return e = e || 0,
            !this.hasHorizontalScroll || 0 < this.x ? t = 0 : this.x < this.maxScrollX && (t = this.maxScrollX),
            !this.hasVerticalScroll || 0 < this.y ? i = 0 : this.y < this.maxScrollY && (i = this.maxScrollY),
            (t != this.x || i != this.y) && (this.scrollTo(t, i, e, this.options.bounceEasing),
            !0)
        },
        disable: function() {
            this.enabled = !1
        },
        enable: function() {
            this.enabled = !0
        },
        refresh: function() {
            m.getRect(this.wrapper),
            this.wrapperWidth = this.wrapper.clientWidth,
            this.wrapperHeight = this.wrapper.clientHeight;
            var e = m.getRect(this.scroller);
            this.scrollerWidth = e.width,
            this.scrollerHeight = e.height,
            this.maxScrollX = this.wrapperWidth - this.scrollerWidth,
            this.maxScrollY = this.wrapperHeight - this.scrollerHeight,
            this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0,
            this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0,
            this.hasHorizontalScroll || (this.maxScrollX = 0,
            this.scrollerWidth = this.wrapperWidth),
            this.hasVerticalScroll || (this.maxScrollY = 0,
            this.scrollerHeight = this.wrapperHeight),
            this.endTime = 0,
            this.directionX = 0,
            this.directionY = 0,
            m.hasPointer && !this.options.disablePointer && (this.wrapper.style[m.style.touchAction] = m.getTouchAction(this.options.eventPassthrough, !0),
            this.wrapper.style[m.style.touchAction] || (this.wrapper.style[m.style.touchAction] = m.getTouchAction(this.options.eventPassthrough, !1))),
            this.wrapperOffset = m.offset(this.wrapper),
            this._execEvent("refresh"),
            this.resetPosition()
        },
        on: function(e, t) {
            this._events[e] || (this._events[e] = []),
            this._events[e].push(t)
        },
        off: function(e, t) {
            if (this._events[e]) {
                var i = this._events[e].indexOf(t);
                -1 < i && this._events[e].splice(i, 1)
            }
        },
        _execEvent: function(e) {
            if (this._events[e]) {
                var t = 0
                  , i = this._events[e].length;
                if (i)
                    for (; t < i; t++)
                        this._events[e][t].apply(this, [].slice.call(arguments, 1))
            }
        },
        scrollBy: function(e, t, i, s) {
            e = this.x + e,
            t = this.y + t,
            i = i || 0,
            this.scrollTo(e, t, i, s)
        },
        scrollTo: function(e, t, i, s) {
            s = s || m.ease.circular,
            this.isInTransition = this.options.useTransition && 0 < i;
            var n = this.options.useTransition && s.style;
            !i || n ? (n && (this._transitionTimingFunction(s.style),
            this._transitionTime(i)),
            this._translate(e, t)) : this._animate(e, t, i, s.fn)
        },
        scrollToElement: function(e, t, i, s, n) {
            if (e = e.nodeType ? e : this.scroller.querySelector(e)) {
                var a = m.offset(e);
                a.left -= this.wrapperOffset.left,
                a.top -= this.wrapperOffset.top;
                var r = m.getRect(e)
                  , o = m.getRect(this.wrapper);
                !0 === i && (i = u.round(r.width / 2 - o.width / 2)),
                !0 === s && (s = u.round(r.height / 2 - o.height / 2)),
                a.left -= i || 0,
                a.top -= s || 0,
                a.left = 0 < a.left ? 0 : a.left < this.maxScrollX ? this.maxScrollX : a.left,
                a.top = 0 < a.top ? 0 : a.top < this.maxScrollY ? this.maxScrollY : a.top,
                t = null == t || "auto" === t ? u.max(u.abs(this.x - a.left), u.abs(this.y - a.top)) : t,
                this.scrollTo(a.left, a.top, t, n)
            }
        },
        _transitionTime: function(e) {
            if (this.options.useTransition) {
                e = e || 0;
                var t = m.style.transitionDuration;
                if (t) {
                    if (this.scrollerStyle[t] = e + "ms",
                    !e && m.isBadAndroid) {
                        this.scrollerStyle[t] = "0.0001ms";
                        var i = this;
                        f(function() {
                            "0.0001ms" === i.scrollerStyle[t] && (i.scrollerStyle[t] = "0s")
                        })
                    }
                    if (this.indicators)
                        for (var s = this.indicators.length; s--; )
                            this.indicators[s].transitionTime(e)
                }
            }
        },
        _transitionTimingFunction: function(e) {
            if (this.scrollerStyle[m.style.transitionTimingFunction] = e,
            this.indicators)
                for (var t = this.indicators.length; t--; )
                    this.indicators[t].transitionTimingFunction(e)
        },
        _translate: function(e, t) {
            if (this.options.useTransform ? this.scrollerStyle[m.style.transform] = "translate(" + e + "px," + t + "px)" + this.translateZ : (e = u.round(e),
            t = u.round(t),
            this.scrollerStyle.left = e + "px",
            this.scrollerStyle.top = t + "px"),
            this.x = e,
            this.y = t,
            this.indicators)
                for (var i = this.indicators.length; i--; )
                    this.indicators[i].updatePosition()
        },
        _initEvents: function(e) {
            var t = e ? m.removeEvent : m.addEvent
              , i = this.options.bindToWrapper ? this.wrapper : a;
            t(a, "orientationchange", this),
            t(a, "resize", this),
            this.options.click && t(this.wrapper, "click", this, !0),
            this.options.disableMouse || (t(this.wrapper, "mousedown", this),
            t(i, "mousemove", this),
            t(i, "mousecancel", this),
            t(i, "mouseup", this)),
            m.hasPointer && !this.options.disablePointer && (t(this.wrapper, m.prefixPointerEvent("pointerdown"), this),
            t(i, m.prefixPointerEvent("pointermove"), this),
            t(i, m.prefixPointerEvent("pointercancel"), this),
            t(i, m.prefixPointerEvent("pointerup"), this)),
            m.hasTouch && !this.options.disableTouch && (t(this.wrapper, "touchstart", this),
            t(i, "touchmove", this),
            t(i, "touchcancel", this),
            t(i, "touchend", this)),
            t(this.scroller, "transitionend", this),
            t(this.scroller, "webkitTransitionEnd", this),
            t(this.scroller, "oTransitionEnd", this),
            t(this.scroller, "MSTransitionEnd", this)
        },
        getComputedPosition: function() {
            var e, t, i = a.getComputedStyle(this.scroller, null);
            return t = this.options.useTransform ? (e = +((i = i[m.style.transform].split(")")[0].split(", "))[12] || i[4]),
            +(i[13] || i[5])) : (e = +i.left.replace(/[^-\d.]/g, ""),
            +i.top.replace(/[^-\d.]/g, "")),
            {
                x: e,
                y: t
            }
        },
        _initIndicators: function() {
            var e, t = this.options.interactiveScrollbars, i = "string" != typeof this.options.scrollbars, s = [], n = this;
            this.indicators = [],
            this.options.scrollbars && (this.options.scrollY && (e = {
                el: o("v", t, this.options.scrollbars),
                interactive: t,
                defaultScrollbars: !0,
                customStyle: i,
                resize: this.options.resizeScrollbars,
                shrink: this.options.shrinkScrollbars,
                fade: this.options.fadeScrollbars,
                listenX: !1
            },
            this.wrapper.appendChild(e.el),
            s.push(e)),
            this.options.scrollX && (e = {
                el: o("h", t, this.options.scrollbars),
                interactive: t,
                defaultScrollbars: !0,
                customStyle: i,
                resize: this.options.resizeScrollbars,
                shrink: this.options.shrinkScrollbars,
                fade: this.options.fadeScrollbars,
                listenY: !1
            },
            this.wrapper.appendChild(e.el),
            s.push(e))),
            this.options.indicators && (s = s.concat(this.options.indicators));
            for (var a = s.length; a--; )
                this.indicators.push(new h(this,s[a]));
            function r(e) {
                if (n.indicators)
                    for (var t = n.indicators.length; t--; )
                        e.call(n.indicators[t])
            }
            this.options.fadeScrollbars && (this.on("scrollEnd", function() {
                r(function() {
                    this.fade()
                })
            }),
            this.on("scrollCancel", function() {
                r(function() {
                    this.fade()
                })
            }),
            this.on("scrollStart", function() {
                r(function() {
                    this.fade(1)
                })
            }),
            this.on("beforeScrollStart", function() {
                r(function() {
                    this.fade(1, !0)
                })
            })),
            this.on("refresh", function() {
                r(function() {
                    this.refresh()
                })
            }),
            this.on("destroy", function() {
                r(function() {
                    this.destroy()
                }),
                delete this.indicators
            })
        },
        _initWheel: function() {
            m.addEvent(this.wrapper, "wheel", this),
            m.addEvent(this.wrapper, "mousewheel", this),
            m.addEvent(this.wrapper, "DOMMouseScroll", this),
            this.on("destroy", function() {
                clearTimeout(this.wheelTimeout),
                this.wheelTimeout = null,
                m.removeEvent(this.wrapper, "wheel", this),
                m.removeEvent(this.wrapper, "mousewheel", this),
                m.removeEvent(this.wrapper, "DOMMouseScroll", this)
            })
        },
        _wheel: function(e) {
            if (this.enabled) {
                e.preventDefault();
                var t, i, s, n, a = this;
                if (void 0 === this.wheelTimeout && a._execEvent("scrollStart"),
                clearTimeout(this.wheelTimeout),
                this.wheelTimeout = setTimeout(function() {
                    a.options.snap || a._execEvent("scrollEnd"),
                    a.wheelTimeout = void 0
                }, 400),
                "deltaX"in e)
                    i = 1 === e.deltaMode ? (t = -e.deltaX * this.options.mouseWheelSpeed,
                    -e.deltaY * this.options.mouseWheelSpeed) : (t = -e.deltaX,
                    -e.deltaY);
                else if ("wheelDeltaX"in e)
                    t = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed,
                    i = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
                else if ("wheelDelta"in e)
                    t = i = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
                else {
                    if (!("detail"in e))
                        return;
                    t = i = -e.detail / 3 * this.options.mouseWheelSpeed
                }
                if (t *= this.options.invertWheelDirection,
                i *= this.options.invertWheelDirection,
                this.hasVerticalScroll || (t = i,
                i = 0),
                this.options.snap)
                    return s = this.currentPage.pageX,
                    n = this.currentPage.pageY,
                    0 < t ? s-- : t < 0 && s++,
                    0 < i ? n-- : i < 0 && n++,
                    void this.goToPage(s, n);
                s = this.x + u.round(this.hasHorizontalScroll ? t : 0),
                n = this.y + u.round(this.hasVerticalScroll ? i : 0),
                this.directionX = 0 < t ? -1 : t < 0 ? 1 : 0,
                this.directionY = 0 < i ? -1 : i < 0 ? 1 : 0,
                0 < s ? s = 0 : s < this.maxScrollX && (s = this.maxScrollX),
                0 < n ? n = 0 : n < this.maxScrollY && (n = this.maxScrollY),
                this.scrollTo(s, n, 0)
            }
        },
        _initSnap: function() {
            this.currentPage = {},
            "string" == typeof this.options.snap && (this.options.snap = this.scroller.querySelectorAll(this.options.snap)),
            this.on("refresh", function() {
                var e, t, i, s, n, a, r, o = 0, h = 0, l = 0, c = this.options.snapStepX || this.wrapperWidth, d = this.options.snapStepY || this.wrapperHeight;
                if (this.pages = [],
                this.wrapperWidth && this.wrapperHeight && this.scrollerWidth && this.scrollerHeight) {
                    if (!0 === this.options.snap)
                        for (i = u.round(c / 2),
                        s = u.round(d / 2); l > -this.scrollerWidth; ) {
                            for (this.pages[o] = [],
                            n = e = 0; n > -this.scrollerHeight; )
                                this.pages[o][e] = {
                                    x: u.max(l, this.maxScrollX),
                                    y: u.max(n, this.maxScrollY),
                                    width: c,
                                    height: d,
                                    cx: l - i,
                                    cy: n - s
                                },
                                n -= d,
                                e++;
                            l -= c,
                            o++
                        }
                    else
                        for (e = (a = this.options.snap).length,
                        t = -1; o < e; o++)
                            r = m.getRect(a[o]),
                            (0 === o || r.left <= m.getRect(a[o - 1]).left) && (h = 0,
                            t++),
                            this.pages[h] || (this.pages[h] = []),
                            l = u.max(-r.left, this.maxScrollX),
                            n = u.max(-r.top, this.maxScrollY),
                            i = l - u.round(r.width / 2),
                            s = n - u.round(r.height / 2),
                            this.pages[h][t] = {
                                x: l,
                                y: n,
                                width: r.width,
                                height: r.height,
                                cx: i,
                                cy: s
                            },
                            l > this.maxScrollX && h++;
                    this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0),
                    this.options.snapThreshold % 1 == 0 ? (this.snapThresholdX = this.options.snapThreshold,
                    this.snapThresholdY = this.options.snapThreshold) : (this.snapThresholdX = u.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold),
                    this.snapThresholdY = u.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold))
                }
            }),
            this.on("flick", function() {
                var e = this.options.snapSpeed || u.max(u.max(u.min(u.abs(this.x - this.startX), 1e3), u.min(u.abs(this.y - this.startY), 1e3)), 300);
                this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, e)
            })
        },
        _nearestSnap: function(e, t) {
            if (!this.pages.length)
                return {
                    x: 0,
                    y: 0,
                    pageX: 0,
                    pageY: 0
                };
            var i = 0
              , s = this.pages.length
              , n = 0;
            if (u.abs(e - this.absStartX) < this.snapThresholdX && u.abs(t - this.absStartY) < this.snapThresholdY)
                return this.currentPage;
            for (0 < e ? e = 0 : e < this.maxScrollX && (e = this.maxScrollX),
            0 < t ? t = 0 : t < this.maxScrollY && (t = this.maxScrollY); i < s; i++)
                if (e >= this.pages[i][0].cx) {
                    e = this.pages[i][0].x;
                    break
                }
            for (s = this.pages[i].length; n < s; n++)
                if (t >= this.pages[0][n].cy) {
                    t = this.pages[0][n].y;
                    break
                }
            return i == this.currentPage.pageX && ((i += this.directionX) < 0 ? i = 0 : i >= this.pages.length && (i = this.pages.length - 1),
            e = this.pages[i][0].x),
            n == this.currentPage.pageY && ((n += this.directionY) < 0 ? n = 0 : n >= this.pages[0].length && (n = this.pages[0].length - 1),
            t = this.pages[0][n].y),
            {
                x: e,
                y: t,
                pageX: i,
                pageY: n
            }
        },
        goToPage: function(e, t, i, s) {
            s = s || this.options.bounceEasing,
            e >= this.pages.length ? e = this.pages.length - 1 : e < 0 && (e = 0),
            t >= this.pages[e].length ? t = this.pages[e].length - 1 : t < 0 && (t = 0);
            var n = this.pages[e][t].x
              , a = this.pages[e][t].y;
            i = void 0 === i ? this.options.snapSpeed || u.max(u.max(u.min(u.abs(n - this.x), 1e3), u.min(u.abs(a - this.y), 1e3)), 300) : i,
            this.currentPage = {
                x: n,
                y: a,
                pageX: e,
                pageY: t
            },
            this.scrollTo(n, a, i, s)
        },
        next: function(e, t) {
            var i = this.currentPage.pageX
              , s = this.currentPage.pageY;
            ++i >= this.pages.length && this.hasVerticalScroll && (i = 0,
            s++),
            this.goToPage(i, s, e, t)
        },
        prev: function(e, t) {
            var i = this.currentPage.pageX
              , s = this.currentPage.pageY;
            --i < 0 && this.hasVerticalScroll && (i = 0,
            s--),
            this.goToPage(i, s, e, t)
        },
        _initKeys: function(e) {
            var t, i = {
                pageUp: 33,
                pageDown: 34,
                end: 35,
                home: 36,
                left: 37,
                up: 38,
                right: 39,
                down: 40
            };
            if ("object" == typeof this.options.keyBindings)
                for (t in this.options.keyBindings)
                    "string" == typeof this.options.keyBindings[t] && (this.options.keyBindings[t] = this.options.keyBindings[t].toUpperCase().charCodeAt(0));
            else
                this.options.keyBindings = {};
            for (t in i)
                this.options.keyBindings[t] = this.options.keyBindings[t] || i[t];
            m.addEvent(a, "keydown", this),
            this.on("destroy", function() {
                m.removeEvent(a, "keydown", this)
            })
        },
        _key: function(e) {
            if (this.enabled) {
                var t, i = this.options.snap, s = i ? this.currentPage.pageX : this.x, n = i ? this.currentPage.pageY : this.y, a = m.getTime(), r = this.keyTime || 0;
                switch (this.options.useTransition && this.isInTransition && (t = this.getComputedPosition(),
                this._translate(u.round(t.x), u.round(t.y)),
                this.isInTransition = !1),
                this.keyAcceleration = a - r < 200 ? u.min(this.keyAcceleration + .25, 50) : 0,
                e.keyCode) {
                case this.options.keyBindings.pageUp:
                    this.hasHorizontalScroll && !this.hasVerticalScroll ? s += i ? 1 : this.wrapperWidth : n += i ? 1 : this.wrapperHeight;
                    break;
                case this.options.keyBindings.pageDown:
                    this.hasHorizontalScroll && !this.hasVerticalScroll ? s -= i ? 1 : this.wrapperWidth : n -= i ? 1 : this.wrapperHeight;
                    break;
                case this.options.keyBindings.end:
                    s = i ? this.pages.length - 1 : this.maxScrollX,
                    n = i ? this.pages[0].length - 1 : this.maxScrollY;
                    break;
                case this.options.keyBindings.home:
                    n = s = 0;
                    break;
                case this.options.keyBindings.left:
                    s += i ? -1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.up:
                    n += i ? 1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.right:
                    s -= i ? -1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.down:
                    n -= i ? 1 : 5 + this.keyAcceleration >> 0;
                    break;
                default:
                    return
                }
                i ? this.goToPage(s, n) : (0 < s ? (s = 0,
                this.keyAcceleration = 0) : s < this.maxScrollX && (s = this.maxScrollX,
                this.keyAcceleration = 0),
                0 < n ? (n = 0,
                this.keyAcceleration = 0) : n < this.maxScrollY && (n = this.maxScrollY,
                this.keyAcceleration = 0),
                this.scrollTo(s, n, 0),
                this.keyTime = a)
            }
        },
        _animate: function(a, r, o, h) {
            var l = this
              , c = this.x
              , d = this.y
              , u = m.getTime()
              , p = u + o;
            this.isAnimating = !0,
            function e() {
                var t, i, s, n = m.getTime();
                if (p <= n)
                    return l.isAnimating = !1,
                    l._translate(a, r),
                    void (l.resetPosition(l.options.bounceTime) || l._execEvent("scrollEnd"));
                s = h(n = (n - u) / o),
                t = (a - c) * s + c,
                i = (r - d) * s + d,
                l._translate(t, i),
                l.isAnimating && f(e)
            }()
        },
        handleEvent: function(e) {
            switch (e.type) {
            case "touchstart":
            case "pointerdown":
            case "MSPointerDown":
            case "mousedown":
                this._start(e);
                break;
            case "touchmove":
            case "pointermove":
            case "MSPointerMove":
            case "mousemove":
                this._move(e);
                break;
            case "touchend":
            case "pointerup":
            case "MSPointerUp":
            case "mouseup":
            case "touchcancel":
            case "pointercancel":
            case "MSPointerCancel":
            case "mousecancel":
                this._end(e);
                break;
            case "orientationchange":
            case "resize":
                this._resize();
                break;
            case "transitionend":
            case "webkitTransitionEnd":
            case "oTransitionEnd":
            case "MSTransitionEnd":
                this._transitionEnd(e);
                break;
            case "wheel":
            case "DOMMouseScroll":
            case "mousewheel":
                this._wheel(e);
                break;
            case "keydown":
                this._key(e);
                break;
            case "click":
                this.enabled && !e._constructed && (e.preventDefault(),
                e.stopPropagation())
            }
        }
    },
    h.prototype = {
        handleEvent: function(e) {
            switch (e.type) {
            case "touchstart":
            case "pointerdown":
            case "MSPointerDown":
            case "mousedown":
                this._start(e);
                break;
            case "touchmove":
            case "pointermove":
            case "MSPointerMove":
            case "mousemove":
                this._move(e);
                break;
            case "touchend":
            case "pointerup":
            case "MSPointerUp":
            case "mouseup":
            case "touchcancel":
            case "pointercancel":
            case "MSPointerCancel":
            case "mousecancel":
                this._end(e)
            }
        },
        destroy: function() {
            this.options.fadeScrollbars && (clearTimeout(this.fadeTimeout),
            this.fadeTimeout = null),
            this.options.interactive && (m.removeEvent(this.indicator, "touchstart", this),
            m.removeEvent(this.indicator, m.prefixPointerEvent("pointerdown"), this),
            m.removeEvent(this.indicator, "mousedown", this),
            m.removeEvent(a, "touchmove", this),
            m.removeEvent(a, m.prefixPointerEvent("pointermove"), this),
            m.removeEvent(a, "mousemove", this),
            m.removeEvent(a, "touchend", this),
            m.removeEvent(a, m.prefixPointerEvent("pointerup"), this),
            m.removeEvent(a, "mouseup", this)),
            this.options.defaultScrollbars && this.wrapper.parentNode && this.wrapper.parentNode.removeChild(this.wrapper)
        },
        _start: function(e) {
            var t = e.touches ? e.touches[0] : e;
            e.preventDefault(),
            e.stopPropagation(),
            this.transitionTime(),
            this.initiated = !0,
            this.moved = !1,
            this.lastPointX = t.pageX,
            this.lastPointY = t.pageY,
            this.startTime = m.getTime(),
            this.options.disableTouch || m.addEvent(a, "touchmove", this),
            this.options.disablePointer || m.addEvent(a, m.prefixPointerEvent("pointermove"), this),
            this.options.disableMouse || m.addEvent(a, "mousemove", this),
            this.scroller._execEvent("beforeScrollStart")
        },
        _move: function(e) {
            var t, i, s, n, a = e.touches ? e.touches[0] : e;
            m.getTime(),
            this.moved || this.scroller._execEvent("scrollStart"),
            this.moved = !0,
            t = a.pageX - this.lastPointX,
            this.lastPointX = a.pageX,
            i = a.pageY - this.lastPointY,
            this.lastPointY = a.pageY,
            s = this.x + t,
            n = this.y + i,
            this._pos(s, n),
            e.preventDefault(),
            e.stopPropagation()
        },
        _end: function(e) {
            if (this.initiated) {
                if (this.initiated = !1,
                e.preventDefault(),
                e.stopPropagation(),
                m.removeEvent(a, "touchmove", this),
                m.removeEvent(a, m.prefixPointerEvent("pointermove"), this),
                m.removeEvent(a, "mousemove", this),
                this.scroller.options.snap) {
                    var t = this.scroller._nearestSnap(this.scroller.x, this.scroller.y)
                      , i = this.options.snapSpeed || u.max(u.max(u.min(u.abs(this.scroller.x - t.x), 1e3), u.min(u.abs(this.scroller.y - t.y), 1e3)), 300);
                    this.scroller.x == t.x && this.scroller.y == t.y || (this.scroller.directionX = 0,
                    this.scroller.directionY = 0,
                    this.scroller.currentPage = t,
                    this.scroller.scrollTo(t.x, t.y, i, this.scroller.options.bounceEasing))
                }
                this.moved && this.scroller._execEvent("scrollEnd")
            }
        },
        transitionTime: function(e) {
            e = e || 0;
            var t = m.style.transitionDuration;
            if (t && (this.indicatorStyle[t] = e + "ms",
            !e && m.isBadAndroid)) {
                this.indicatorStyle[t] = "0.0001ms";
                var i = this;
                f(function() {
                    "0.0001ms" === i.indicatorStyle[t] && (i.indicatorStyle[t] = "0s")
                })
            }
        },
        transitionTimingFunction: function(e) {
            this.indicatorStyle[m.style.transitionTimingFunction] = e
        },
        refresh: function() {
            this.transitionTime(),
            this.options.listenX && !this.options.listenY ? this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? "block" : "none" : this.options.listenY && !this.options.listenX ? this.indicatorStyle.display = this.scroller.hasVerticalScroll ? "block" : "none" : this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? "block" : "none",
            this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ? (m.addClass(this.wrapper, "iScrollBothScrollbars"),
            m.removeClass(this.wrapper, "iScrollLoneScrollbar"),
            this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "8px" : this.wrapper.style.bottom = "8px")) : (m.removeClass(this.wrapper, "iScrollBothScrollbars"),
            m.addClass(this.wrapper, "iScrollLoneScrollbar"),
            this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "2px" : this.wrapper.style.bottom = "2px")),
            m.getRect(this.wrapper),
            this.options.listenX && (this.wrapperWidth = this.wrapper.clientWidth,
            this.options.resize ? (this.indicatorWidth = u.max(u.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8),
            this.indicatorStyle.width = this.indicatorWidth + "px") : this.indicatorWidth = this.indicator.clientWidth,
            this.maxPosX = this.wrapperWidth - this.indicatorWidth,
            "clip" == this.options.shrink ? (this.minBoundaryX = 8 - this.indicatorWidth,
            this.maxBoundaryX = this.wrapperWidth - 8) : (this.minBoundaryX = 0,
            this.maxBoundaryX = this.maxPosX),
            this.sizeRatioX = this.options.speedRatioX || this.scroller.maxScrollX && this.maxPosX / this.scroller.maxScrollX),
            this.options.listenY && (this.wrapperHeight = this.wrapper.clientHeight,
            this.options.resize ? (this.indicatorHeight = u.max(u.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8),
            this.indicatorStyle.height = this.indicatorHeight + "px") : this.indicatorHeight = this.indicator.clientHeight,
            this.maxPosY = this.wrapperHeight - this.indicatorHeight,
            "clip" == this.options.shrink ? (this.minBoundaryY = 8 - this.indicatorHeight,
            this.maxBoundaryY = this.wrapperHeight - 8) : (this.minBoundaryY = 0,
            this.maxBoundaryY = this.maxPosY),
            this.maxPosY = this.wrapperHeight - this.indicatorHeight,
            this.sizeRatioY = this.options.speedRatioY || this.scroller.maxScrollY && this.maxPosY / this.scroller.maxScrollY),
            this.updatePosition()
        },
        updatePosition: function() {
            var e = this.options.listenX && u.round(this.sizeRatioX * this.scroller.x) || 0
              , t = this.options.listenY && u.round(this.sizeRatioY * this.scroller.y) || 0;
            this.options.ignoreBoundaries || (e < this.minBoundaryX ? ("scale" == this.options.shrink && (this.width = u.max(this.indicatorWidth + e, 8),
            this.indicatorStyle.width = this.width + "px"),
            e = this.minBoundaryX) : e > this.maxBoundaryX ? e = "scale" == this.options.shrink ? (this.width = u.max(this.indicatorWidth - (e - this.maxPosX), 8),
            this.indicatorStyle.width = this.width + "px",
            this.maxPosX + this.indicatorWidth - this.width) : this.maxBoundaryX : "scale" == this.options.shrink && this.width != this.indicatorWidth && (this.width = this.indicatorWidth,
            this.indicatorStyle.width = this.width + "px"),
            t < this.minBoundaryY ? ("scale" == this.options.shrink && (this.height = u.max(this.indicatorHeight + 3 * t, 8),
            this.indicatorStyle.height = this.height + "px"),
            t = this.minBoundaryY) : t > this.maxBoundaryY ? t = "scale" == this.options.shrink ? (this.height = u.max(this.indicatorHeight - 3 * (t - this.maxPosY), 8),
            this.indicatorStyle.height = this.height + "px",
            this.maxPosY + this.indicatorHeight - this.height) : this.maxBoundaryY : "scale" == this.options.shrink && this.height != this.indicatorHeight && (this.height = this.indicatorHeight,
            this.indicatorStyle.height = this.height + "px")),
            this.x = e,
            this.y = t,
            this.scroller.options.useTransform ? this.indicatorStyle[m.style.transform] = "translate(" + e + "px," + t + "px)" + this.scroller.translateZ : (this.indicatorStyle.left = e + "px",
            this.indicatorStyle.top = t + "px")
        },
        _pos: function(e, t) {
            e < 0 ? e = 0 : e > this.maxPosX && (e = this.maxPosX),
            t < 0 ? t = 0 : t > this.maxPosY && (t = this.maxPosY),
            e = this.options.listenX ? u.round(e / this.sizeRatioX) : this.scroller.x,
            t = this.options.listenY ? u.round(t / this.sizeRatioY) : this.scroller.y,
            this.scroller.scrollTo(e, t)
        },
        fade: function(e, t) {
            if (!t || this.visible) {
                clearTimeout(this.fadeTimeout),
                this.fadeTimeout = null;
                var i = e ? 250 : 500
                  , s = e ? 0 : 300;
                e = e ? "1" : "0",
                this.wrapperStyle[m.style.transitionDuration] = i + "ms",
                this.fadeTimeout = setTimeout(function(e) {
                    this.wrapperStyle.opacity = e,
                    this.visible = +e
                }
                .bind(this, e), s)
            }
        }
    },
    e.utils = m,
    "undefined" != typeof module && module.exports ? module.exports = e : "function" == typeof define && define.amd ? define(function() {
        return e
    }) : a.IScroll = e
}(window, document, Math);
var EvtAnimation = pc.createScript("evtAnimation")
  , callbackOffset = 0;
EvtAnimation.prototype.initialize = function() {}
,
EvtAnimation.prototype.playAnimation = function(e, t, i, s, n, a) {
    if (null !== i && null !== e && null !== t) {
        var r = e.animation;
        r.loop = n,
        r.speed = s,
        this._play(r, t.name, a)
    }
}
,
EvtAnimation.prototype._play = function(e, t, i) {
    e.duration && e.currentTime === e.duration && (e.currentTime -= 1e-6),
    e._isPlayed && e.currentClip == t ? e.playing = !0 : (e.play(t),
    e._isPlayed = !0),
    e.currentClip = t,
    clearTimeout(e.callback),
    e.callback = setTimeout(i, e.duration / e.speed * 1e3)
}
,
EvtAnimation.prototype.update = function(e) {}
;
/*
var str_url, ReplaceUrl = pc.createScript("replaceUrl");
ReplaceUrl.attributes.add("name", {
    type: "string"
}),
ReplaceUrl.prototype.initialize = function() {
    this._path = "";
    var t = this;
    $.get("https://cdn.weshape3d.com/GJBZ_wechat/gjbz_share.json", function(e) {
        t._path = e[t.name]
    }),
    pc.events.on("replace:share", this._replace, this),
    str_url = this._path
}
,
ReplaceUrl.prototype._replace = function() {
    isWeChart ? wx.miniProgram.navigateTo({
        url: "/pages/index/share?url=" + this._path
    }) : window.location.replace(this._path)
}
;
*/
var Audiocontorl = pc.createScript("audiocontorl");
Audiocontorl.attributes.add("path", {
    type: "string"
});
var bl_touch = !0;
Audiocontorl.prototype.initialize = function() {
    var e = document.createElement("audio");
    e.src = this.path,
    e.controls = "controls",
    e.style.display = "none",
    e.loop = "loop",
    document.body.appendChild(e),
    this._audio = e,
    document.addEventListener("touchstart", this._play.bind(this)),
    pc.events.on("audio:play", this._play, this),
    pc.events.on("audio:pause", this._pause, this)
}
,
Audiocontorl.prototype._play = function(e) {
    "touchstart" === e.type && bl_touch ? (this._audio.play(),
    document.removeEventListener("touchstart", this._play)) : "click" === e.type && this._audio.play()
}
,
Audiocontorl.prototype._pause = function() {
    bl_touch = !1,
    this._audio.pause()
}
,
Audiocontorl.prototype.update = function(e) {}
;
var ModEveCon = pc.createScript("modEveCon");
ModEveCon.attributes.add("Box", {
    type: "entity"
}),
ModEveCon.attributes.add("Mt_WK", {
    type: "asset",
    array: !0
}),
ModEveCon.attributes.add("Ani_Box", {
    type: "asset"
}),
ModEveCon.attributes.add("BG1", {
    type: "entity"
}),
ModEveCon.attributes.add("BG2", {
    type: "entity"
}),
ModEveCon.attributes.add("LZ", {
    type: "entity"
}),
ModEveCon.attributes.add("Model", {
    type: "entity"
}),
ModEveCon.prototype.initialize = function() {
    pc.events.on("PointChange_3", this.stp3_PointNum, this),
    pc.events.on("PointChange_4", this.stp4_PointNum, this),
    pc.events.on("StepChange", this.PageNum, this),
    timelineg = setTimeout(function() {
        this.entity.script.evtAnimation.playAnimation(this.Box, this.Ani_Box, !0, 1, !1, function() {
            this.Box.enabled = !1,
            pc.events.fire("StepChange", 0)
        }
        .bind(this))
    }
    .bind(this), 1200),
    this.mt_wk = new Array(2);
    for (var e = 0; e < this.mt_wk.length; e++)
        this.mt_wk[e] = this.Mt_WK[e].resource
}
,
ModEveCon.prototype.update = function(e) {
    if (!canclick)
        for (var t = 0; t < this.mt_wk.length; t++)
            this.mt_wk[t].opacity -= .01,
            this.mt_wk[t].update()
}
;
var canClick = !(ModEveCon.prototype.PageNum = function(e) {
    0 === e && this.Model.setLocalScale(1, 1, 1),
    1 == e && this.Model.setLocalScale(.001, .001, .001),
    2 == e && (this.Model.setLocalScale(1, 1, 1),
    this.BG1.enabled = !1,
    this.BG2.enabled = !1,
    this.LZ.enabled = !1),
    3 == e && (this.BG1.enabled = !0,
    this.BG2.enabled = !0,
    this.LZ.enabled = !0),
    4 == e && (this.BG2.enabled = !1,
    this.BG1.enabled = !1,
    this.LZ.enabled = !1)
}
);
ModEveCon.prototype.stp3_PointNum = function(e) {}
,
ModEveCon.prototype.stp4_PointNum = function(e) {}
;
var MtUv = pc.createScript("mtUv")
  , canplay = !1
  , isWangLou = !1
  , isZiTie = !1;
MtUv.attributes.add("Model_Fire", {
    type: "entity"
}),
MtUv.attributes.add("UV_Fire", {
    type: "asset"
}),
MtUv.attributes.add("IS_Fire", {
    type: "boolean"
}),
MtUv.attributes.add("emissiveMapOffsetX", {
    type: "number"
}),
MtUv.attributes.add("emissiveMapOffsetY", {
    type: "number"
}),
MtUv.attributes.add("opacityMapOffsetX", {
    type: "number"
}),
MtUv.attributes.add("opacityMapOffsetY", {
    type: "number"
}),
MtUv.attributes.add("ChiCun_Model", {
    type: "entity"
}),
MtUv.attributes.add("ChiCun_Ani", {
    type: "asset"
}),
MtUv.attributes.add("stp3_Mod", {
    type: "entity",
    array: !0
}),
MtUv.attributes.add("stp3_UV", {
    type: "asset",
    array: !0
}),
MtUv.attributes.add("Quan", {
    type: "entity"
}),
MtUv.attributes.add("Quan_UVc", {
    type: "asset"
}),
MtUv.attributes.add("UV_Discoc", {
    type: "asset"
}),
MtUv.prototype.initialize = function() {
    this.angle1 = 0,
    this.angle2 = 0,
    this.angle3 = 0,
    this.angle4 = 0,
    this.fireNum = .1,
    this.E_X = 0,
    this.E_Y = 0,
    this.O_X = 0,
    this.O_Y = 0,
    this.Mod = new Array(8);
    for (var e = 0; e < this.stp3_Mod.length; e++)
        this.Mod[e] = this.stp3_Mod[e];
    for (this.UV = new Array(8),
    e = 0; e < this.stp3_UV.length; e++)
        this.UV[e] = this.stp3_UV[e].resource;
    this.Quan_UV = this.Quan_UVc.resource,
    this.UV_Disco = this.UV_Discoc.resource,
    this.IsChange = !1,
    this.ChangeSpeed = 1,
    this.r = 0,
    this.g = 0,
    this.b = 0,
    this.Dong2 = .2,
    this.fu2 = !1,
    this.ChangeTime = 0,
    this.UVSpeed = 1,
    this.num = .1,
    this.UVSpeed2 = 1,
    this.num2 = .1,
    this.UVSpeed3 = 1,
    this.num3 = .1,
    this.UVSpeed4 = 1,
    this.num4 = .1,
    this.UVSpeed5 = 1,
    this.num5 = .1,
    this.WY = !1,
    this.SJ = !1,
    this.YG = !1,
    this.YC = !1,
    this.ZL = !1,
    this.Fire = !1,
    this.IsQuan = !1,
    pc.events.on("StepChange", this.OnStepChange, this),
    pc.events.on("PointChange_3", this.stp3_PointNum, this),
    pc.events.on("PointChange_4", this.stp4_PointNum, this)
}
,
MtUv.prototype.update = function(e) {
    this.num += e / 2 * .75,
    this.num = this.num % 1,
    this.num2 += e / 2 * 1,
    this.num2 = this.num2 % 1,
    this.num3 += e / 2 * -.5,
    this.num3 = this.num3 % 1,
    this.WY && (this.UV[0].opacityMapOffset.y = this.num,
    this.UV[0].update(),
    this.UV[1].opacityMapOffset.y = -this.num,
    this.UV[1].update()),
    this.SJ && (this.UV[2].opacityMapOffset.y = this.num2,
    this.UV[2].update()),
    this.YG && (this.UV[3].opacityMapOffset.y = this.num,
    this.UV[3].update()),
    this.YC && (this.UV[4].opacityMapOffset.y = this.num,
    this.UV[4].update(),
    this.UV[5].opacityMapOffset.x = this.num,
    this.UV[5].update()),
    this.ZL && (this.UV[6].opacityMapOffset.y = this.num,
    this.UV[6].update(),
    this.UV[7].opacityMapOffset.y = this.num,
    this.UV[7].update()),
    this.IsQuan ? (this.Quan.setLocalScale(1, 1, 1),
    this.Quan_UV.opacityMapOffset.y = this.num3,
    this.Quan_UV.update()) : this.Quan.setLocalScale(.001, .001, .001),
    this.Fire && (this.IS_Fire ? (this.angle1 += .01 * this.emissiveMapOffsetX,
    50 < this.angle1 && (this.angle1 = 0),
    this.E_X = Math.cos(this.angle1),
    this.angle2 += .01 * this.emissiveMapOffsetX,
    50 < this.angle2 && (this.angle2 = 0),
    this.E_Y = Math.cos(this.angle2),
    this.angle3 += .01 * this.emissiveMapOffsetX,
    50 < this.angle3 && (this.angle3 = 0),
    this.O_X = Math.cos(this.angle3),
    this.angle4 += .01 * this.emissiveMapOffsetX,
    50 < this.angle4 && (this.angle4 = 0),
    this.O_Y = Math.cos(this.angle4)) : (this.E_X += e / 2 * this.emissiveMapOffsetX,
    this.E_Y += e / 2 * this.emissiveMapOffsetY,
    this.O_X += e / 2 * this.opacityMapOffsetX,
    this.O_Y += e / 2 * this.opacityMapOffsetY),
    this.uv_Fire.emissiveMapOffset.x = this.E_X,
    this.uv_Fire.emissiveMapOffset.y = this.E_Y,
    this.uv_Fire.opacityMapOffset.x = this.O_X,
    this.uv_Fire.opacityMapOffset.y = this.O_Y,
    this.uv_Fire.update()),
    this.IsChange && (this.Dong2 < .2 && (this.fu2 = !1,
    this.ChangeTime++),
    .4 <= this.Dong2 && (this.fu2 = !0),
    this.fu2 && (e = -e),
    this.Dong2 += .4 * e,
    this.ChangeTime < 1 && (this.UV_Disco.opacity = this.Dong2),
    this.UV_Disco.emissive.r = pc.math.lerp(this.UV_Disco.emissive.r, this.r / 255, e / this.ChangeSpeed),
    this.UV_Disco.emissive.g = pc.math.lerp(this.UV_Disco.emissive.g, this.g / 255, e / this.ChangeSpeed),
    this.UV_Disco.emissive.b = pc.math.lerp(this.UV_Disco.emissive.b, this.b / 255, e / this.ChangeSpeed),
    this.UV_Disco.update())
}
,
MtUv.prototype.OnStepChange = function(e) {
    0 === e && (this.IsQuan = !0),
    1 === e && (this.stp3_Hidel(),
    this.IsQuan = !1),
    2 === e && (this.stp4_Hidel(),
    this.IsQuan = !1,
    this.ChiCun_Model.setLocalScale(1, 1, 1),
    this.ChiCun_Model.animation.currentTime = 0,
    this.ChiCun_Model.animation.speed = 0,
    this.entity.script.evtAnimation.playAnimation(this.ChiCun_Model, this.ChiCun_Ani, !0, 1, !1),
    this.IsChange = !1),
    3 === e && (this.stp3_Hidel(),
    this.IsQuan = !1,
    this.IsChange = !0),
    4 === e && (this.stp4_Hidel(),
    this.IsQuan = !0,
    this.IsChange = !1)
}
,
MtUv.prototype.stp3_Hidel = function() {
    for (var e = 0; e < this.Mod.length; e++)
        this.Mod[e].setLocalScale(.001, .001, .001);
    this.ChiCun_Model.setLocalScale(.001, .001, .001),
    this.WY = !1,
    this.SJ = !1,
    this.YG = !1,
    this.YC = !1,
    this.ZL = !1
}
,
MtUv.prototype.stp3_PointNum = function(e) {
    this.stp3_Hidel(),
    1 === e && (1 == floor3_point || (this.WY = !0,
    this.Mod[0].setLocalScale(1, 1, 1),
    this.Mod[1].setLocalScale(1, 1, 1))),
    2 === e && (2 == floor3_point || (this.SJ = !0,
    this.Mod[2].setLocalScale(1, 1, 1))),
    3 === e && (3 == floor3_point || (this.YG = !0,
    this.Mod[3].setLocalScale(1, 1, 1))),
    4 === e && (4 == floor3_point || (this.YC = !0,
    this.Mod[4].setLocalScale(1, 1, 1),
    this.Mod[5].setLocalScale(1, 1, 1))),
    5 === e && (5 == floor3_point || (this.ZL = !0,
    this.Mod[6].setLocalScale(1, 1, 1),
    this.Mod[7].setLocalScale(1, 1, 1)))
}
,
MtUv.prototype.stp4_Hidel = function() {
    this.ChangeTime = 0,
    this.Dong2 = .2,
    this.UV_Disco.opacity = this.Dong2,
    this.UV_Disco.update(),
    this.r = 236,
    this.g = 164,
    this.b = 40
}
,
MtUv.prototype.stp4_PointNum = function(e) {
    this.stp4_Hidel(),
    1 === e && (1 == floor4_point || (this.r = 202,
    this.g = 62,
    this.b = 35)),
    2 === e && (2 == floor4_point || (this.r = 226,
    this.g = 98,
    this.b = 20)),
    3 === e && (3 == floor4_point || (this.r = 254,
    this.g = 224,
    this.b = 52)),
    4 === e && (4 == floor4_point || (this.r = 107,
    this.g = 110,
    this.b = 0))
}
;
