import { getCountryName } from "./countryTranslations";
import type {
  DifficultyLevel,
  FlashcardItem,
  MultipleChoiceFlashcardItem,
} from "./topics";

export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  cca3: string;
  region: string;
  subregion?: string;
}

// We'll dynamically fetch the countries data using the world-countries package
// This will hold the country data once loaded
let countries: Country[] = [];

// Helper function to get random countries for multiple choice questions
export const getRandomCountries = (
  count: number,
  excludeCountryCodes: string[]
): Country[] => {
  const availableCountries = countries.filter(
    (country) => !excludeCountryCodes.includes(country.cca2)
  );

  const result: Country[] = [];
  const shuffled = [...availableCountries].sort(() => Math.random() - 0.5);

  for (let i = 0; i < shuffled.length && result.length < count; i++) {
    result.push(shuffled[i]);
  }

  return result;
};

// Generate flag URL from country code
export const getFlagUrl = (countryCode: string): string => {
  return `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;
};

// Function to load countries data
export const loadCountriesData = async (): Promise<Country[]> => {
  if (countries.length > 0) {
    return countries;
  }

  try {
    const countriesModule = await import("world-countries");
    countries = countriesModule.default as Country[];
    return countries;
  } catch (error) {
    console.error("Failed to load countries data:", error);
    return [];
  }
};

// Generate flashcards for flags with language-specific country names
export const generateFlagsFlashcards = async (): Promise<FlashcardItem[]> => {
  // Get current language from i18next
  const currentLanguage = localStorage.getItem("i18nextLng") || "en";

  const countriesData = await loadCountriesData();
  if (countriesData.length === 0) return [];

  // Filter and limit countries to keep the set manageable
  // We'll use a mix of easy, medium and hard countries for variety
  const easyCountryCodes = [
    "US",
    "GB",
    "FR",
    "DE",
    "IT",
    "ES",
    "JP",
    "CN",
    "RU",
    "BR",
    "CA",
    "AU",
    "IN",
    "MX",
    "ZA",
  ];

  // Start with all easy countries
  const easyCountries = countriesData.filter((country) =>
    easyCountryCodes.includes(country.cca2)
  );

  // Add some medium difficulty (European & Americas) countries
  const mediumCountries = countriesData
    .filter(
      (country) =>
        (country.region === "Europe" || country.region === "Americas") &&
        !easyCountryCodes.includes(country.cca2)
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, 15); // Take 15 random medium difficulty countries

  // Add some hard difficulty countries
  const hardCountries = countriesData
    .filter(
      (country) =>
        country.region !== "Europe" &&
        country.region !== "Americas" &&
        !easyCountryCodes.includes(country.cca2)
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, 10); // Take 10 random hard difficulty countries

  // Combine all filtered countries
  const selectedCountries = [
    ...easyCountries,
    ...mediumCountries,
    ...hardCountries,
  ];

  return selectedCountries.map((country) => {
    // Get 3 random countries for wrong options
    const randomCountries = getRandomCountries(3, [country.cca2]);

    // Get translated country names based on the current UI language
    const translatedCountryName = getCountryName(
      country.cca2,
      country.name.common,
      currentLanguage
    );

    // Translate the options as well
    const translatedOptions = [
      translatedCountryName, // Correct answer (translated)
      ...randomCountries.map((c) =>
        getCountryName(c.cca2, c.name.common, currentLanguage)
      ),
    ].sort(() => Math.random() - 0.5); // Shuffle

    // Get the question text in the appropriate language
    const questionText =
      currentLanguage === "he"
        ? "לאיזו מדינה שייך דגל זה?"
        : "Which country does this flag belong to?";

    return {
      id: `flag-${country.cca2}`,
      question: questionText,
      answer: translatedCountryName, // Translated country name as the answer
      difficulty: getDifficultyForCountry(country),
      type: "multiple_choice",
      options: translatedOptions,
      metadata: {
        countryCode: country.cca2,
        flagUrl: getFlagUrl(country.cca2),
      },
    } as MultipleChoiceFlashcardItem;
  });
};

// Assign difficulty based on region/subregion or other criteria
const getDifficultyForCountry = (country: Country): DifficultyLevel => {
  // Popular or well-known countries are easier
  const easyCountries = [
    "US",
    "GB",
    "FR",
    "DE",
    "IT",
    "ES",
    "JP",
    "CN",
    "RU",
    "BR",
    "CA",
    "AU",
    "IN",
    "MX",
    "ZA",
  ];

  if (easyCountries.includes(country.cca2)) {
    return "easy";
  }

  // European and larger countries are medium difficulty
  if (
    country.region === "Europe" ||
    country.region === "Americas" ||
    country.region === "Asia"
  ) {
    return "medium";
  }

  // Others are hard
  return "hard";
};
