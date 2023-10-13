import { EXPERTISE } from "../constants/data";
import * as SecureStore from 'expo-secure-store';


export const API_URL = 'http://sportsmatch-lb-700737557.us-east-1.elb.amazonaws.com'

const authenticatedFetch = async (url, options = {}) => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const headers = {
            ...options.headers,
            'C-api-key': token
        };
        const response = await fetch(API_URL + url, { ...options, headers });
        const data = await response.json();
        return data;
    } catch (err) {
        console.log('ERROR: ', err);
    }
    return null;
}

export const fetchUser = async (email) => {
    const data = await fetch(API_URL + '/users?email=' + email);
    const json = await data.json();
    return json;
}


export const fetchParticipants = async (eventId) => {
    const response = await fetch(API_URL + '/events/' + eventId + '/owner/participants');
    const json = await response.json();
    return json;
}

//TODO: clean this code
export const fetchEvents = async (ownerEmail, filters) => {
    console.log("FILTERSS " + JSON.stringify(filters))
    const data = await SecureStore.getItemAsync('userPayload');
    const userData = await fetchUser(JSON.parse(data).email);
    ownerId = userData.user_id;
    let filterString;
    if (filters) {
        if (filters.date)
            filters.date = filters.date.split("T")[0];
        else
            delete filters.date;
        if (filters.expertise)
            filters.expertise = EXPERTISE.indexOf(filters.expertise);
        else
            delete filters.expertise;
        if (!filters.schedule || filters.schedule.length == 0)
            delete filters.schedule;
        filterString = Object.entries(filters).map(([key, value]) => {
            console.log("KEY: " + key + " VALUE: " + value)
            return "&" + key + "=" + value;
        }).join("");
    }
    console.log("FILTERS " + filterString);
    return await fetch(`${API_URL}/events?userId=${ownerId}&filterOut=true${filterString ?? ""}`);
}

export const fetchJoinedEvents = async (userId) => {
    const data = await SecureStore.getItemAsync('userPayload');
    const userData = await fetchUser(JSON.parse(data).email);
    const response = await fetch(API_URL + '/events?participantId=' + userData.user_id);
    const jsonRes = await response.json();
    return jsonRes;
}

export const fetchMyEvents = async (uid) => {
    const data = await SecureStore.getItemAsync('userPayload');
    console.log("STORED DATAA: " + data);
    const userData = await fetchUser(JSON.parse(data).email);
    const events = await fetch(API_URL + `/events?userId=${userData.user_id}`);
    const json = await events.json();
    const response = json;

    console.log("MIS EVENTOS : ", response.items)
    for (let i = 0; i < response.items.length; i++)
        response.items[i].participants = await fetchParticipants(response.items[i].event_id);

    return response;
}

export const fetchNearEvents = async (filters = undefined) => {
    const data = await SecureStore.getItemAsync('userPayload');
    console.log("STORED DATAA: ", data)
    let userData;
    try {
        userData = await fetchUser(JSON.parse(data).email);
    }
    catch (err) {
        console.log("ERRPR", err);
    }
    console.log('USER DATA: ', userData)
    //TODO: filtrar remaining > 0 ?
    const response = await fetchEvents(userData.user_id, filters);
    let jsonRes = await response.json();
    jsonRes.items = jsonRes.items.filter(event => event.remaining > 0 && event.event_status !== 2);
    return jsonRes
}

export const publishEvent = async (eventData) => {
    console.log("PUBLISH: ", eventData);
    const res = await authenticatedFetch('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
        headers: {
            'Content-Type': 'application/json',
        }
    });
    console.log("RESJSON: ", res);
}

export const fecthUserId = async (email, userJWT) => {
    const data = await fetch(API_URL + '/users?email=' + email);
    return await data.json();
}

export const fetchEventById = async (eventId) => {
    const data = await fetch(API_URL + '/events/' + eventId);
    return await data.json();
}

export const joinNewEvent = async (eventId, userId) => {
    const data = await SecureStore.getItemAsync('userPayload');
    const userData = await fetchUser(JSON.parse(data).email);

    await fetch(API_URL + '/events/' + eventId + '/participants', {
        method: 'PUT',
        body: JSON.stringify({ userId: userData.user_id }),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export const acceptParticipant = async (eventId, userId) => {
    await fetch(API_URL + '/events/' + eventId + '/owner/participants', {
        method: 'PUT',
        body: JSON.stringify({ userId: userId }),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}
//Endpoint should be /rating for it to be RESTful
export const rateUser = async (eventId, rating, participantId) => {
    await authenticatedFetch(`/users/${participantId}/rate`, {
        method: 'POST',
        body: JSON.stringify({ eventId: eventId, rating: rating }),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export const removeParticipant = async (eventId) => {
    console.log("REMOVING MYSELF FROM EVENT: " + eventId);
    const res = await authenticatedFetch('/events/' + eventId + '/participants', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return res;
}

export const removeParticipantAsOwner = async (eventId, userEmail) => {
    console.log("REMOVING PARTICIPANT FROM EVENT: " + eventId);
    await authenticatedFetch('/events/' + eventId + '/owner/participants', {
        method: 'DELETE',
        body: JSON.stringify({ email: userEmail }),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}
