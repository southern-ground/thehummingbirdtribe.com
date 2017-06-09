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
    clearFormError: function () {
        this.$signUpForm.removeClass('form-error');
        this.$errorMsg.html('&nbsp;');
    },
    init: function () {
        var _this = this;
        this.lazyload = new LazyLoad();
        this.$signUpForm.on('submit', function (e) {
            _this.processForm(e);
        });
        this.$emailField.on('focus', function () {
            _this.clearFormError();
        });
    },
    processForm: function (e) {
        var validEmail = function (email) {
            var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return regEx.test(email);
        };
        if (validEmail(this.$emailField.val())) {
            // Submit the form:
            console.warn('Submit the form');
        } else {
            this.clearFormError();
            this.showFormError();
        }
        e.preventDefault();
        e.stopPropagation();
        void(0);
        return false;
    },
    showFormError: function () {
        this.$signUpForm.addClass('form-error');
        this.$errorMsg.html('Please enter a valid email address.');
    }
};
$(document).ready(function () {
    hbt = window.hbt = new HBT(window);
    hbt.init();
});