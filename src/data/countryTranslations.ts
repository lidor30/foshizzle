// Use localized-countries package for country name translations
import localizedCountriesFactory from "localized-countries";
import localizedCountriesEn from "localized-countries/data/en.json";
import localizedCountriesHe from "localized-countries/data/he.json";

// Create localized countries instances for each supported language
const localizedCountries = {
  en: localizedCountriesFactory(localizedCountriesEn),
  he: localizedCountriesFactory(localizedCountriesHe),
};

// Function to get country name in the current language
export const getCountryName = (
  countryCode: string,
  countryNameEn: string, // fallback if the country code is not found
  language: string
): string => {
  // Default to 'en' if language is not supported
  const lang = language === "he" ? "he" : "en";

  // Get the translated country name
  const translatedName = localizedCountries[lang].get(countryCode);

  // Return the translated name or fallback to English name
  return translatedName || countryNameEn;
};
