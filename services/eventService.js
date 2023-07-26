
const API_URL = 'https://ky3m8aak27.execute-api.us-east-1.amazonaws.com/Testing'


export const fetchParticipants = () => {
    return 1;
}

export const fetchEvents = async () => {
    return await fetch(API_URL + '/events');
}

export const fetchNearEvents = async () => {
    //TODO: filtrar remaining > 0 ?
   return await fetchEvents();
}