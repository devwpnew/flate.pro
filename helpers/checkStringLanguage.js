export function isEnglishString(str) {
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127) {
      return false;
    }
  }
  return true;
}

export function isRussianString(str) {
  for (var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    if (code < 1040 || code > 1103) {
      return false;
    }
  }
  return true;
}