
const API_URL = 'http://192.168.0.14:8080'

export const fetchUser = async (email) => {
    const data = await fetch(API_URL + '/users?email=' + email);
    const json = await data.json();
    return json;
}


export const fetchParticipants = async (eventId) => {
    return await fetch(API_URL + '/events/' + eventId + '/owner/participants');
}

export const fetchEvents = async (ownerId) => {
    ownerId = 1;
    return await fetch(`${API_URL}/events?userId=${ownerId}&filterOut=true`);
}

export const fetchJoinedEvents = async (userId) => {
    userId=1;
    const response = await fetch(API_URL + '/events?participantId=' + userId);
    const jsonRes = await response.json();
    return jsonRes;
}

export const fetchMyEvents = async (uid) => {
    uid = 1;
    const events =  await fetch(API_URL + '/events?userId='+ uid);
    const json = await events.json();
    const response = json;

    console.log("MISEVENTOS : " + response)
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
    const data =  await fetch(API_URL + '/events/' + eventId);
    return await data.json();
}

export const joinNewEvent = async (eventId, userId) => {
    await fetch(API_URL + '/events/' + eventId + '/participants', {
        method: 'PUT',
        body: JSON.stringify({userId: 1}),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export const acceptParticipant = async (eventId, userId) => {
    await fetch(API_URL + '/events/' + eventId + '/owner/participants', {
        method: 'PUT',
        body: JSON.stringify({userId: userId, eventId: eventId}),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}