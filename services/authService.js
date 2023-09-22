import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
    CognitoUserAttribute
} from "amazon-cognito-identity-js"

import * as SecureStore from 'expo-secure-store';
import { fetchUser, fecthUserId } from "./eventService";
import { useNavigation } from "@react-navigation/native";

const UserPool = new CognitoUserPool({
    UserPoolId: "us-east-1_DIhU6m4Je",
    ClientId: "6jefbmtkmcsdsu883cjk7ra0d7"
})


const save = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
}

const getValueFor = async key => {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        console.info("Value: " + result)
        return result;
    } else {
        console.log("No values stored under that key.");
        return null;
    }
}

export const login = async data => {
    return new Promise((resolve, reject) => {
        const user = new CognitoUser({
            Username: data.email,
            Pool: UserPool
        })

        const authDetails = new AuthenticationDetails({
            Username: data.email.toLowerCase(),
            Password: data.password
        });

        user.authenticateUser(authDetails, {
            onSuccess: async (data) => {
                console.log("On Success: ", data);
                resolve({
                    token : data.accessToken.jwtToken
                });
            },
            onFailure: (err) => {
                console.error("On Failure: ", err);
                reject(err);
            },
            newPasswordRequired: (data) => {
                console.log("newPasswordRequired: ", data);
            }
        })
    });
}


export const register = async data => {
    return new Promise((resolve, reject) => {
        const attributeList = [
            new CognitoUserAttribute({
                Name: 'family_name',
                Value: data.lastName
            }),
            new CognitoUserAttribute({
                Name: 'given_name',
                Value: data.name
            }),
            //TODO: Add birthdate in the form
            new CognitoUserAttribute({
                Name: 'birthdate',
                Value: '05/01/2000'
            }),
            new CognitoUserAttribute({
                Name: 'phone_number',
                Value: '+5411' + data.phone
            }),
        ];
        UserPool.signUp(data.email, data.password, attributeList, null, (err, result) => {
            if (err) {
                console.error("Error signing up:", err);
                reject(undefined);
            }
            else {
                console.log("Sign up successful. User:", result.user);
                resolve(result.user);
            }
        });
    })
}


export const getCognitoUser = (email) => {
    const userData = {
        Username: email,
        Pool: UserPool
    }
    console.log("USR: ",userData);
    return new CognitoUser(userData);
}

export const getCurrentUserData = async () => {
    return await getValueFor('userPayload');
}

export const getCurrUserJWT = async () => {
    return await getValueFor('userToken');
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

export const saveUserData = async data => {
    const userJWT = data.idToken.jwtToken;
    const userPayload = data.idToken.payload;
    console.log(userPayload.email)
    const userInfo = await fecthUserId(userPayload.email.toLowerCase(), userJWT);
    userPayload.uid = userInfo.id;
    console.log('Payload: ' + userPayload.uid);
    save('userToken', userJWT);
    save('userPayload', JSON.stringify(userPayload));
}

export function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

export default UserPool;