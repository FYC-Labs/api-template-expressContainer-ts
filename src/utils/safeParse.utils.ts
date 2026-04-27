function removeNestedUndefined(obj: Record<string, unknown>) {
  for (const key in obj) {
    if (obj[key] === undefined) {

      delete obj[key];
    } else if (obj[key] !== null && typeof obj[key] === 'object') {
      removeNestedUndefined(obj[key] as Record<string, unknown>);
    }
  }
}

export function safeParse(stringToParse: string, fallbackData: object = {}) {
  try {
    return JSON.parse(stringToParse);
  } catch (error) {
    console.warn('error parsing JSON', error);
    return fallbackData ?? {};
  }
}

export function cleanFields(obj: object) {
  const newObj = safeParse(JSON.stringify(obj), {}) as Record<string, unknown>;
  removeNestedUndefined(newObj);
  return newObj;
}
