!function (t, e, a, i) {
    function s(e, a) {
        this.ele = e,
            this.obj = t(this.ele),
            this.uOpts = a,
            this.defaults = o,
            this.opts = t.extend({}, o, a),
            this.playlistSrc = [],
            this.playlist = [],
            this.buttonPrevious = !1,
            this.buttonNext = !0,
            this.playPauseBut = t('[data-attr="playPauseAudio"]'),
            this.nextBut = t('[data-attr="nextAudio"]'),
            this.prevBut = t('[data-attr="prevAudio"]'),
            this.volumeRange = t('input[data-attr="rangeVolume"]'),
            this.repeatAudio = t('[data-attr="repeatSong"]'),
            this.timer = t('[data-attr="timer"]'),
            this.seekTrack = t('[data-attr="seekableTrack"]'),
            this.shuffBut = t('[data-attr="shuffle"]'),
            this.pBar = t(this.opts.progress),
            this.playListObj = this.obj.children(this.opts.childElements),
            this.init()
    } var n = "audioControls", o = {
        autoPlay: !0,
        childElements: "li",
        timer: "decrement",
        progress: ".updateProgress",
        buffer: !0,
        shuffled: !0,
        audioVolume: .5,
        loopPlaylist: !0,
        onPlay: null,
        onPause: null,
        onVolumeChange: null,
        onAudioChange: null
    };
    s.prototype = {
        init: function () {
            var e = this;
            return this.playlistSrc = this.getPlaylist(),
                this.playlist ? (
                    this.playlist = this.playlistSrc.slice(0),
                    this.listLen = this.playlist.length,
                    this.shuffBut.attr("data-state", this.opts.shuffled).toggleClass(
                        function () {
                            return e.getShuffleStatus() ? "shuffleActive" : "shuffle"
                        }
                    ),
                    this._player = t("<audio />").data("audIndex", 0),
                    this._audio = this._player.get(0),
                    void this.create()
                ) : !1
        },
        create: function () {
            this.opts.autoPlay && this._player.attr("autoplay", !0),
                this.opts.buffer && this._player.attr("preload", "auto"),
                this._audio.volume = this.volumeRange.val() || this.opts.audioVolume,
                this.shuffleState(),
                this.source(),
                0 == t("audio").length && t("body").append(this._player),
                this.getIndex() <= 0 && (this.buttonPrevious = !1, this.prevBut.addClass("disabled")),
                this.attachEvents()
        },
        shuffleState: function () {
            var t = this.getShuffleStatus();
            this.playlist = t ? this.shuffle() : this.playlistSrc
        },
        getPlaylist: function () {
            var e = this.playListObj.get(),
                a = new Array;
            return e.length <= 0 ? !1 : (t.each(e, function (e, i) { a[e] = t(i).attr("data-src") }), a)
        },
        getIndex: function () {
            var t = this._player.data("audIndex"); return parseInt(t)
        }, getAudioTimeDecrement: function (t, e) {
            var a, i, e = parseInt(e), s = parseInt(t), n = e - s;
            return a = n % 60,
                i = Math.floor(n / 60) % 60, a = 10 > a ? "0" + a : a,
                i = 10 > i ? "0" + i : i, i + ":" + a
        },
        getAudioTimeIncrement: function (t) {
            var e = parseInt(t), a = parseInt(e % 60),
                i = parseInt(e / 60 % 60); return timer = 10 > a ? i + ":0" + a : i + ":" + a, timer
        },
        shuffle: function () {
            var t = this.playlist.slice(0);
            if (this.arrayindex = [], t.length > 0)
                for (var e, a, i = t.length; 0 !== i;)
                    a = Math.floor(Math.random() * i),
                        i -= 1,
                        e = t[i],
                        t[i] = t[a],
                        t[a] = e;
            return t
        },
        getShuffleStatus: function () {
            return this.opts.shuffled ? !0 : "true" == this.shuffBut.attr("data-state") ? !0 : !1
        },
        source: function (e, a) {
            e = e != i ? e : this.getIndex();
            var s = t("<source />"),
                n = this.playlist[e];
            this._player.attr({
                src: n, type: this.getDataType(this.playlist[e])
            }),
                this._player.data("audIndex", e), this._player.html(s), this.onSongChange(e), a != i && 1 == a && this.play()
        },

        onSongChange: function (t) {
            var e = this.updateActiveSong(t);
            this.updatePrevNextButtons(); {
                var a = {
                    index: e,
                    title: this.playListObj.eq(e).attr("data-title"),
                    autor: this.playListObj.eq(e).attr("data-autor"),
                    src: this.playListObj.eq(e).attr("data-src"),
                    image: this.playListObj.eq(e).attr("data-image"),
                    ele: this.playListObj.eq(e)
                };

                // this.playListObj.eq(e).find("a").text() 
            }




            "function" == typeof this.opts.onAudioChange && this.opts.onAudioChange.apply(this, [a])
        }, getDataType: function (t) { var e = /[^\\]*\.(\w+)$/, a = t.match(e); return a = a[1], "ogg" == a ? "audio/ogg" : "wav" == a ? "audio/wav" : "audio/mpeg" },
        updateActiveSong: function (t) {
            var e = this.playlistSrc.indexOf(this.playlist[t]);
            return this.playListObj.removeClass("activeAudio"),
                this.playListObj.eq(e).addClass("activeAudio"),
                e
        },
        updatePrevNextButtons: function () {
            this.getIndex() > 0 ? (this.buttonPrevious = !0, this.prevBut.removeClass("disabled")) : (this.buttonPrevious = !1, this.prevBut.addClass("disabled")),
                this.getIndex() < this.listLen - 1 ? (this.buttonNext = !0, this.nextBut.removeClass("disabled")) : (this.buttonNext = !1, this.nextBut.addClass("disabled"))
        }, attachEvents: function () {
            var e = this;

            this.shuffBut.on("click", function () {
                var a = t(this);
                "false" == a.attr("data-state") ? (a.attr("data-state", "true").toggleClass("shuffle shuffleActive"), e.shuffled = !0) : (a.attr("data-state", "false").toggleClass("shuffleActive shuffle"), e.shuffled = !1),
                    e.shuffleState()
            }),
                this.playPauseBut.on("click", function () {
                    e._audio.paused ? e.play() : e.pause()
                }),
                t(this._audio).on("play", function () {
                    e.playPauseBut.removeClass("pauseAudio").addClass("playAudio"),
                        "function" == typeof e.opts.onPlay && e.opts.onPlay.apply(this, [e.playPauseBut])
                }).on("pause", function () { e.playPauseBut.removeClass("playAudio").addClass("pauseAudio"), "function" == typeof e.opts.onPause && e.opts.onPause.apply(this, [e.playPauseBut]) }),
                this.nextBut.on("click", function () { return e.buttonNext ? (index = e.getIndex() + 1, void e.source(index, !0)) : !1 }), this.prevBut.on("click", function () { return e.buttonPrevious ? (index = e.getIndex() - 1, void e.source(index, !0)) : !1 }), this.playListObj.on("click", function (a) { a.preventDefault(), e.source(e.playlist.indexOf(t(this).attr("data-src")), !0) }),
                this._player.bind("ended", function () {
                    if (nextIndex = e.getIndex() + 1, e.seekTrack.css("width", "0%"), e.listLen != nextIndex) e.source(nextIndex, !0);
                    else {
                        if (!e.opts.loopPlaylist) return !1;
                        this.shuffleState(), e.source(0, !0)
                    }
                }),
                t(".progress").on("click", function (a) {
                    a.preventDefault(); var i = t(this).width(), s = a.clientX / i * 100;
                    e._audio.currentTime = s / 100 * e._audio.duration
                }),
                t(this._audio).bind("timeupdate", function () {
                    e.timer.text("decrement" == e.opts.timer ? e.getAudioTimeDecrement(e._audio.currentTime, e._audio.duration) : e.getAudioTimeIncrement(e._audio.currentTime));
                    var a = e._audio.currentTime / e._audio.duration * 100;
                    t(e.opts.progress).css("width", a + "%")
                }),
                t(this._audio).bind("durationchange progress", function () { var t = 100 / (this.duration || 1) * (this.seekable && this.seekable.length ? this.seekable.end(0) : 0) + "%"; e.seekTrack.css("width", t) }), this.volumeRange.on("change", function (a) { a.preventDefault(); var i = t(this).val(); volInPercent = 100 * i, "function" == typeof e.opts.onVolumeChange && e.opts.onVolumeChange.apply(e, [volInPercent]), e._audio.volume = i }), this.repeatAudio.on("click", function () { t(this).data("data-loop") || t(this).data("data-loop", "false"); var a = t(this).data("data-loop"); "false" == a ? (t(this).addClass("loopActive").data("data-loop", "true"), e._player.attr("loop", !0)) : (t(this).removeClass("loopActive").data("data-loop", "false"), e._player.attr("loop", !1)) })
        }, play: function () { this._audio.play() }, pause: function () { this._audio.pause() }
    }, t.fn[n] = function (e) {
        return this.each(function () {
            t.data(this, "plugin_" + n) || t.data(this, "plugin_" + n, new s(this, e))
        })
    }
}(jQuery, window, document);