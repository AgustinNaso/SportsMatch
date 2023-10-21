import { authenticatedFetch } from "./eventService";

export const API_URL = 'http://sportsmatch-lb-700737557.us-east-1.elb.amazonaws.com'

export const updateUser = async (userId, userData) => {
  await authenticatedFetch('/users/' + userId, {
      method: 'PUT',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
      }
  });
}