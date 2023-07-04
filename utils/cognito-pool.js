import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import { USER_POOL_ID, CLIENT_ID } from "@user-pool-env";

const PoolData = {
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID,
};

const userPool = new CognitoUserPool(PoolData);

function signUp(email, password, name, lastName, phone) {
  return new Promise((resolve, reject) => {
    userPool.signUp(
      email,
      password,
      [
        { Name: "given_name", Value: name },
        { Name: "family_name", Value: lastName },
        { Name: "phone_number", Value: "+54911" + phone },
      ],
      null,
      (err, result) => {
        if (err) {
          reject(err);
          return err.name;
        }
        resolve(result.user);
      }
    );
  });
}

function confirmSignUp(email, code) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

export { signUp, confirmSignUp };
