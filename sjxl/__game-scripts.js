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
Camera.attributes.add("YH", {
    type: "entity"
}),
Camera.attributes.add("LJD", {
    type: "entity"
}),
Camera.attributes.add("GH", {
    type: "entity"
}),
Camera.attributes.add("L", {
    type: "entity"
}),
Camera.attributes.add("GT", {
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
var angle_maxUp, angle_maxDown, distance_max, distance_min, bl_AutoRotate = !1, fl_time = 0, blCanControl = !0, startY = 0;
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
        this.rotX = -7.6,
        this.rotY = 0,
        this.targetRotX = -7.6,
        this.targetRotY = 0,
        this.quatA = new pc.Quat,
        this.quatB = new pc.Quat,
        this.transformStarted = !1,
        this.panX = 0,
        this.panY = 1.64,
        this.targetPanX = 0,
        this.targetPanY = 1.64,
        this.zoomLocked = !0,
        this.rotLocked = !0,
        this.panLocked = !0,
        this.lockX = !1,
        this.lockY = !1,
        this.runEnable = !0,
        this.operating = !1,
        this.step_Rotate = !1,
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
        pc.events.on("StepChange", function() {
            this.targetViewPos.copy(this.handpickCenter.getPosition()),
            document.getElementById("ID_imagehow").style.opacity = 0
        }
        .bind(this)),
        pc.events.on("PointChange", function(e) {
            this.targetViewPos.copy(this.handpickCenter.getPosition()),
            1 === floor_point && this.targetViewPos.copy(this.YH.getPosition()),
            2 === floor_point && this.targetViewPos.copy(this.LJD.getPosition()),
            3 === floor_point && this.targetViewPos.copy(this.GH.getPosition()),
            4 === floor_point && this.targetViewPos.copy(this.L.getPosition()),
            5 === floor_point && this.targetViewPos.copy(this.GT.getPosition())
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
        this.reset(e, 50)
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
        if (blCanControl) {
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
});
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
    null !== this.stepData[e].maxdown ? CameraHandle.camScript.maxElevationDown = this.stepData[e].maxdown : CameraHandle.camScript.maxElevationDown = angle_maxDown
}
,
CameraHandle.prototype.swap = function(e) {}
;
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
var UieventControl = pc.createScript("uieventControl");
UieventControl.attributes.add("TotalStep", {
    type: "number"
});
var total_number, div, mScroll, timepoint, timelineg, current_number = 0;
UieventControl.attributes.add("MT_TouMing", {
    type: "asset"
}),
UieventControl.attributes.add("Hidel", {
    type: "entity"
});
var str_index = "msg_1"
  , canclick = !1
  , isWeChart = !1
  , floor_point = 0;
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
    $("#stp4_YH").on("click", function() {
        pc.events.fire("PointChange", 1)
    }),
    $("#stp4_LJD").on("click", function() {
        pc.events.fire("PointChange", 2)
    }),
    $("#stp4_GH").on("click", function() {
        pc.events.fire("PointChange", 3)
    }),
    $("#stp4_L").on("click", function() {
        pc.events.fire("PointChange", 4)
    }),
    $("#stp4_GT").on("click", function() {
        pc.events.fire("PointChange", 5)
    }),
    total_number = this.TotalStep - 1,
    this.bl_First = !0,
    this.Cover = !1,
    pc.events.on("StepChange", this.OnStepChange, this),
    pc.events.on("PointChange", this.Fen, this),
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
    div.stp3material = document.getElementsByClassName("stp3material")[0].style,
    div.stp3msg = document.getElementsByClassName("stp3msg")[0].style,
    div.stp5link = document.getElementById("btnlink").style,
    div.stp5msg = document.getElementsByClassName("stp5msg")[0].style,
    div.timelinegold.overflow = "hidden",
    mScroll = new IScroll("#wrapper1",{
        scrollY: !0,
        freeScroll: !0,
        scrollbars: !0,
        bounce: !1
    }),
    div.stp2bg2.display = "none"
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
UieventControl.prototype.update = function(e) {
    this.Cover ? (this.MT_TouMing.resource.opacity -= .015,
    this.MT_TouMing.resource.update()) : canclick && (this.Hidel.enabled = !1)
}
,
UieventControl.prototype.OnStepChange = function(e) {
    if (!(total_number < e)) {
        clearTimeout(timelineg),
        clearTimeout(timepoint);
        for (var t = 0; t < div.title.length; t++)
            div.title[t].style.opacity = e - 1 === t ? 1 : 0;
        switch (1 !== e ? (div.stp2bg1.opacity = 0,
        div.stp2bg2.display = "none",
        div.stp2icon.opacity = 0) : (div.stp2bg1.opacity = 1,
        div.stp2bg2.display = "block",
        div.stp2icon.opacity = 1),
        2 !== e ? (div.stp3material.opacity = 0,
        div.stp3msg.opacity = 0) : (div.stp3material.opacity = 1,
        div.stp3msg.opacity = 1),
        3 !== e ? this.Step4(0) : this.Step4(1),
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
                div.how.opacity = 1,
                this.Cover = !0
            }
            .bind(this), 100),
            timepoint = setTimeout(function() {
                div.timelinegold.overflow = "unset",
                canclick = !0,
                this.Cover = !1
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
            div.stp1.opacity = 0;
            break;
        case 2:
            this.Step4_Hide(),
            div.timelinegold.opacity = 0,
            div.stp1.opacity = 0;
            break;
        case 3:
            div.timelinegold.opacity = 0,
            div.stp1.opacity = 0;
            break;
        case 4:
            this.Step4_Hide(),
            div.timelinegold.opacity = 0,
            div.stp1.opacity = 0
        }
    }
}
,
UieventControl.prototype.changeStep = function(e) {
    if (canclick) {
        floor_point = 0,
        "rightBtn" === e.currentTarget.id ? current_number++ : current_number--,
        total_number < current_number ? current_number = 0 : current_number < 0 && (current_number = total_number),
        document.getElementsByClassName("iconActive")[0].className = "iconNormal";
        for (var t = 0; t < document.getElementsByClassName("iconNormal").length; t++)
            t === current_number && (document.getElementsByClassName("iconNormal")[current_number].className = "iconActive");
        pc.events.fire("StepChange", current_number)
    }
}
,
UieventControl.prototype.Fen = function(e) {
    this.Step4_Hide(),
    1 === e && (1 == floor_point ? (pc.events.fire("StepChange", 3),
    floor_point = 0) : (pc.events.fire("StepChange", 5),
    floor_point = 1,
    document.getElementById("stp4_YH_On").style.opacity = 1)),
    2 === e && (2 == floor_point ? (pc.events.fire("StepChange", 3),
    floor_point = 0) : (pc.events.fire("StepChange", 6),
    floor_point = 2,
    document.getElementById("ID_stp4_Sq1").style.opacity = 1,
    document.getElementById("stp4_LJD_On").style.opacity = 1)),
    3 === e && (3 == floor_point ? (pc.events.fire("StepChange", 3),
    floor_point = 0) : (pc.events.fire("StepChange", 7),
    floor_point = 3,
    document.getElementById("stp4_GH_On").style.opacity = 1)),
    4 === e && (4 == floor_point ? (floor_point = 0,
    pc.events.fire("StepChange", 3)) : (pc.events.fire("StepChange", 8),
    floor_point = 4,
    document.getElementById("stp4_L_On").style.opacity = 1,
    document.getElementById("ID_stp4_Sq2").style.opacity = 1)),
    5 === e && (5 == floor_point ? (floor_point = 0,
    pc.events.fire("StepChange", 3)) : (pc.events.fire("StepChange", 9),
    floor_point = 5,
    document.getElementById("stp4_GT_On").style.opacity = 1))
}
,
UieventControl.prototype.Step4_Hide = function() {
    document.getElementById("stp4_YH_On").style.opacity = 0,
    document.getElementById("stp4_LJD_On").style.opacity = 0,
    document.getElementById("stp4_GH_On").style.opacity = 0,
    document.getElementById("stp4_L_On").style.opacity = 0,
    document.getElementById("stp4_GT_On").style.opacity = 0,
    document.getElementById("ID_stp4_Sq1").style.opacity = 0,
    document.getElementById("ID_stp4_Sq2").style.opacity = 0
}
,
UieventControl.prototype.Step4 = function(e) {
    0 === e ? (document.getElementById("stp4_YH").style.display = "none",
    document.getElementById("stp4_LJD").style.display = "none",
    document.getElementById("stp4_GH").style.display = "none",
    document.getElementById("stp4_L").style.display = "none",
    document.getElementById("stp4_GT").style.display = "none") : (document.getElementById("stp4_YH").style.display = "block",
    document.getElementById("stp4_LJD").style.display = "block",
    document.getElementById("stp4_GH").style.display = "block",
    document.getElementById("stp4_L").style.display = "block",
    document.getElementById("stp4_GT").style.display = "block"),
    document.getElementById("ID_stp4_TopWord").style.opacity = e,
    document.getElementById("stp4").style.opacity = e,
    document.getElementById("ID_stp4_BG_K2").style.opacity = e,
    document.getElementById("ID_stp4_BG_K").style.opacity = e
}
;
var Cam, ModEveCon = pc.createScript("modEveCon");
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
ModEveCon.attributes.add("Modle", {
    type: "entity"
}),
ModEveCon.attributes.add("Ani_Size", {
    type: "asset"
}),
ModEveCon.attributes.add("MT_Size", {
    type: "asset"
}),
ModEveCon.attributes.add("Sea", {
    type: "entity"
}),
ModEveCon.attributes.add("Ani_Sea", {
    type: "asset"
});
var IsSize_MT = !1;
ModEveCon.prototype.initialize = function() {
    this.Sea.animation.currentTime = 0,
    this.Sea.animation.speed = 0,
    Cam = this.entity.findByName("Camera").script.camera,
    pc.events.on("StepChange", this.PageNum, this),
    timelineg = setTimeout(function() {
        this.entity.script.evtAnimation.playAnimation(this.Box, this.Ani_Box, !0, 1, !1, function() {
            this.Box.enabled = !1,
            this.entity.script.evtAnimation.playAnimation(this.Sea, this.Ani_Sea, !0, -1, !1),
            pc.events.fire("StepChange", 0)
        }
        .bind(this))
    }
    .bind(this), 1200),
    timepoint = setTimeout(function() {}
    .bind(this), 3200),
    this.mt_wk = new Array(2);
    for (var e = 0; e < this.mt_wk.length; e++)
        this.mt_wk[e] = this.Mt_WK[e].resource;
    pc.events.on("PointChange", this.PointNum, this),
    this.IsMode = !1,
    this.Rot = 0
}
,
ModEveCon.prototype.update = function(e) {
    if (!canclick)
        for (var t = 0; t < this.mt_wk.length; t++)
            this.mt_wk[t].opacity -= .01,
            this.mt_wk[t].update();
    this.IsMode && this.Rot <= 360 && (this.Modle.setEulerAngles(0, this.Rot, 0),
    this.Rot += 110 * e)
}
,
ModEveCon.prototype.PageNum = function(e) {
    if (this.IsMode = !1,
    this.Modle.setEulerAngles(0, 0, 0),
    this.Rot = 0,
    !(total_number < e)) {
        if (0 === e) {
            if (!canclick)
                return;
            this.Sea.animation.currentTime = .9,
            this.Sea.animation.speed = 0,
            this.entity.script.evtAnimation.playAnimation(this.Sea, this.Ani_Sea, !0, -1, !1)
        }
        1 == e ? (this.Rot = 0,
        this.Sea.setLocalScale(.001, .001, .001),
        this.Modle.setLocalScale(.001, .001, .001)) : (this.Sea.setLocalScale(1, 1, 1),
        this.Modle.setLocalScale(1, 1, 1)),
        2 == e && (this.Sea.animation.currentTime = 0,
        this.Sea.animation.speed = 0,
        canclick = !1,
        this.entity.script.evtAnimation.playAnimation(this.Sea, this.Ani_Sea, !0, 1, !1, function() {
            this.IsMode = !0,
            canclick = !0
        }
        .bind(this))),
        3 == e && this.Sea.setLocalScale(.001, .001, .001),
        4 == e && (this.Sea.setLocalScale(1, 1, 1),
        this.Sea.animation.currentTime = .9,
        this.Sea.animation.speed = 0)
    }
}
,
ModEveCon.prototype.PointNum = function(e) {
    this.Sea.setLocalScale(.001, .001, .001)
}
;
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
var MtUv = pc.createScript("mtUv")
  , canplay = !1
  , isWangLou = !1
  , isZiTie = !1;
MtUv.attributes.add("MT_YuanHuan", {
    type: "asset"
}),
MtUv.attributes.add("MT_LianJieDai", {
    type: "asset"
}),
MtUv.attributes.add("MT_GouHuan", {
    type: "asset"
}),
MtUv.attributes.add("MT_Lian", {
    type: "asset"
}),
MtUv.attributes.add("MT_GouTou", {
    type: "asset"
}),
MtUv.attributes.add("MT_Effect1", {
    type: "asset"
}),
MtUv.prototype.initialize = function() {
    this.UVSpeed = .1,
    this.num = .1,
    this.GouTou = !1,
    this.GouHuan = !1,
    this.Lian = !1,
    this.LianJieDai = !1,
    this.YuanHuan = !1,
    pc.events.on("PointChange", this.PointNum, this),
    pc.events.on("StepChange", this.PageNum, this),
    this.mt1 = this.MT_YuanHuan.resource,
    this.mt2 = this.MT_LianJieDai.resource,
    this.mt3 = this.MT_GouHuan.resource,
    this.mt4 = this.MT_Lian.resource,
    this.mt5 = this.MT_GouTou.resource,
    this.mt_1 = this.MT_Effect1.resource
}
,
MtUv.prototype.update = function(e) {
    this.UVSpeed += e / 25,
    this.UVSpeed = this.UVSpeed % 1,
    this.mt_1.diffuseMapOffset.x = this.UVSpeed,
    this.mt_1.diffuseMapOffset.y = this.UVSpeed,
    this.mt_1.glossMapOffset.x = this.UVSpeed,
    this.mt_1.glossMapOffset.y = this.UVSpeed,
    this.mt_1.normalMapOffset.x = this.UVSpeed,
    this.mt_1.normalMapOffset.y = this.UVSpeed,
    this.mt_1.update(),
    this.YuanHuan && (this.num -= e / 2,
    this.num = this.num % 1,
    this.mt1.opacityMapOffset.y = this.num,
    this.mt1.update()),
    this.LianJieDai && (this.num -= e / 2,
    this.num = this.num % 1,
    this.mt2.opacityMapOffset.y = this.num,
    this.mt2.update()),
    this.GouHuan && (this.num -= e / 2,
    this.num = this.num % 1,
    this.mt3.opacityMapOffset.y = this.num,
    this.mt3.update()),
    this.Lian && (this.num -= e / 2,
    this.num = this.num % 1,
    this.mt4.opacityMapOffset.y = this.num,
    this.mt4.update()),
    this.GouTou && (this.num -= e / 4,
    this.num = this.num % 1,
    this.mt5.opacityMapOffset.y = this.num,
    this.mt5.update())
}
,
MtUv.prototype.PageNum = function(e) {
    this.PointNum(0)
}
,
MtUv.prototype.PointNum = function(e) {
    this.Fun(),
    1 === floor_point ? (this.YuanHuan = !0,
    this.mt1.opacity = .8) : this.mt1.opacity = 0,
    this.mt1.update(),
    2 === floor_point ? (this.LianJieDai = !0,
    this.mt2.opacity = .8) : this.mt2.opacity = 0,
    this.mt2.update(),
    3 === floor_point ? (this.GouHuan = !0,
    this.mt3.opacity = .8) : this.mt3.opacity = 0,
    this.mt3.update(),
    4 === floor_point ? (this.Lian = !0,
    this.mt4.opacity = .8) : this.mt4.opacity = 0,
    this.mt4.update(),
    5 === floor_point ? (this.GouTou = !0,
    this.mt5.opacity = .8) : this.mt5.opacity = 0,
    this.mt5.update()
}
,
MtUv.prototype.Fun = function() {
    this.GouTou = !1,
    this.GouHuan = !1,
    this.Lian = !1,
    this.LianJieDai = !1,
    this.YuanHuan = !1
}
;
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
;*/