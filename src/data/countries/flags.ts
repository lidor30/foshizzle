import type {
  DifficultyLevel,
  FlashcardItem,
  MultipleChoiceQuestionItem
} from '@/types/questions';
import { Locale } from 'next-intl';
import 'server-only';
import * as countriesModule from 'world-countries';
import { getCountryName } from './countryTranslations';

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
    countries = countriesModule.default as Country[];
    return countries;
  } catch (error) {
    console.error('Failed to load countries data:', error);
    return [];
  }
};

// Generate flashcards for flags with language-specific country names
export const generateFlagsFlashcards = async ({
  locale
}: {
  locale: Locale;
}): Promise<FlashcardItem[]> => {
  const countriesData = await loadCountriesData();
  if (countriesData.length === 0) return [];

  // Filter and limit countries to keep the set manageable
  // We'll use a mix of easy, medium and hard countries for variety
  const easyCountryCodes = [
    'US',
    'GB',
    'FR',
    'DE',
    'IT',
    'ES',
    'JP',
    'CN',
    'RU',
    'BR',
    'CA',
    'AU',
    'IN',
    'MX',
    'ZA'
  ];

  // Start with all easy countries
  const easyCountries = countriesData.filter((country) =>
    easyCountryCodes.includes(country.cca2)
  );

  // Add some medium difficulty (European & Americas) countries
  const mediumCountries = countriesData
    .filter(
      (country) =>
        (country.region === 'Europe' || country.region === 'Americas') &&
        !easyCountryCodes.includes(country.cca2)
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, 15); // Take 15 random medium difficulty countries

  // Add some hard difficulty countries
  const hardCountries = countriesData
    .filter(
      (country) =>
        country.region !== 'Europe' &&
        country.region !== 'Americas' &&
        !easyCountryCodes.includes(country.cca2)
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, 10); // Take 10 random hard difficulty countries

  // Combine all filtered countries
  const selectedCountries = [
    ...easyCountries,
    ...mediumCountries,
    ...hardCountries
  ];

  // Generate both types of flag questions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const identifyCountryQuestions = generateIdentifyCountryQuestions(
    selectedCountries,
    locale
  );
  const identifyFlagQuestions = generateIdentifyFlagQuestions(
    selectedCountries,
    locale
  );

  // Combine both types of questions
  // return [...identifyCountryQuestions, ...identifyFlagQuestions];
  return identifyFlagQuestions;
};

// Generate questions where users need to identify the country from a flag
const generateIdentifyCountryQuestions = (
  selectedCountries: Country[],
  locale: string
): FlashcardItem[] => {
  return selectedCountries.map((country) => {
    // Get 3 random countries for wrong options
    const randomCountries = getRandomCountries(3, [country.cca2]);

    // Get translated country names based on the current UI language
    const translatedCountryName = getCountryName(
      country.cca2,
      country.name.common,
      locale
    );

    // Translate the options as well
    const translatedOptions = [
      { text: translatedCountryName }, // Correct answer (translated)
      ...randomCountries.map((c) => ({
        text: getCountryName(c.cca2, c.name.common, locale)
      }))
    ].sort(() => Math.random() - 0.5); // Shuffle

    // Get the question text in the appropriate language
    const questionText =
      locale === 'he'
        ? 'לאיזו מדינה שייך הדגל הזה?'
        : 'Which country does this flag belong to?';

    const flagUrl = getFlagUrl(country.cca2);

    return {
      id: `flag-country-${country.cca2}`,
      question: {
        text: questionText,
        image: flagUrl
      },
      answer: {
        text: translatedCountryName
      },
      difficulty: getDifficultyForCountry(country),
      type: 'multiple_choice',
      options: translatedOptions,
      metadata: {
        countryCode: country.cca2
      },
      autoReadQuestion: true
    } as MultipleChoiceQuestionItem;
  });
};

// Generate questions where users need to identify the flag from a country name
const generateIdentifyFlagQuestions = (
  selectedCountries: Country[],
  locale: Locale
): FlashcardItem[] => {
  return selectedCountries.map((country) => {
    // Get 3 random countries for wrong options
    const randomCountries = getRandomCountries(3, [country.cca2]);

    // Get translated country name based on the current UI language
    const translatedCountryName = getCountryName(
      country.cca2,
      country.name.common,
      locale
    );

    // Create options with flag images
    const flagOptions = [
      {
        text: '',
        image: getFlagUrl(country.cca2)
      },
      ...randomCountries.map((c) => ({
        text: '',
        image: getFlagUrl(c.cca2)
      }))
    ].sort(() => Math.random() - 0.5); // Shuffle

    // Get the question text in the appropriate language
    const questionText =
      locale === 'he'
        ? `איזה דגל שייך ל${translatedCountryName}?`
        : `Which flag belongs to ${translatedCountryName}?`;

    return {
      id: `flag-identify-${country.cca2}`,
      question: {
        text: questionText
      },
      answer: {
        text: '',
        image: getFlagUrl(country.cca2)
      },
      difficulty: getDifficultyForCountry(country),
      type: 'multiple_choice',
      options: flagOptions,
      metadata: {
        countryCode: country.cca2,
        identifyFlag: true
      },
      autoReadQuestion: true
    } as MultipleChoiceQuestionItem;
  });
};

// Assign difficulty based on region/subregion or other criteria
const getDifficultyForCountry = (country: Country): DifficultyLevel => {
  // Popular or well-known countries are easier
  const easyCountries = [
    'US',
    'GB',
    'FR',
    'DE',
    'IT',
    'ES',
    'JP',
    'CN',
    'RU',
    'BR',
    'CA',
    'AU',
    'IN',
    'MX',
    'ZA'
  ];

  if (easyCountries.includes(country.cca2)) {
    return 'easy';
  }

  // European and larger countries are medium difficulty
  if (
    country.region === 'Europe' ||
    country.region === 'Americas' ||
    country.region === 'Asia'
  ) {
    return 'medium';
  }

  // Others are hard
  return 'hard';
};
