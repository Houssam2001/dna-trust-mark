import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import pl from "./locales/pl.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";
import es from "./locales/es.json";
import nl from "./locales/nl.json";
import de from "./locales/de.json";
import tr from "./locales/tr.json";

// RTL Language support
const rtlLanguages = ["ar"];

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            pl: { translation: pl },
            fr: { translation: fr },
            ar: { translation: ar },
            es: { translation: es },
            nl: { translation: nl },
            de: { translation: de },
            tr: { translation: tr },
        },
        lng: "fr", // Default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

i18n.on('languageChanged', (lng) => {
    document.dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

export default i18n;
