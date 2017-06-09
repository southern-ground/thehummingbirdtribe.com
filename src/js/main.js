/**
 * Created by fst on 6/8/17.
 */
var hbt,
    HBT = function (w) {
        this.lazyload = null;
        this.$w = $(window);
    };
HBT.prototype = {
    init: function () {
        console.log('hbt');
        this.lazyload = new LazyLoad();
        this.$w.on('resize', function () {
            hbt.resize();
        });
        this.resize();
    },
    resize: function () {
        console.log('hbt::resize', window.devicePixelRatio);
        console.log(this.$w.innerWidth() + ' x ' + this.$w.innerHeight());

        /*var win = {
            w: this.$w.innerWidth(),
            h: this.$w.innerHeight()
        }

        if (win.w < 1024) {
            var scalar = 1 - (win.w - 400) / 624,
                css = {
                    'left': 1-scalar*83,
                    'top': 1-scalar*44
                };

            console.log(css);

            $('.branch--upperLeft').css(css);
        }*/
    }
};
$(document).ready(function () {
    hbt = window.hbt = new HBT(window);
    hbt.init();
});