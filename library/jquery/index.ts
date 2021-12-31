/* eslint @typescript-eslint/no-explicit-any: [off] */
(function fix(jquery: typeof jQuery) {
    jquery.event.special.touchstart = {
        setup: function (_, ns, handle) {
            this.addEventListener('touchstart', handle as any, {
                passive: !ns.includes('noPreventDefault')
            });
        }
    };
    jquery.event.special.touchmove = {
        setup: function (_, ns, handle) {
            this.addEventListener('touchmove', handle as any, {
                passive: !ns.includes('noPreventDefault')
            });
        }
    };
    jquery.event.special.wheel = {
        setup: function (_, ns, handle) {
            this.addEventListener('wheel', handle as any, {
                passive: true
            });
        }
    };
    jquery.event.special.mousewheel = {
        setup: function (_, ns, handle) {
            this.addEventListener('mousewheel', handle as any, {
                passive: true
            });
        }
    };
}(jQuery));
