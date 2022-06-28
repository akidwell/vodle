export function ZipCodeCountry(zip: string): string | null {
  const usa = new RegExp('^\\d{5}(-{0,1}\\d{4})?$');
  const canada = new RegExp(
    /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i
  );

  if (usa.test(zip)) {
    return 'USA';
  }
  if (canada.test(zip)) {
    return 'CAN';
  }
  return null;
}
