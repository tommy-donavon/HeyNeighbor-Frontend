const baseURL = 'http://localhost:8080/api/property/';

export default class PropertyClient {
  static getUserProperties = async (user, token) => {
    const requestUrl = baseURL + (user.account_type === 1 ? 'tenant' : 'admin');
    const response = await fetch(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
      },
    });
    const data = await response.json()
    if (!response.ok) {
      const error = new Error(data.message || `Failed to get properties`);
      error.response = data;
      throw error;
    }
    return data
  };
}
