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
    resetGiftForm: function(){
        $('#full-name, #address-one, #address-two, #city, #zip, #email, #state-providence').val('');
        $('#country-select').val('US');
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
    validEmail: function (email) {
        var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return regEx.test(email);
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
        var isUS = $('#country-select').val() === 'US';
        var formData = {
            full_name: this.sanitizedField($('#full-name').val()),
            address_one: this.sanitizedField($('#address-one').val()),
            address_two: this.sanitizedField($('#address-two').val()),
            city: this.sanitizedField($('#city').val()),
            state: this.sanitizedField(isUS ? $('#us-states').val() : $('#state-providence').val()),
            zip: this.sanitizedField($('#zip').val()),
            country: isUS ? 'US' : this.sanitizedField($('#other-country').val()),
            email: this.sanitizedField($('#email').val())
        };
        var url = $('form').data('target');

        $('body').addClass('inactive');

        this.clearFormError();

        $.post(url, formData, function (data) {
            if (data && data.status && data.status === 200) {
                // Success:
                hbt.$errorMsg.html('<p><strong>Thank you</strong> for your request up and keep an eye out for updates regarding The&nbsp;Hummingbird&nbsp;Tribe!</p>');
                $('body').removeClass('inactive');
                hbt.trackEvent('Form Submit', 'click', 'Success');
                hbt.resetGiftForm();
            } else {
                // Error:
                hbt.$errorMsg.html('An error occurred. Please try again later.');
                console.warn(data);
                $('body').removeClass('inactive');
                hbt.trackEvent('Form Submit', 'click', 'Form Error');
            }
        });

        e.preventDefault();
        e.stopPropagation();
        void(0);
        return false;
    },
    updateFields: function () {
        if (document.getElementById('country-select').value !== 'US') {
            document.getElementById('other-country').classList.remove('hidden');
            document.getElementById('us-states').classList.add('hidden');
            document.getElementById('state-providence').classList.remove('hidden');
            document.getElementById('zip').placeholder = "Post Code";
            document.getElementById('zip').setAttribute('type', 'text');
        } else {
            document.getElementById('other-country').classList.add('hidden');
            document.getElementById('us-states').classList.remove('hidden');
            document.getElementById('state-providence').classList.add('hidden');
            document.getElementById('zip').placeholder = "Zip";
            document.getElementById('zip').setAttribute('type', 'number');
        }
    }
};

$(document).ready(function () {
    hbt = window.hbt = new HBT(window);
    hbt.init();
});