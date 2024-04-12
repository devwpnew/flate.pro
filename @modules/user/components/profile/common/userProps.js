import React from "react";

export default function UserProps({ prop }) {
  const date = "Дата рождения";
  const city = "Город";
  const age = "Возраст";

  let res = '';

  if(prop == 'date') {
    res = date
  }
  if(prop == 'city') {
    res = city
  }

  if(prop == 'age') {
    res = age
  }
  return <span>{res}</span>;
}
