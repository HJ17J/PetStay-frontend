import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../locales/en/translation.json";
import cnTranslation from "../locales/cn/translation.json";
import { default as koTranslation } from "../locales/ko/translation.json";

const resources = {
  en: { translation: enTranslation },
  cn: { translation: cnTranslation },
  ko: { translation: koTranslation },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ko",
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: "ko",
  debug: true,
});

export default i18n;
