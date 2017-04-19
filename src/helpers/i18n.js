"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var i18n_1 = require("../constants/i18n");
var intl_messageformat_1 = require("intl-messageformat");
var ramda_1 = require("ramda");
exports.getLocale = function () {
    return 'en-us';
};
var safeIntlMessage = function (strings, key, locale) {
    try {
        return new intl_messageformat_1.default(strings[key], locale);
    }
    catch (e) {
        if (process.env.NODE_ENV !== 'production') {
            window.console.warn('Unable to find i18n string for', key);
        }
        return { format: function () { return ''; } };
    }
};
exports.getString = function (key) {
    var locale = exports.getLocale();
    var strings = i18n_1.messages[locale];
    return safeIntlMessage(strings, key, locale).format();
};
exports.getPhrase = ramda_1.curry(function (key, params) {
    var locale = exports.getLocale();
    var strings = i18n_1.messages[locale];
    return safeIntlMessage(strings, key, locale).format(params);
});
