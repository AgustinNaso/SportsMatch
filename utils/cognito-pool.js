import { Auth } from "aws-amplify";

async function signUp(email, password, name, lastName, phone) {
  return await Auth.signUp({
    username: email,
    password: password,
    attributes: {
      given_name: name,
      family_name: lastName,
      phone_number: "+54911" + phone,
    },
    autoSignIn: {
      enabled: true,
    },
  }).catch((error) => {
    return {
      error: error,
    };
  });
}

async function confirmSignUp(email, code) {
  return await Auth.confirmSignUp(email, code).catch((error) => {
    return {
      error: error,
    };
  });
}

async function signIn(email, password) {
  return await Auth.signIn(email, password).catch((error) => {
    return {
      error: error,
    };
  });
}

function signOut() {
  return Auth.signOut();
}

async function getCurrentUser() {
  return await Auth.currentAuthenticatedUser().catch((error) => {
    return {
      error: error,
    };
  });
}

export { signUp, confirmSignUp, signIn, signOut, getCurrentUser };
