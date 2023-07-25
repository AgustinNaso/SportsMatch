function validateEmail(mail) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    mail
  );
}

function matching(pass1, pass2) {
  return pass1 === pass2;
}

function isEmpty(input) {
  return input === "";
}

function validatePhoneNumber(number) {
  return /^[0-9]{8}$/.test(number);
}

function validatePassword(password) {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,99}$/.test(password);
}

export { validateEmail, matching, isEmpty, validatePhoneNumber, validatePassword };