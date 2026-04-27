export const cleanWildcardSqlStr = (str: string) => {
  if (!str) return str;
  return `%${str?.replace(/'/g, "''")}%`;
};

export function safeParse(stringToParse: string, fallbackData?: object) {
  try {
    return JSON.parse(stringToParse);
  } catch (error) {
    console.warn('error parsing JSON', error);
    return fallbackData ?? stringToParse;
  }
};

export function convertBooleanToYesNo(value: boolean) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return value;
}

export function convertToNumericValue(value: string) {
  return !Number.isNaN(Number(value)) ? Number(value) : null;
}

export function formatNumberAsString(
  num: number,
  options: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat('en-US', options).format(num);
}
