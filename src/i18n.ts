import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";
import es from "./locales/es.json";
import nl from "./locales/nl.json";
import de from "./locales/de.json";
import pl from "./locales/pl.json";
import tr from "./locales/tr.json";

// Standard initialization first
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            fr: { translation: fr },
            ar: { translation: ar },
            es: { translation: es },
            nl: { translation: nl },
            de: { translation: de },
            pl: { translation: pl },
            tr: { translation: tr },
        },
        fallbackLng: "fr",
        detection: {
            // Standard order: localStorage first, then navigator
            order: ["localStorage", "navigator"],
            lookupLocalStorage: "i18nextLng",
            caches: ["localStorage"],
        },
        interpolation: {
            escapeValue: false,
        },
    });

const updateDirection = (lang: string) => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.dir = dir;
    document.documentElement.lang = lang;
};

i18n.on("languageChanged", (lng) => {
    updateDirection(lng);
});

// Set initial direction
updateDirection(i18n.language || "fr");

// Async IP Detection Function
const detectIpLanguage = async () => {
    // Check if language is already set in localStorage
    const savedLang = localStorage.getItem("i18nextLng");
    if (savedLang) {
        console.log("Language already saved in localStorage:", savedLang);
        return;
    }

    // Skip IP detection on localhost to avoid CORS errors
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        console.log("Localhost detected, skipping IP lookup.");
        return;
    }

    try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const countryCode = data.country_code;

        const countryToLang: Record<string, string> = {
            GB: "en", US: "en", CA: "en", AU: "en",
            FR: "fr",
            PL: "pl",
            SA: "ar", AE: "ar", EG: "ar",
            ES: "es", MX: "es",
            NL: "nl", BE: "nl",
            DE: "de", AT: "de", CH: "de",
            TR: "tr",
        };

        const detectedLang = countryToLang[countryCode];
        if (detectedLang) {
            console.log(`Detected country: ${countryCode}, setting language to: ${detectedLang}`);
            i18n.changeLanguage(detectedLang);
        }
    } catch (error) {
        console.error("Failed to detect language via IP:", error);
    }
};

// Trigger detection asynchronously
detectIpLanguage();

export default i18n;
