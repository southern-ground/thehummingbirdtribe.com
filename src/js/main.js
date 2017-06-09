/**
 * Created by fst on 6/8/17.
 */
var hbt,
    HBT = function (w) {
        this.lazyload = null;
        this.$w = $(window);
        this.$signUpForm = $('#sign-up');
        this.$emailField = $('#email');
        this.$errorMsg = $('#error-message');
    };
HBT.prototype = {
    init: function () {
        console.log('hbt');
        this.lazyload = new LazyLoad();
        this.$signUpForm.on('submit', function(e){
            hbt.$signUpForm.removeClass('form-error');
            hbt.$errorMsg.addClass('hidden');

            var validEmail = function (email) {
                var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return regEx.test(email);
            };

            if (validEmail(hbt.$emailField.val())) {
                // Submit the form:
                console.log('\tSubmit the form');
            } else {
                hbt.$signUpForm.addClass('form-error');
                hbt.$errorMsg.removeClass('hidden');
            }

            e.preventDefault();
            e.stopPropagation();
            void(0);
            return false;

        });
    },
    resize: function () {

    }
};
$(document).ready(function () {
    hbt = window.hbt = new HBT(window);
    hbt.init();
});