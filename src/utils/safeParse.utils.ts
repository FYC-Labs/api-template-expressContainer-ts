function removeNestedUndefined(obj: Record<string, any>) {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    if (obj[key] === undefined) {
      // eslint-disable-next-line no-param-reassign
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      removeNestedUndefined(obj[key]);
    }
  }
}

export function safeParse(stringToParse: any, fallbackData?: any) {
  try {
    return JSON.parse(stringToParse);
  } catch (error) {
    return fallbackData ?? stringToParse;
  }
}

export function cleanFields(obj: any) {
  const newObj: any = safeParse(JSON.stringify(obj), {});
  removeNestedUndefined(newObj);
  return newObj;
}
