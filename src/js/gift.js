/**
 * Created by fst on 6/8/17.
 */
var hbt,
    HBT = function (w) {
        this.lazyload = null;
        this.$w = $(window);
        this.$errorMsg = $('#error-message') || null;
        this.$giftForm = $('#free-gift-form') || null;
    };
HBT.prototype = {
    clearFormError: function () {
        this.$errorMsg.html('');
    },
    init: function () {
        var _this = this;
        this.$giftForm.on('submit', function (e) {
            _this.processGiftForm(e);
        });
    },
    resetGiftForm: function () {
        $('#full-name, #address-one, #address-two, #city, #zip, #email').val('');
        $('#us-states').val('---');
        this.updateFields();
    },
    sanitizedField: function (html) {
        var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*',
            tagOrComment = new RegExp(
                '<(?:' +
                '!--(?:(?:-*[^->])*--+|-?)' +
                '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*' +
                '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*' +
                '|/?[a-z]' +
                tagBody +
                ')>',
                'gi'),
            oldHtml;
        do {
            oldHtml = html;
            html = html.replace(tagOrComment, '');
        } while (html !== oldHtml);
        return html.replace(/</g, '&lt;');
    },
    trackEvent: function (evtCategory, evtAction, evtLabel) {
        try {
            ga('send', {
                hitType: 'event',
                eventCategory: evtCategory,
                eventAction: evtAction,
                eventLabel: evtLabel
            });
        } catch (e) {
            console.warn(e);
        }
    },
    processGiftForm: function (e) {
        var formData = {
            full_name: this.sanitizedField($('#full-name').val()),
            address_one: this.sanitizedField($('#address-one').val()),
            address_two: this.sanitizedField($('#address-two').val()),
            city: this.sanitizedField($('#city').val()),
            state: this.sanitizedField($('#us-states').val()),
            zip: this.sanitizedField($('#zip').val()),
            country: 'US',
            email: this.sanitizedField($('#email').val())
        };

        var url = $('form').data('target');

        $('body').addClass('inactive');

        this.clearFormError();

        $.post(url, formData, function (data) {
            if (data && data.status && data.status === 200) {
                // Success:
                hbt.$errorMsg.html('<p><strong>Your address has been received!</strong><br />Thank you, and keep an eye out for updates regarding The&nbsp;Hummingbird&nbsp;Tribe!</p>');
                hbt.trackEvent('Form Submit', 'click', 'Success');
                hbt.resetGiftForm();
            } else {
                // Error:
                hbt.$errorMsg.html('An error occurred. Please try again later.');
                console.warn(data);
                hbt.trackEvent('Form Submit', 'click', 'Form Error');
            }
            $('body').removeClass('inactive');
        }).fail(function(e){
            console.error(e);
            hbt.$errorMsg.html('<strong class="critical-error">An error occurred.</strong><br />Please try&nbsp;again&nbsp;later.');
            hbt.trackEvent('Form Submit', 'click', 'Form/Server Error');
            $('body').removeClass('inactive');
        });

        e.preventDefault();
        e.stopPropagation();
        void(0);
        return false;
    },
    updateFields: function () {

    }
};

$(document).ready(function () {
    hbt = window.hbt = new HBT(window);
    hbt.init();
});