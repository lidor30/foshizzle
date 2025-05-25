import localizedCountriesLib from 'localized-countries'
import 'server-only'

// Type assertions to handle the untyped module
type LocalizedCountry = {
  get: (countryCode: string) => string | undefined
}

const localizedCountries: Record<string, LocalizedCountry> = {
  en: localizedCountriesLib('en'),
  he: localizedCountriesLib('he')
}

// Function to get country name in the current language
export const getCountryName = (
  countryCode: string,
  countryNameEn: string, // fallback if the country code is not found
  language: string
): string => {
  // Default to 'en' if language is not supported
  const lang = language === 'he' ? 'he' : 'en'

  // Get the translated country name
  const translatedName = localizedCountries[lang].get(countryCode)

  // Return the translated name or fallback to English name
  return translatedName || countryNameEn
}
