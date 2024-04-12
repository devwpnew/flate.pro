import MaskInput from "react-maskinput/lib";

export const phoneMask = (val) => {
  if(!val){
    return "+7" // При удалении всегда +7 остаётся
  }

  if(val[0] == '+'){ // Если первый символ плюс заменяем нечисловые символы, чтобы плюс не заменился
    val = `+${val.replace(/\D/g, '')}`
  }else{ // Иначе заменяем все нечисловые символы
    val = `${val.replace(/\D/g, '')}`
  }
  if( (val[0] == '+' || val[0] == 8) && val.length == 1){ // Если введён только 1 символ и это плюс или 8 то заменяем его на +7
    return '+7'
  } else if (val[0] == '+' && val.length > 1) { // Если первый символ плюс и длина больше одного, то ничего не делаем
    return val;
  } else if(val.length == 11 && val[0] == '8' ){ // Если резко жидко вставили номер полный с первым символом восьмёркой, то заменяем на +7
    val.shift()
    return `+7${val}`
  } else {
    return (val = "+7" + val);
  }
};