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
        this.countDown = new CountDown(new Date(), $('#DaysRemaining'));
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

var CountDown = function(now,$el){
    this.now = now;
    this.$el = $el;
    this.christmas = this.nextChristmas(new Date(this.now.getTime()));
    this.daysRemaining = this.getDaysRemaining(this.now, this.christmas);
    this.updateInterval = 15000;
    this.interval = null;
    this.init();

};
CountDown.prototype = {
    getDaysRemaining: function(now,then){
        return Math.ceil(this.daysDifference(now,then));
    },
    init: function(){
        var scope = this;
        this.interval = setInterval(function(){
            scope.updateCounter();
        }, this.updateInterval);
        this.updateCounter();
    },
    nextChristmas: function(now) {
        if (now.getMonth() === 11) {
            if (now.getDate() > 25) {
                now.setFullYear(now.getFullYear() + 1);
            }
        }
        now.setMonth(11);
        now.setDate(25);
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(1);

        return now;
    },
    daysDifference: function(now, then){
        var days = function(n){
            return n / 1000 / 60 / 60 / 24;
        };
        return days(then - now);
    },
    updateCounter: function(){
        this.now = new Date();
        this.daysRemaining = this.getDaysRemaining(this.now,this.christmas);
        this.$el.html(this.daysRemaining);
    }
};

$(document).ready(function () {
    hbt = window.hbt = new HBT(window);
    hbt.init();
});