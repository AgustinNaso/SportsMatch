import { authenticatedFetch } from "./eventService";
import { Buffer } from "@craftzdog/react-native-buffer";

export const API_URL =
  "http://sportsmatch-lb-700737557.us-east-1.elb.amazonaws.com";

export const updateUser = async (userId, userData) => {
  const response = await authenticatedFetch("/users/" + userId, {
    method: "PUT",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return {
    status: response.status,
    message: JSON.stringify(response),
  };
};

export const updateUserImage = async (userId, base64Img) => {
  const res = await authenticatedFetch("/users/" + userId + "/image", {
    method: "PUT",
  });

  if (!res.ok) {
    return {
      status: res.status,
      message: JSON.stringify(res),
    };
  }

  const presignedUrl = await res.json();

  var buffer = Buffer.from(base64Img);

  var requestOptions = {
    method: "PUT",
    body: buffer,
  };

  const response = await fetch(presignedUrl.presignedPutUrl, requestOptions);

  return {
    status: response.status,
    message: JSON.stringify(response),
  };
};
