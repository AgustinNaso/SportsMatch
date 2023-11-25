import { btoa } from "react-native-quick-base64";
import { API_URL } from "./eventService";

const getBasicToken = (email, password) => {
    const credentials = email + ":" + password;
    return btoa(credentials);
}
  
const login = async (email, password) => {
      try {
        let config = {
          headers:  {'c-basic-auth' : getBasicToken(email, password)}
        };
        const response = await fetch(API_URL + "/auth", config);
        const body = await response.json();
        console.log(response.headers);
        return [response.headers.map["c-api-key"], body.user];
      } catch (error) {
        console.log(error);
      }
}

const register = async data => { 
    try {
        const response = await fetch(API_URL + "/auth", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        console.log(response.headers);
        console.log(response.status);
        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.log(error);
    }
}

export { login, register, getBasicToken};


