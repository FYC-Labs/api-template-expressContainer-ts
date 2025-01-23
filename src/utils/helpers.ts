export const cleanWildcardSqlStr = (str: string) => {
  if (!str) return str;
  return `%${str?.replace(/'/g, "''")}%`;
};

export const safeParse = (stringToParse: any, fallbackData?: any) => {
  try {
    return JSON.parse(stringToParse);
  } catch (error) {
    return fallbackData ?? stringToParse;
  }
};

export function convertBooleanToYesNo(value: any) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return value;
}

export function convertToNumericValue(value: any) {
  return !Number.isNaN(parseInt(value, 10)) ? +value : null;
}

export function formatNumberAsString(
  num: number,
  options: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat('en-US', options).format(num);
}
