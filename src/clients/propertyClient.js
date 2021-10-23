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

  static addTenantToProperty = async (server_code, token) => {
    const response = await fetch(`${baseURL}tenant`, {
      method:"POST",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({server_code: server_code})
    })
    if (!response.ok) {
      const data = await response.json()
      const error = new Error(data.message || `Failed to get properties`);
      error.response = data;
      throw error;
    }
  }
}
