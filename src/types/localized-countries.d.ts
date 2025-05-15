declare module "localized-countries" {
  interface LocalizedCountries {
    get(countryCode: string): string;
    array(): Array<{ code: string; label: string }>;
    object(): Record<string, string>;
  }

  interface CountryData {
    [key: string]: string;
  }

  function localizedCountriesFactory(
    language: string | CountryData
  ): LocalizedCountries;

  export default localizedCountriesFactory;
}

declare module "localized-countries/data/*.json" {
  const content: Record<string, string>;
  export default content;
}
