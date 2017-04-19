import { messages } from '../constants/i18n';
import IntlMessageFormat from 'intl-messageformat';
import { curry } from 'ramda';

export const getLocale = (): string => {
    return 'en-us';
};

interface IIntlMessageFormat {
    format: (params?: {}) => string;
}

declare var process: {
   env: {
       NODE_ENV: string
   }
};

const safeIntlMessage = (strings, key, locale): IIntlMessageFormat => {
    try {
        return new IntlMessageFormat(strings[key], locale);
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
            window.console.warn('Unable to find i18n string for', key);
        }

        return { format: (): string => '' };
    }
};

export const getString = (key): string => {
    const locale = getLocale();
    const strings = messages[locale];

    return safeIntlMessage(strings, key, locale).format();
};

export const getPhrase = curry((key, params): string => {
    const locale = getLocale();
    const strings = messages[locale];

    return safeIntlMessage(strings, key, locale).format(params);
});
