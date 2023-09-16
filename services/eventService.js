import { EXPERTISE } from "../constants/data";


export const API_URL = 'http://192.168.122.1:8080'

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
export const fetchEvents = async (ownerId, filters) => {
    console.log("FILTERSS " + JSON.stringify(filters))
    ownerId = 1;
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
    userId = 1;
    const response = await fetch(API_URL + '/events?participantId=' + userId);
    const jsonRes = await response.json();
    return jsonRes;
}

export const fetchMyEvents = async (uid) => {
    uid = 1;
    const events = await fetch(API_URL + `/events?userId=${uid}`);
    const json = await events.json();
    const response = json;

    console.log("MIS EVENTOS : ", response.items)
    for (let i = 0; i < response.items.length; i++)
        response.items[i].participants = await fetchParticipants(response.items[i].event_id);

    return response;
}

export const fetchNearEvents = async (filters = undefined) => {
    //TODO: filtrar remaining > 0 ?
    const response = await fetchEvents(1, filters);
    const jsonRes = await response.json();
    console.log("RESPONSE: " + JSON.stringify(jsonRes));
    return jsonRes
}

export const publishEvent = async (eventData) => {
    console.log("PUBLLISH: " + JSON.stringify(eventData));
    return await fetch(API_URL + '/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
        headers: {
            'Content-Type': 'application/json'
        },
    });
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
    await fetch(API_URL + '/events/' + eventId + '/participants', {
        method: 'PUT',
        body: JSON.stringify({ userId: 1 }),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export const acceptParticipant = async (eventId, userId) => {
    await fetch(API_URL + '/events/' + eventId + '/owner/participants', {
        method: 'PUT',
        body: JSON.stringify({ userId: userId, eventId: eventId }),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}
//Endpoint should be /rating for it to be RESTful
export const rateUser = async (eventId, userId, rating, participantId) => {
    await fetch(API_URL + '/users/' + userId + '/rate', {
        method: 'POST',
        body: JSON.stringify({ eventId: eventId, rating: rating, rater: participantId.toString()}),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}