export default function formattedFilterProps(array) {
  const newArray = [];

  array.map((el, index) => {
    let name = null;

    if(el.name) {
      name = el.name
    }else {
      name = el
    }

    newArray.push({ name: name, id: `${index}` });
  });

  return newArray;
}
