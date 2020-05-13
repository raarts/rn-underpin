import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import en from './en';
import nl from './nl';

i18n.translations = {
  en,
  nl,
};

i18n.locale = Localization.locale;
i18n.fallbacks = true;

export const _ = i18n.t;
export const { toCurrency } = i18n;
export default i18n;
