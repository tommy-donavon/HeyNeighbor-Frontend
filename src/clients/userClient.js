const baseURL = 'http://localhost:8080/api/account/';

export default class UserClient {
  static getToken = async (username, password) => {
    const response = await fetch(baseURL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || `Failed to get token`);
      error.response = data;
      throw error;
    }
    return data;
  };
  static getUserInformation = async (token) => {
    const response = await fetch(baseURL, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || `Failed to get user information`);
      error.response = data;
      throw error;
    }
    return data;
  };
  static createUserAccount = async (userInformation) => {
    const response = await fetch(`${baseURL}create-admin`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userInformation),
    });
    if (!response.ok) {
      var data = await response.json();
      const error = new Error(data.message || `Failed to create user`);
      error.response = data;
      throw error;
    }
  };
}
