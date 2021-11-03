const baseURL = 'http://localhost:8080/api/maintenance/';

export default class MaintenanceClient {
  static createMaintenanceRequest = async (server_code, mainRequest, token) => {
    console.log(mainRequest);
    const response = await fetch(baseURL + server_code, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(mainRequest),
    });
    if (!response.ok) {
      const data = await response.json();
      const error = new Error(
        data.message || `Failed to submit maintenance request`,
      );
      error.response = data;
      throw error;
    }
  };

  static getUserMaintenanceRequest = async (server_code, token) => {
    const response = await fetch(baseURL + server_code, {
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
  };

  static updateMaintenanceRequest = async (updateInfo, token) => {
    const url = `${baseURL}${updateInfo.ID}`;
    delete updateInfo.ID;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(updateInfo),
    });
    if (!response.ok) {
      const data = await response.json();
      const error = new Error(
        data.message || `Failed to submit maintenance request`,
      );
      error.response = data;
      throw error;
    }
  };

  static deleteMaintenanceRequest = async (id, token) => {
    const url = `${baseURL}${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const data = await response.json();
      const error = new Error(
        data.message || `Failed to submit maintenance request`,
      );
      error.response = data;
      throw error;
    }
  };
}
