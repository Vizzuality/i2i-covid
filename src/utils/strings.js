const ExceptionsDictionary = [
  { value: ' i ', label: ' I ' },
  { value: 'god', label: 'God' },
  { value: 'dk/refused', label: 'DK/Refused' },
  { value: 'na/dk/refused', label: 'NA/DK/Refused' },
];

export const capitalize = (str) => {
  if (typeof str !== 'string') return str;
  const value = str.toLowerCase();

  const formatted = ExceptionsDictionary.reduce((acc, word) => {
    return acc.includes(word.value) ? acc.replace(word.value, word.label) : acc;
  }, value);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export default { capitalize };
