



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
var angle_maxUp, angle_maxDown, distance_max, distance_min, bl_AutoRotate = !1,
    fl_time = 0,
    blCanControl = !0,
    startY = 0,
    clickplay = !0;
Object.assign(pc.events, {
        _callbacks: {},
        _callbackActive: {}
    }),
    Camera.prototype.swap = function (e) {},
    Camera.extend({
        initialize: function () {
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
                this.rotX = -180,
                this.rotY = 0,
                this.targetRotX = -40,
                this.targetRotY = 30,
                this.quatA = new pc.Quat,
                this.quatB = new pc.Quat,
                this.transformStarted = !1,
                this.panX = 0,
                this.panY = 0,
                this.targetPanX = 0,
                this.targetPanY = 0,
                this.zoomLocked = !0,
                this.rotLocked = !0,
                this.panLocked = !0,
                this.lockX = !0,
                this.lockY = !0,
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
                this.hammer.on("pan2start", function (e) {
                        panWheelX = e.center.x,
                            panWheelY = e.center.y,
                            div.how.opacity = 0
                    }
                    .bind(this)),
                this.hammer.on("pan2move", function (e) {
                        var t = this.distance / 500,
                            i = e.center.x - panWheelX,
                            s = e.center.y - panWheelY;
                        this.pan(i * -t, s * t),
                            panWheelX = e.center.x,
                            panWheelY = e.center.y
                    }
                    .bind(this)),
                this.hammer.on("panstart", function (e) {
                        if (cachedX = e.center.x,
                            cachedY = e.center.y,
                            div.how.opacity = 0,
                            !this.transformStarted) {
                            var t = e.srcEvent,
                                i = void 0 !== t.touches ? t.touches.length : 1;
                            this.panning = 2 === i,
                                this.dragStarted = !0
                        }
                    }
                    .bind(this)),
                this.hammer.on("panmove", function (e) {
                        var t = e.center.y - cachedY,
                            i = e.center.x - cachedX;
                        this.orbit(t * -this.yawSensitivity, i * -this.yawSensitivity),
                            blCanControl ? startY = 0 : startY += i / 2,
                            cachedX = e.center.x,
                            cachedY = e.center.y
                    }
                    .bind(this)),
                this.hammer.on("panend", function (e) {
                        this.dragStarted && (this.dragStarted = !1,
                            this.panning = !1)
                    }
                    .bind(this)),
                this.hammer.get("pinch").set({
                    enable: !0
                }),
                this.hammer.on("pinchstart ", function (e) {
                        pinchScale = e.scale,
                            div.how.opacity = 0
                    }
                    .bind(this)),
                this.hammer.on("pinchend", function (e) {}
                    .bind(this)),
                this.hammer.on("pinchmove", function (e) {
                        var t = e.scale - pinchScale;
                        this.dolly(t * -this.pinchSensitivity * 15),
                            pinchScale = e.scale
                    }
                    .bind(this)),
                this.app.mouse.on(pc.input.EVENT_MOUSEMOVE, this.onMouseMove, this),
                this.app.mouse.on(pc.input.EVENT_MOUSEWHEEL, this.onMouseWheel, this),
                this.entity.camera.clearColor.set(1, 1, 1, 1)
        },
        setBestCameraPositionForModel: function () {
            this.app.scene.getModels();
            var e = this.handpickCenter.getPosition();
            this.reset(e, 5)
        },
        reset: function (e, t) {
            this.viewPos.copy(e),
                this.targetViewPos.copy(e),
                this.distance = t,
                this.targetDistance = t,
                this.rotX = 0,
                this.rotY = 0,
                this.targetRotX = 0,
                this.targetRotY = 0
        },
        rotateByDegree: function (e, t) {
            this.targetRotY = e.y,
                this.targetRotY = this.calShortRotate(e.y, this.rotY),
                this.targetRotX = e.x,
                this.targetDistance = t
        },
        calShortRotate: function (e, t) {
            return t < 0 || 360 < t ? t - t % 360 + e : e
        },
        pan: function (e, t) {
            blCanControl && (this.panLocked || (fl_time = 0,
                    this.targetPanX += e,
                    this.targetPanY += t),
                this.operating = !0)
        },
        translateCam: function (e, t) {
            this.targetPanX = e,
                this.targetPanY = t
        },
        dolly: function (e) {
            blCanControl && (this.zoomLocked || (fl_time = 0,
                    this.targetDistance += e,
                    this.targetDistance < this.minDistance ? this.targetDistance = this.minDistance : this.targetDistance > this.maxDistance && (this.targetDistance = this.maxDistance)),
                this.operating = !0)
        },
        orbit: function (e, t) {
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
        onMouseWheel: function (e) {
            blCanControl && this.dolly(e.wheel * -this.pinchSensitivity)
        },
        onMouseMove: function (e) {
            if (blCanControl && e.buttons[pc.input.MOUSEBUTTON_RIGHT]) {
                var t = this.distance / 500;
                this.pan(e.dx * -t, e.dy * t)
            }
        },
        clampAngle: function (e) {
            return e < -360 && (e += 360),
                360 < e && (e -= 360),
                e
        },
        getCamYawAngle: function () {
            return this.rotY % 360 < 0 ? 360 + this.rotY % 360 : this.rotY % 360
        },
        update: function (e) {
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
        onStepChange: function (e) {
            div.how.opacity = 0,
                fl_time = 0,
                bl_AutoRotate = !1
        },
        lock: function (e, t, i) {
            this.rotLocked = e,
                this.zoomLocked = t,
                this.panLocked = i
        },
        setTargetPos: function (e) {
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
        getTargetPos: function () {
            return {
                rotX: this.targetRotX,
                rotY: this.targetRotY,
                panX: this.targetPanX,
                panY: this.targetPanY,
                dist: this.targetDistance
            }
        },
        print: function () {},
        print2: function () {
            var e = this.entity.getPosition(),
                t = this.entity.getEulerAngles(),
                i = this.entity.forward;
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
    CameraHandle.prototype.initialize = function () {
        CameraHandle.camScript = this.entity.script.camera,
            pc.events.on("StepChange", this.onStepChange, this),
            pc.events.on("OnStepF", this.StepFour, this),
            this.stepData = this.StepData.resources
    },
    CameraHandle.prototype.StepFour = function (e) {
        this.onStepChange(e + 5)
    },
    CameraHandle.prototype.onStepChange = function (e) {
        var t = new pc.Vec2(this.stepData[e].rotX, this.stepData[e].rotY),
            i = this.stepData[e].dist,
            s = this.stepData[e].panX,
            n = this.stepData[e].panY;
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
    };
var Audiocontorl = pc.createScript("audiocontorl");
Audiocontorl.attributes.add("path", {
    type: "string"
});
var bl_touch = !0;
Audiocontorl.prototype.initialize = function () {
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
    },
    Audiocontorl.prototype._play = function (e) {
        if ("touchstart" === e.type && bl_touch) {
            this._audio.play();
            document.removeEventListener("touchstart", this._play);
        } else {
            "click" === e.type && this._audio.play()
        }
        //"touchstart" === e.type && bl_touch ? (this._audio.play(),
        //     document.removeEventListener("touchstart", this._play)) : "click" === e.type && this._audio.play()
    },
    Audiocontorl.prototype._pause = function (e) {
        bl_touch = !1,
            this._audio.pause()
    },
    Audiocontorl.prototype.update = function (e) {};
var UiControl = pc.createScript("uiControl");
UiControl.attributes.add("uiAssets", {
        type: "asset",
        array: !0
    }),
    UiControl.attributes.add("uiHtml", {
        type: "asset"
    }),
    UiControl.prototype.initialize = function () {
        document.body.addEventListener("touchmove", function (e) {
                e.preventDefault()
            }, {
                passive: !1
            }),
            $(document.body).append(this.editImgUrl(this.uiHtml.resource));
        for (var e = 0; e < this.uiAssets.length; e++)
            this.createElement(this.uiAssets[e])
    },
    UiControl.prototype.createElement = function (e) {
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
    },
    UiControl.prototype.editImgUrl = function (e) {
        var t = e.match(/\$(\d){8}\%/g);
        if (null === t)
            return e;
        for (var i = 0; i < t.length; i++) {
            var s = t[i].substr(1, 8),
                n = this.app.assets.get(s);
            if (null != n) {
                var a = n.getFileUrl();
                e = e.replace(t[i], a)
            }
        }
        return e
    };
var EvtAnimation = pc.createScript("evtAnimation"),
    callbackOffset = 0;
EvtAnimation.prototype.initialize = function () {},
    EvtAnimation.prototype.playAnimation = function (e, t, i, s, n, a) {
        if (null !== i && null !== e && null !== t) {
            var r = e.animation;
            r.loop = n,
                r.speed = s,
                this._play(r, t.name, a)
        }
    },
    EvtAnimation.prototype._play = function (e, t, i) {
        e.duration && e.currentTime === e.duration && (e.currentTime -= 1e-6),
            e._isPlayed && e.currentClip == t ? e.playing = !0 : (e.play(t),
                e._isPlayed = !0),
            e.currentClip = t,
            clearTimeout(e.callback),
            e.callback = setTimeout(i, e.duration / e.speed * 1e3)
    },
    EvtAnimation.prototype.update = function (e) {};
var ModelControl = pc.createScript("modelControl");
ModelControl.attributes.add("Model", {
        type: "entity"
    }),
    ModelControl.attributes.add("Anim_Box", {
        type: "entity"
    }),
    ModelControl.attributes.add("Clip_Box", {
        type: "asset"
    }),
    ModelControl.attributes.add("Anim_Size", {
        type: "entity"
    }),
    ModelControl.attributes.add("Clip_Size", {
        type: "asset"
    }),
    ModelControl.attributes.add("Circle", {
        type: "entity"
    }),
    ModelControl.attributes.add("Mt_Model", {
        type: "asset",
        array: !0
    }),
    ModelControl.attributes.add("Model_Ming", {
        type: "entity"
    }),
    ModelControl.attributes.add("Model_Wen", {
        type: "entity"
    }),
    ModelControl.attributes.add("Model_Zhu", {
        type: "entity"
    }),
    ModelControl.attributes.add("Model_Er", {
        type: "entity"
    }),
    ModelControl.attributes.add("Model_Zu", {
        type: "entity"
    }),
    ModelControl.attributes.add("Mt_WK", {
        type: "asset",
        array: !0
    });
var bl_mt1, bl_mt2, bl_mt3, bl_mt4, bl_mt5, V3ONE = new pc.Vec3(1, 1, 1),
    V3ZERO = new pc.Vec3(.001, .001, .001);
ModelControl.prototype.initialize = function () {
        setTimeout(function () {
                    this.entity.script.evtAnimation.playAnimation(this.Anim_Box, this.Clip_Box, !0, 1.2, !1, function () {
                            pc.events.fire("StepChange", 0),
                                this.Circle.setLocalScale(V3ONE),
                                this.Anim_Box.enabled = !1,
                                bl_AutoRotate = !1
                        }
                        .bind(this))
                }
                .bind(this), 1500),
            pc.events.on("OnStepF", this.StepFour, this),
            pc.events.on("StepChange", this.OnStepChange, this),
            bl_mt1 = bl_mt2 = bl_mt3 = bl_mt4 = bl_mt5 = !1,
            this.UVSpeed = 2,
            this.num = .1,
            this.mt_model = new Array(5);
        for (var e = 0; e < this.mt_model.length; e++)
            this.mt_model[e] = this.Mt_Model[e].resource;
        for (this.mt_wk = new Array(2),
            e = 0; e < this.mt_wk.length; e++)
            this.mt_wk[e] = this.Mt_WK[e].resource
    },
    ModelControl.prototype.StepFour = function (e) {
        bl_mt1 = bl_mt2 = bl_mt3 = bl_mt4 = bl_mt5 = !1,
            0 === e ? (this.Model_Ming.setLocalScale(V3ONE),
                this.Model_Wen.setLocalScale(V3ZERO),
                this.Model_Zhu.setLocalScale(V3ZERO),
                this.Model_Er.setLocalScale(V3ZERO),
                this.Model_Zu.setLocalScale(V3ZERO),
                bl_mt1 = !0) : 1 === e ? (this.Model_Ming.setLocalScale(V3ZERO),
                this.Model_Wen.setLocalScale(V3ONE),
                this.Model_Zhu.setLocalScale(V3ZERO),
                this.Model_Er.setLocalScale(V3ZERO),
                this.Model_Zu.setLocalScale(V3ZERO),
                bl_mt2 = !0) : 2 === e ? (this.Model_Ming.setLocalScale(V3ZERO),
                this.Model_Wen.setLocalScale(V3ZERO),
                this.Model_Zhu.setLocalScale(V3ONE),
                this.Model_Er.setLocalScale(V3ZERO),
                this.Model_Zu.setLocalScale(V3ZERO),
                bl_mt3 = !0) : 3 === e ? (this.Model_Ming.setLocalScale(V3ZERO),
                this.Model_Wen.setLocalScale(V3ZERO),
                this.Model_Zhu.setLocalScale(V3ZERO),
                this.Model_Er.setLocalScale(V3ONE),
                this.Model_Zu.setLocalScale(V3ZERO),
                bl_mt4 = !0) : 4 === e && (this.Model_Ming.setLocalScale(V3ZERO),
                this.Model_Wen.setLocalScale(V3ZERO),
                this.Model_Zhu.setLocalScale(V3ZERO),
                this.Model_Er.setLocalScale(V3ZERO),
                this.Model_Zu.setLocalScale(V3ONE),
                bl_mt5 = !0)
    },
    ModelControl.prototype.OnStepChange = function (e) {
        if (!(total_number < e))
            switch (bl_mt1 = 3 !== e ? (this.Model_Ming.setLocalScale(V3ZERO),
                    this.Model_Wen.setLocalScale(V3ZERO),
                    this.Model_Zhu.setLocalScale(V3ZERO),
                    this.Model_Er.setLocalScale(V3ZERO),
                    this.Model_Zu.setLocalScale(V3ZERO),
                    bl_mt2 = bl_mt3 = bl_mt4 = bl_mt5 = !1) : (this.Model_Ming.setLocalScale(V3ONE),
                    !0),
                0 === e || 4 === e ? this.Circle.setLocalScale(V3ONE) : this.Circle.setLocalScale(V3ZERO),
                1 === e ? this.Model.setLocalScale(V3ZERO) : this.Model.setLocalScale(V3ONE),
                e) {
                case 0:
                    break;
                case 1:
                    this.Anim_Size.animation.currentTime = 0,
                        this.Anim_Size.animation.speed = 0;
                    break;
                case 2:
                    this.entity.script.evtAnimation.playAnimation(this.Anim_Size, this.Clip_Size, !0, 2, !1);
                    break;
                case 3:
                    this.Anim_Size.animation.currentTime = 0,
                        this.Anim_Size.animation.speed = 0
            }
    },
    ModelControl.prototype.update = function (e) {
        if (!canclick)
            for (var t = 0; t < this.mt_wk.length; t++)
                this.mt_wk[t].opacity -= .01,
                this.mt_wk[t].update();
        bl_mt1 && (this.num += e / 4 * this.UVSpeed,
                this.num = this.num % 1,
                this.mt_model[0].emissiveMapOffset.x = this.num,
                this.mt_model[0].update()),
            bl_mt2 && (this.num += e / 4 * this.UVSpeed,
                this.num = this.num % 1,
                this.mt_model[1].emissiveMapOffset.x = this.num,
                this.mt_model[1].update()),
            bl_mt3 && (this.num += e / 4 * this.UVSpeed,
                this.num = this.num % 1,
                this.mt_model[2].opacityMapOffset.y = this.num,
                this.mt_model[2].update()),
            bl_mt4 && (this.num += e / 4 * this.UVSpeed,
                this.num = this.num % 1,
                this.mt_model[3].opacityMapOffset.y = this.num,
                this.mt_model[3].update()),
            bl_mt5 && (this.num += e / 4 * this.UVSpeed,
                this.num = this.num % 1,
                this.mt_model[4].opacityMapOffset.y = this.num,
                this.mt_model[4].update())
    };
var UieventControl = pc.createScript("uieventControl");
UieventControl.attributes.add("TotalStep", {
    type: "number"
});
var total_number, div, mScroll, timepoint, timelineg, current_number = 0,
    str_index = "msg_1",
    canclick = !1,
    isWeChat = !1;
UieventControl.prototype.initialize = function () {
        /*var e = document.createElement("script");
        e.src = "https://res.wx.qq.com/open/js/jweixin-1.3.2.js",
            document.body.appendChild(e),
            e.addEventListener("load", function () {
                wx.miniProgram.getEnv(function (e) {
                    isWeChat = e.miniprogram
                })
            }),*/
            $("#rightBtn").on("click", this.changeStep),
            $("#leftBtn").on("click", this.changeStep),
            $("#btnlink").on("click", this.BtnLink),
            $(".stp4btn").on("click", this.BtnMessage),
            $(".btnAudio").on("click", this.BtnPlay),
            total_number = this.TotalStep - 1,
            this.bl_First = !0,
            pc.events.on("StepChange", this.OnStepChange, this),
            document.getElementById("timeline").style.width = document.body.offsetWidth + "px",
            (div = this).stp1 = document.getElementsByClassName("step1title")[0].style,
            div.timelinegold = document.getElementsByClassName("timelinegold")[0].style,
            div.timepoint = document.getElementsByClassName("timepoint")[0].style,
            div.timeyear = document.getElementsByClassName("timeyear")[0].style,
            div.timenum = document.getElementsByClassName("timenum")[0].style,
            div.how = document.getElementsByClassName("imagehow")[0].style,
            div.title = document.getElementsByClassName("stptitle"),
            div.stp2bg1 = document.getElementsByClassName("stp2bg1")[0].style,
            div.stp2bg2 = document.getElementsByClassName("stp2bg2")[0].style,
            div.stp2icon = document.getElementsByClassName("stp2icon")[0].style,
            div.stp3material = document.getElementsByClassName("stp3material")[0].style,
            div.stp3msg = document.getElementsByClassName("stp3msg")[0].style,
            div.stp4bg = document.getElementsByClassName("stp4bg")[0].style,
            div.stp4msg = document.getElementsByClassName("stp4msg")[0].style,
            div.stp4btn = document.getElementsByClassName("stp4btn"),
            div.stp4info = document.getElementsByClassName("stp4info"),
            div.stp5link = document.getElementById("btnlink").style,
            div.stp5msg = document.getElementsByClassName("stp5msg")[0].style,
            div.timelinegold.overflow = "hidden",
            mScroll = new IScroll("#wrapper1", {
                scrollY: !0,
                freeScroll: !0,
                scrollbars: !0,
                bounce: !1
            }),
            div.stp2bg2.display = "none"
    },
    UieventControl.prototype.BtnPlay = function (e) {
        "isplay" === e.currentTarget.id ? (pc.events.fire("audio:pause", e),
            document.getElementById("isplay").style.display = "none",
            document.getElementById("noplay").style.display = "block") : (pc.events.fire("audio:play", e),
            document.getElementById("isplay").style.display = "block",
            document.getElementById("noplay").style.display = "none")
    },
    UieventControl.prototype.BtnLink = function () {
        pc.events.fire("replace:share")
    },
    UieventControl.prototype.BtnMessage = function (e) {
        if (str_index !== e.currentTarget.id) {
            for (var t = 0; t < div.stp4btn.length; t++)
                t % 2 != 0 && (div.stp4btn[t].style.opacity = 0);
            for (t = 0; t < div.stp4info.length; t++)
                div.stp4info[t].style.opacity = 0;
            "msg_1" === e.currentTarget.id ? (str_index = "msg_1",
                div.stp4btn[1].style.opacity = 1,
                div.stp4info[0].style.opacity = 1,
                pc.events.fire("OnStepF", 0)) : "msg_2" === e.currentTarget.id ? (str_index = "msg_2",
                div.stp4btn[3].style.opacity = 1,
                div.stp4info[1].style.opacity = 1,
                pc.events.fire("OnStepF", 1)) : "msg_3" === e.currentTarget.id ? (str_index = "msg_3",
                div.stp4btn[5].style.opacity = 1,
                div.stp4info[2].style.opacity = 1,
                pc.events.fire("OnStepF", 2)) : "msg_4" === e.currentTarget.id ? (str_index = "msg_4",
                div.stp4btn[7].style.opacity = 1,
                div.stp4info[3].style.opacity = 1,
                pc.events.fire("OnStepF", 3)) : "msg_5" === e.currentTarget.id && (str_index = "msg_5",
                div.stp4btn[9].style.opacity = 1,
                div.stp4info[4].style.opacity = 1,
                pc.events.fire("OnStepF", 4))
        }
    },
    UieventControl.prototype.OnStepChange = function (e) {
        if (!(total_number < e)) {
            clearTimeout(timelineg),
                clearTimeout(timepoint),
                clearTimeout(timepoint);
            for (var t = 0; t < div.title.length; t++)
                div.title[t].style.opacity = e - 1 === t ? 1 : 0;
            if (1 !== e ? (div.stp2bg1.opacity = 0,
                    div.stp2bg2.display = "none",
                    div.stp2icon.opacity = 0) : (div.stp2bg1.opacity = 1,
                    div.stp2bg2.display = "block",
                    div.stp2icon.opacity = 1),
                2 !== e ? (div.stp3material.opacity = 0,
                    div.stp3msg.opacity = 0) : (div.stp3material.opacity = 1,
                    div.stp3msg.opacity = 1),
                3 !== e) {
                for (div.stp4bg.opacity = 0,
                    t = div.stp4msg.opacity = 0; t < div.stp4btn.length; t++)
                    div.stp4btn[t].style.display = "none";
                for (t = 0; t < div.stp4info.length; t++)
                    div.stp4info[t].style.opacity = 0;
                str_index = "msg_1"
            } else {
                for (div.stp4bg.opacity = 1,
                    div.stp4msg.opacity = 1,
                    t = 0; t < div.stp4btn.length; t++)
                    div.stp4btn[t].style.display = "block",
                    t % 2 != 0 && (div.stp4btn[t].style.opacity = 0);
                div.stp4btn[1].style.opacity = 1,
                    div.stp4info[0].style.opacity = 1
            }
            switch (4 !== e ? (div.stp5msg.opacity = 0,
                    div.stp5link.display = "none") : (div.stp5msg.opacity = 1,
                    div.stp5link.display = "block"),
                e) {
                case 0:
                    this.bl_First ? (this.bl_First = !1,
                        timelineg = setTimeout(function () {
                                div.timelinegold.width = "100%",
                                    div.timepoint.transform = "scale(1)",
                                    div.timeyear.opacity = 1,
                                    div.timenum.opacity = 1,
                                    div.how.opacity = 1
                            }
                            .bind(this), 1200),
                        timepoint = setTimeout(function () {
                                div.timelinegold.overflow = "unset",
                                    canclick = !0
                            }
                            .bind(this), 2200)) : (div.stp1.opacity = 1,
                        clearTimeout(timelineg),
                        clearTimeout(timepoint),
                        div.timelinegold.transition = "all 0.3s",
                        div.timepoint.transition = "all 0.3s",
                        div.timeyear.transition = "all 0.3s",
                        div.timenum.transition = "all 0.3s",
                        div.timeyear.opacity = 1,
                        div.timenum.opacity = 1,
                        div.timepoint.transform = "scale(1)",
                        div.timelinegold.width = "100%",
                        div.timelinegold.opacity = 1);
                    break;
                case 1:
                    mScroll.refresh(),
                        div.timelinegold.opacity = 0,
                        div.stp1.opacity = 0;
                    break;
                case 2:
                case 3:
                case 4:
                    div.timelinegold.opacity = 0,
                        div.stp1.opacity = 0
            }
        }
    },
    UieventControl.prototype._step4Init = function () {},
    UieventControl.prototype.changeStep = function (e) {
        if (canclick) {
            "rightBtn" === e.currentTarget.id ? current_number++ : current_number--,
                total_number < current_number ? current_number = 0 : current_number < 0 && (current_number = total_number),
                document.getElementsByClassName("iconActive")[0].className = "iconNormal";
            for (var t = 0; t < document.getElementsByClassName("iconNormal").length; t++)
                t === current_number && (document.getElementsByClassName("iconNormal")[current_number].className = "iconActive");
            pc.events.fire("StepChange", current_number)
        }
    };
var CircleRotate = pc.createScript("circleRotate");
CircleRotate.prototype.initialize = function () {
        this.AngleY = 0
    },
    CircleRotate.prototype.update = function (e) {
        this.AngleY += 1,
            this.entity.setEulerAngles(0, this.AngleY, 0)
    };

    /*
var ReplaceUrl = pc.createScript("replaceUrl");
ReplaceUrl.attributes.add("name", {
        type: "string"
    }),
    ReplaceUrl.prototype.initialize = function () {
        this._path = "";
        var t = this;
        $.get("./gjbz_share.json", function (e) {
                t._path = e[t.name]
            }),
            pc.events.on("replace:share", this._replace, this)
    },
    ReplaceUrl.prototype._replace = function () {
        isWeChat ? wx.miniProgram.navigateTo({
            url: "/pages/index/share?url=" + this._path
        }) : window.location.replace(this._path)
    };*/