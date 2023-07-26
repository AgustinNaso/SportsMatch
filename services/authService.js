import {
    CognitoUserPool,
    CognitoUser,
} from "amazon-cognito-identity-js"

import * as SecureStore from 'expo-secure-store';


const UserPool = new CognitoUserPool({
    UserPoolId: "us-east-1_0Zz8M72SJ",
    ClientId: "443alqtqlr1fhkjcu3i6ot95bs"
})


const save = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
  }
  
  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      alert("🔐 Here's your value 🔐 \n" + result);
    } else {
      alert('No values stored under that key.');
    }
  }
  

export const getCognitoUser = (email) => {
    const userData = {
        Username: email,
        Pool: UserPool
    }
    console.log(userData);
    return new CognitoUser(userData);
}

export const getCurrentUserData = () => {
    return getValueFor('userPayload');
}

export const getCurrUserJWT = () => {
    return getValueFor('userToken');
}


export const verifyMail = (email, code) => {
    return new Promise((resolve) => {
    getCognitoUser(email).confirmRegistration(code, true, (err, result) => {
        if (err) {
          return resolve({ statusCode: 422, response: err });
        }
        return resolve({ statusCode: 200, response: result });
      });
    });
}

export const signOut = () => {
    SecureStore.deleteItemAsync('userToken');
    SecureStore.deleteItemAsync('userPayload');
}

export const saveUserData = data => {
    console.log(data);
    const userData =  JSON.parse(JSON.stringify(data));
    const userJWT = userData.idToken.jwtToken;
    const userPayload = userData.idToken.payload;
    save('userToken', userJWT);
    save('userPayload', JSON.stringify(userPayload));
} 

export function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

export default UserPool;