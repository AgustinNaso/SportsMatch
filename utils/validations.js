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

export { validateEmail, matching, isEmpty };