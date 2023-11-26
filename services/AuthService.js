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
        console.log(response.headers);
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
    } catch (error) {
        console.log(error);
    }
}


