import { EVENT_STATUS, EXPERTISE } from "../constants/data";
import * as SecureStore from 'expo-secure-store';


export const API_URL = 'http://sportsmatch-lb-700737557.us-east-1.elb.amazonaws.com'

export const authenticatedFetch = async (url, options = {}) => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const headers = {
            ...options.headers,
            'C-api-key': token
        };
        const response = await fetch(API_URL + url, { ...options, headers });
        console.log(`Response for ${url} :`, response.status);
        if (response.status >= 400 && response.status < 600) {
            const body = await response.json();
            if (response.status === 401 && body.internalStatus === "TOKEN_EXPIRED") {
                // await refreshSession();
                // return await authenticatedFetch(url, options);
            }
            else
                throw new Error("Bad response from server");
        }
        return response;
    } catch (err) {
        console.log('ERROR: ', err);
    }
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
export const fetchEvents = async (filters) => {
    const data = JSON.parse(await SecureStore.getItemAsync('userPayload'));
    console.log("FILTROS ", filters)
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
    return await fetch(`${API_URL}/events?userId=${data.user_id}&filterOut=true${filterString ?? ""}`);
}

export const fetchJoinedEvents = async (userId) => {
    const response = await fetch(API_URL + '/events?participantId=' + userId);
    const jsonRes = await response.json();
    return jsonRes;
}

export const fetchMyEvents = async (uid) => {
    const data = await SecureStore.getItemAsync('userPayload');
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
    try {
        const data = await SecureStore.getItemAsync('userPayload');
        const userData = await fetchUser(JSON.parse(data).email);
        const response = await fetchEvents(filters);
        let jsonRes = await response.json();
        jsonRes.items = jsonRes.items?.filter(event => event.remaining > 0 && event.event_status !== EVENT_STATUS.FINALIZED);
        return jsonRes
    }
    catch (err) {
        console.log("ERRPR", err);
    }
}

export const publishEvent = async (eventData) => {
    await authenticatedFetch('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const fetchUserId = async (email, userJWT) => {
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

    await authenticatedFetch('/events/' + eventId + '/participants', {
        method: 'PUT',
        body: JSON.stringify({ userId: userData.user_id }),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export const acceptParticipant = async (eventId, email) => {
    await authenticatedFetch('/events/' + eventId + '/owner/participants', {
        method: 'PUT',
        body: JSON.stringify({ email: email }),
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
