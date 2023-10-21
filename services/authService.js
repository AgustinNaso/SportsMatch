import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
    CognitoUserAttribute,
    CognitoRefreshToken
} from "amazon-cognito-identity-js"

import * as SecureStore from 'expo-secure-store';
import { fetchUser } from "./eventService";

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
        console.log("No values stored under key: " + key);
        return null;
    }
}

export const refreshSession = async () => {
    const refreshToken = await getValueFor('refreshToken');
    const userData = await getValueFor('userPayload');
    const cognitoUser = UserPool.getCognitoUser(userData.email);
    return new Promise((resolve, reject) => {
        cognitoUser.refreshSession(new CognitoRefreshToken({RefreshToken: refreshToken}), (err, session) => {
            if (err) {
                console.error("Error refreshing session: ", err);
                reject(err);
            }
            else {
                console.log("Refreshed session: ", session);
                save('userToken', session.idToken.jwtToken);
                save('refreshToken', session.refreshToken.token);
                resolve(session);
            }
        })
    });
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
                const userData = await fetchUser(data.getIdToken().decodePayload().email);
                save('userToken', data.getIdToken().getJwtToken());
                save('refreshToken', data.getRefreshToken().getToken());
                save('userPayload', JSON.stringify({
                    email: data.idToken.payload.email,
                    name: data.idToken.payload.given_name,
                    lastName: data.idToken.payload.family_name,
                    phone: data.idToken.payload.phone_number,
                    birthdate: data.idToken.payload.birthdate,
                    uid: userData.user_id
                }));
                resolve({
                    token : data.idToken.jwtToken
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
    return new CognitoUser(userData);
}

export const getCurrentUserData = async () => {
    const stringRes =  await getValueFor('userPayload');
    return await JSON.parse(stringRes);
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

export const clearUserData = () => {
    SecureStore.deleteItemAsync('userToken');
    SecureStore.deleteItemAsync('userPayload');
}


export default UserPool;