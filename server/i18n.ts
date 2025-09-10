import i18next, { TFunction } from "i18next";
import en from "../client/locales/en.json";
import fr from "../client/locales/fr.json";
import de from "../client/locales/de.json";
import es from "../client/locales/es.json";

// Initialize a base i18n instance for the server
const i18n = i18next.createInstance();

void i18n.init({
  resources: {
    en: { translation: en as any },
    fr: { translation: fr as any },
    de: { translation: de as any },
    es: { translation: es as any },
  },
  fallbackLng: "en",
  supportedLngs: ["en", "fr", "de", "es"],
  interpolation: { escapeValue: false },
});

export function getRequestT(req: { headers?: Record<string, any> } | undefined): TFunction {
  const accept = req?.headers?.["accept-language"] as string | undefined;
  const queryLngMatch = typeof (req as any)?.query?.lng === "string" ? (req as any).query.lng : undefined;
  const headerLng = accept?.split(",")[0]?.trim();
  const lng = queryLngMatch || headerLng || "en";
  // Clone to avoid cross-request mutations
  const inst = i18n.cloneInstance({ initImmediate: false });
  inst.changeLanguage(lng);
  return inst.t.bind(inst);
}
