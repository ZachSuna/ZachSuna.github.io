/*global window, document*/
(function (exports) {
    'use strict';

    var extend, createElements, createCountdownElt, simplyCountdown;

    extend = function (out) {
        var i, obj, key;
        out = out || {};

        for (i = 1; i < arguments.length; i++) {
            obj = arguments[i];

            if (obj) {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object') {
                            out[key] = extend(out[key], obj[key]);
                        } else {
                            out[key] = obj[key];
                        }
                    }
                }
            }
        }

        return out;
    };

    createCountdownElt = function (countdown, parameters, typeClass) {
        var sectionTag = document.createElement('div'),
            amountTag = document.createElement('span'),
            wordTag = document.createElement('span'),
            innerSectionTag = document.createElement('div');

        innerSectionTag.appendChild(amountTag);
        innerSectionTag.appendChild(wordTag);
        sectionTag.appendChild(innerSectionTag);

        sectionTag.classList.add(parameters.sectionClass);
        sectionTag.classList.add(typeClass);
        amountTag.classList.add(parameters.amountClass);
        wordTag.classList.add(parameters.wordClass);

        countdown.appendChild(sectionTag);

        return {
            full: sectionTag,
            amount: amountTag,
            word: wordTag
        };
    };

    createElements = function (parameters, countdown) {
        var spanTag;

        if (!parameters.inline) {
            return {
                days: createCountdownElt(countdown, parameters, 'simply-days-section'),
                hours: createCountdownElt(countdown, parameters, 'simply-hours-section'),
                minutes: createCountdownElt(countdown, parameters, 'simply-minutes-section'),
                seconds: createCountdownElt(countdown, parameters, 'simply-seconds-section')
            };
        }

        spanTag = document.createElement('span');
        spanTag.classList.add(parameters.inlineClass);
        return spanTag;
    };

    simplyCountdown = function (elt, args) {
        var parameters = extend({
                year: 2024,
                month: 12,
                day: 25,
                hours: 0,
                minutes: 0,
                seconds: 0,
                words: {
                    days: 'Hari',
                    hours: 'Jam',
                    minutes: 'Menit',
                    seconds: 'Detik',
                    pluralLetter: ''
                },
                plural: true,
                inline: false,
                enableUtc: false,
                onEnd: function () {
                    console.log('Countdown selesai!');
                },
                refresh: 1000,
                inlineClass: 'simply-countdown-inline',
                sectionClass: 'simply-section',
                amountClass: 'simply-amount',
                wordClass: 'simply-word',
                zeroPad: false
            }, args),
            interval,
            targetDate,
            cd = document.querySelectorAll(elt);

        targetDate = new Date(
            parameters.year,
            parameters.month - 1,
            parameters.day,
            parameters.hours,
            parameters.minutes,
            parameters.seconds
        );

        console.log('Target date:', targetDate.toString());
        console.log('Current date:', new Date().toString());

        Array.prototype.forEach.call(cd, function (countdown) {
            var fullCountDown = createElements(parameters, countdown),
                refresh;

            refresh = function () {
                var now = new Date();
                var timeLeft = targetDate - now;
                
                var days, hours, minutes, seconds;
                
                if (timeLeft <= 0) {
                    days = hours = minutes = seconds = 0;
                    window.clearInterval(interval);
                    parameters.onEnd();
                } else {
                    days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                    hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                    seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                }

                var dayWord = days > 1 ? parameters.words.days + parameters.words.pluralLetter : parameters.words.days;
                var hourWord = hours > 1 ? parameters.words.hours + parameters.words.pluralLetter : parameters.words.hours;
                var minuteWord = minutes > 1 ? parameters.words.minutes + parameters.words.pluralLetter : parameters.words.minutes;
                var secondWord = seconds > 1 ? parameters.words.seconds + parameters.words.pluralLetter : parameters.words.seconds;

                if (parameters.inline) {
                    countdown.textContent = `${days} ${dayWord}, ${hours} ${hourWord}, ${minutes} ${minuteWord}, ${seconds} ${secondWord}`;
                } else {
                    fullCountDown.days.amount.textContent = parameters.zeroPad && days < 10 ? '0' + days : days;
                    fullCountDown.days.word.textContent = dayWord;

                    fullCountDown.hours.amount.textContent = parameters.zeroPad && hours < 10 ? '0' + hours : hours;
                    fullCountDown.hours.word.textContent = hourWord;

                    fullCountDown.minutes.amount.textContent = parameters.zeroPad && minutes < 10 ? '0' + minutes : minutes;
                    fullCountDown.minutes.word.textContent = minuteWord;

                    fullCountDown.seconds.amount.textContent = parameters.zeroPad && seconds < 10 ? '0' + seconds : seconds;
                    fullCountDown.seconds.word.textContent = secondWord;
                }
            };

            refresh();
            interval = window.setInterval(refresh, parameters.refresh);
        });
    };

    exports.simplyCountdown = simplyCountdown;

    // Langsung jalankan countdown saat script dimuat
    document.addEventListener('DOMContentLoaded', function() {
        simplyCountdown('#timer', {
            year: 2024,    // Tahun target
            month: 12,     // Bulan target (1-12)
            day: 25,       // Tanggal target
            hours: 0,      // Jam target (0-23)
            minutes: 0,    // Menit target (0-59)
            seconds: 0     // Detik target (0-59)
        });
    });

}(window));