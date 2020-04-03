export function formatAge (age) {
  // Only allow numbers (min age: 0 / max age: 99)
  let string = age.replace(/[^\d]/g, '');
  if (string !== '') {
    let value = parseInt(string);
    if (value < 0) {
      return '0';
    } else if (value > 99) {
      return '99';
    } else {
      return value.toString();
    }
  } else {
    return '';
  }
}
