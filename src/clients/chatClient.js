const baseURL = 'http://localhost:8080/api/chat/'

export default class ChatClient {
    static getPastChats = async (property_code, room) => {
        const requestURL = `${baseURL}past-msg?property_code=${property_code}&room=${room}`
        const response = await fetch(requestURL, {
            headers:{
                'accept':'application/json'
            }
        });
        const data = await response.json()
        if (!response.ok) {
            const error = new Error(data.message || `Failed to get properties`);
            error.response = data;
            throw error;
          }
          return data
    }
}