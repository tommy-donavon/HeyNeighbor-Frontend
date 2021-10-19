const baseURL = 'http://localhost:8080/api/maintenance/';

export default class MaintenanceClient {
  static createMaintenanceRequest = async (server_code, mainRequest) => {
    const response = await fetch(baseURL+server_code, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        content: 'application/json',
      },
      body: JSON.stringify(mainRequest)
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(
        data.message || `Failed to submit maintenance request`,
      );
      error.response = data;
      throw error;
    }
    return data;
  };

  static getUserMaintenanceRequest = async(server_code) => {
    const response = await fetch(baseURL+server_code, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        const error = new Error(
          data.message || `Failed to retrieve maintenance request`,
        );
        error.response = data;
        throw error;
      }
      return data;
  }
}
