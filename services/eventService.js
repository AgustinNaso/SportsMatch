
const API_URL = 'https://ky3m8aak27.execute-api.us-east-1.amazonaws.com/Testing'


export const fetchParticipants = () => {
    return 1;
}

export const fetchEvents = async () => {
    return await fetch(API_URL + '/events');
}

export const fetchJoinedEvents = async () => {
    return await fetch(API_URL + '/events?participantId=1');
}

export const fetchMyEvents = async () => {
    return await fetch(API_URL + '/events?participantId=1');
}

export const fetchNearEvents = async () => {
    //TODO: filtrar remaining > 0 ?
   return await fetchEvents();
}

export const publishEvent = async (eventData) => {
    return await fetch(API_URL + '/events', {
        method: 'POST',
        body: JSON.stringify(eventData)
    });
}

export const fetchEventById = async (eventId) => {
    const data =  await fetch(API_URL + '/events/' + eventId);
    return await data.json();
}