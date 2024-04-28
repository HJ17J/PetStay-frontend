import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../../public/locales/en/translation.json";
import cnTranslation from "../../public/locales/cn/translation.json";
import koTranslation from "../../public/locales/ko/translation.json";

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
  fallbackLng: "ko", // 기본 언어 파일 찾기 실패시 대체 언어
  debug: true, // 문제 해결을 위해 디버그 모드 활성화
});

export default i18n;
