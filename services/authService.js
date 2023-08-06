import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails
} from "amazon-cognito-identity-js"

import * as SecureStore from 'expo-secure-store';
import { fecthUserId } from "./eventService";
import { useNavigation } from "@react-navigation/native";

const UserPool = new CognitoUserPool({
    UserPoolId: "us-east-1_0Zz8M72SJ",
    ClientId: "443alqtqlr1fhkjcu3i6ot95bs"
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
        resolve({accessToken: {
            jwtToken: 'token'
        }})
    })
    // return new Promise((resolve, reject) => {
    //     const user = new CognitoUser({
    //         Username: data.email,
    //         Pool: UserPool
    //     })

    //     const authDetails = new AuthenticationDetails({
    //         Username: data.email.toLowerCase(),
    //         Password: data.password
    //     });

    //     user.authenticateUser(authDetails, {
    //         onSuccess: async (data) => {
    //             console.log("On Success: ", data);
    //             resolve({
    //                 acessToken: {
    //                     jwtToken: 'token=random'
    //                 }
    //             });
    //         },
    //         onFailure: (err) => {
    //             console.error("On Failure: ", err);
    //             reject(err);
    //         },
    //         newPasswordRequired: (data) => {
    //             console.log("newPasswordRequired: ", data);
    //         }
    //     })
    // });
}


export const signUp = data => {
    const navigation = useNavigation();
    const attributeList = [
        new CognitoUserAttribute({
            Name: 'custom:location', // Use "custom:" prefix for custom attributes
            Value: data.location
        }),
        new CognitoUserAttribute({
            Name: 'family_name',
            Value: data.lastName
        }),
        new CognitoUserAttribute({
            Name: 'given_name',
            Value: data.name
        }),
        new CognitoUserAttribute({
            Name: 'phone_number',
            Value: '+5411' + data.phone
        }),
    ];
    UserPool.signUp(data.email, data.password, attributeList, null, (err, result) => {
        if (err) {
            console.error("Error signing up:", err);
        }
        else {
            console.log("Sign up successful. User:", result.user);
            navigation.navigate("ConfirmSignUp", { email: data.email });
        }
    });
}


export const getCognitoUser = (email) => {
    const userData = {
        Username: email,
        Pool: UserPool
    }
    console.log(userData);
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
    const userData = JSON.parse(JSON.stringify(data));
    const userJWT = userData.idToken.jwtToken;
    const userPayload = userData.idToken.payload;
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