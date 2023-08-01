
const API_URL = 'https://ky3m8aak27.execute-api.us-east-1.amazonaws.com/Testing'


export const fetchParticipants = async (eventId) => {
    return await fetch(API_URL + '/events/' + eventId + '/participants');
}

export const fetchEvents = async () => {
    return await fetch(API_URL + '/events');
}

export const fetchJoinedEvents = async (userId) => {
    return await fetch(API_URL + '/events?participantId=' + userId);
}

export const fetchMyEvents = async (uid) => {
    const events =  await fetch(API_URL + '/events?userId='+ uid);
    const json = await events.json();
    const response = json;
    for(let i = 0 ; i < response.length; i++){
        const participants = await fetchParticipants(response[i].event_id);
        const json = await participants.json();
        response[i].participants = json;
    }

   return response;
}

export const fetchNearEvents = async () => {
    //TODO: filtrar remaining > 0 ?
   const response = await fetchEvents();
   return await response.json();
}

export const publishEvent = async (eventData) => {
    console.log("PUBLLISH: " + JSON.stringify(eventData));
    return await fetch(API_URL + '/events', {
        method: 'POST',
        body: JSON.stringify(eventData)
    });
}

export const fecthUserId = async (email, userJWT) => {
    const data = await fetch(API_URL + '/users?email=' + email);
    return await data.json();
}

export const fetchEventById = async (eventId) => {
    const data =  await fetch(API_URL + '/events/' + eventId);
    return await data.json();
}

export const joinNewEvent = async (eventId, userId) => {
    return await fetch(API_URL + '/events/' + eventId + '/joinee', {
        method: 'PUT',
        body: JSON.stringify({userId: userId, eventId: eventId})
    });
}

export const acceptParticipant = (eventId, userId) => {
    return fetch(API_URL + '/events/' + eventId + '/admin', {
        method: 'PUT',
        body: JSON.stringify({userId: userId, eventId: eventId})
    });
}