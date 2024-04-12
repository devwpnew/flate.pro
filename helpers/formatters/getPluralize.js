export default function getPluralize(num, arr) {
  const rules = new Intl.PluralRules("ru");
  const pluralize = rules.select(num);

  let pluralText;
  // console.log(pluralize, arr);
  if (pluralize === "many") {
    return (pluralText = arr[0]);
  }

  if (pluralize === "one") {
    return (pluralText = arr[1]);
  }

  if (pluralize === "few") {
    return (pluralText = arr[3]);
  }

  return arr[3];
}
