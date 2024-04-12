export default function validate(formData, fields) {
  const fieldsWithError = [];
  let isErrors = false;

  fields.map((field) => {
    if (!formData.get(field)) {
      isErrors = true;
      fieldsWithError.push(field);
    }
  });

  return { isErrors, fieldsWithError };
}
