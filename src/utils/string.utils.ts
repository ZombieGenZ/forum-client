export const isNullOrEmpty = (str: string | null | undefined) => {
  return str === null || str === undefined || str.trim() === ''
}

export const isValidAlphanumeric = (str: string) => {
  const alphanumericRegex = /^[a-zA-Z0-9]*$/;
  return alphanumericRegex.test(str);
}
