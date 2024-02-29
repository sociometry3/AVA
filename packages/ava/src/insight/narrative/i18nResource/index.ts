import { Language } from '../../types';

import en from './en-US.json';
import cn from './zh-CN.json';

export const i18n = {
  'en-US': en,
  'zh-CN': cn,
};

export const setI18nResource = (lang: Language, res: Partial<typeof cn>) => {
  i18n[lang] = {
    ...i18n[i18n[lang] ? lang : 'en-US'],
    ...res,
  };
};
