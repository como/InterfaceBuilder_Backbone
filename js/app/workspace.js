window.resbook = {};
(function (rb) {
    var d = document,
        w = window,
        url = d.URL,
        title = d.title,
        wrapper = null,
        devices = null,
        close = null,
        keyboard = null,
        refreshBtn = null,
        body = null,
        size = null,
        auto = true,
        isResized = false,
        isAnimated = false,
        sizes = {
            smartphonePortrait: [320, 480],
            smartphoneLandscape: [480, 320],
            tabletPortrait: [1024, 768],
            tabletLandscape: [768, 1024],
            auto: 'auto'
        }, refreshCss = function (disable) {
        }, resize = function (w, h, f) {
            w = w || wrapper.clientWidth;
            h = h || wrapper.clientHeight;
            size.innerHTML = w + 'x' + h
        }, setPosition = function (wh, t, cl) {
            var width = (wh == 'auto') ? w.innerWidth : wh[0],
                height = (wh == 'auto') ? w.innerHeight : wh[1],
                style = 'width:' + width + 'px;height:' + height + 'px;margin-top:20px;';
            if (typeof (width) == 'undefined' || typeof (height) == 'undefined') return false;
            style += (wh === 'auto') ? 'margin-top:0;' : '';
            wrapper.setAttribute('style', style);
            wrapper.setAttribute('data-device', cl);
            body.setAttribute('style', 'min-height:' + height + 'px;min-width:' + width + 'px;');
            resize(width, height);
            if (wh === 'auto' && !t) {
                isResized = false;
                setTimeout(function () {
                    wrapper.setAttribute('style', '');
                    body.setAttribute('style', '');
                    isAnimated = false
                }, 260)
            } else {
                isAnimated = false
            }
        }, readyElement = function (id, callback) {
            var interval = setInterval(function () {
                if (d.getElementById(id)) {
                    callback(d.getElementById(id));
                    clearInterval(interval)
                }
            }, 60)
        };
    rb.changeUrl = function (u, t) {
        d.title = t + ' - Responsive';
        if (history.pushState) {
            try {
                history.pushState({}, "New Page", u)
            } catch (e) {}
        }
        if (refreshBtn.classList.contains('active')) {
            refreshCss()
        } else {
            refreshCss(true)
        }
    };
    readyElement('wrapper', function () {
        wrapper = d.getElementById('wrapper');
        devices = d.getElementById('devices');
        size = d.getElementById('size');
        close = d.querySelector('.close a');
        keyboard = d.querySelector('.keyboard a');
        refreshBtn = d.querySelector('.cssrefresh a');
        body = d.querySelector('body');
        if (window.chrome || (window.getComputedStyle && !window.globalStorage && !window.opera)) {}
        if (w.location.protocol !== 'http:') {
            refreshBtn.setAttribute('style', 'display:none')
        }[].forEach.call(document.querySelectorAll('#devices a'), function (el) {
            el.addEventListener('click', function (e) {
                [].forEach.call(document.querySelectorAll('#devices a'), function (el) {
                    el.classList.remove('active')
                });
                e.preventDefault();
                e.stopPropagation();
                var self = this;
                if ((self.classList.contains('auto') && isResized === false) || isAnimated === true) return false;
                isAnimated = true;
                if (isResized === false) {
                    isResized = true;
                    setPosition(sizes.auto, true)
                }
                setTimeout(function () {
                    self.classList.add('active');
                    if (self.classList.contains('smartphone-portrait')) {
                        setPosition(sizes.smartphonePortrait, false, 'smartphonePortrait')
                    } else if (self.classList.contains('smartphone-landscape')) {
                        setPosition(sizes.smartphoneLandscape, false, 'smartphoneLandscape')
                    } else if (self.classList.contains('tablet-portrait')) {
                        setPosition(sizes.tabletPortrait, false, 'tabletPortrait')
                    } else if (self.classList.contains('tablet-landscape')) {
                        setPosition(sizes.tabletLandscape, false, 'tabletLandscape')
                    } else if (self.classList.contains('auto')) {
                        setPosition(sizes.auto, false, 'auto')
                    }
                }, 10)
            })
        });
        close.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            w.location = d.URL
        }, false);
        keyboard.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            keyboard.classList.toggle('active');
            wrapper.classList.toggle('keyboard')
        }, false);
        refreshBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            refreshBtn.classList.toggle('active');
            if (refreshBtn.classList.contains('active')) {
                refreshCss()
            } else {
                refreshCss(true)
            }
        }, false);
        w.addEventListener('resize', function () {
            resize()
        }, false);
        w.addEventListener('keyup', function (e) {
            var key = e.keyCode ? e.keyCode : e.charCode,
                keys = {
                    49: 'tabletPortrait',
                    50: 'tabletLandscape',
                    51: 'smartphonePortrait',
                    52: 'smartphoneLandscape',
                    53: 'auto'
                };
            if (typeof (keys[key]) == 'undefined') return false;
            setPosition(sizes[keys[key]], false, keys[key])
        }, false);
        resize();
        size.style.minWidth = 0
    })
})(resbook);