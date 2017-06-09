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
        var sanitizeField = function (html) {
            var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
            var tagOrComment = new RegExp(
                '<(?:' +
                '!--(?:(?:-*[^->])*--+|-?)' +
                '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*' +
                '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*' +
                '|/?[a-z]' +
                tagBody +
                ')>',
                'gi');
            var oldHtml;
            do {
                oldHtml = html;
                html = html.replace(tagOrComment, '');
            } while (html !== oldHtml);
            return html.replace(/</g, '&lt;');
        }, validEmail = function (email) {
            var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return regEx.test(email);
        }, email = sanitizeField(this.$emailField.val());

        if (validEmail(email)) {
            // Submit the form:

            var url = "http://southernground.com/forms/the-hummingbird-tribe-sign-up.php";

            $('body').addClass('inactive');

            $.post(url, {
                email: email
            }, function (data) {
                if (data && data.status && data.status === 200) {
                    // Success:
                    console.log('Success! Thanks for signing up.');
                    $('body').removeClass('inactive');
                } else {
                    // Error:
                    console.log('An error occurred. Please try again later.');
                    console.warn(data);
                    $('body').removeClass('inactive');
                }
            });
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