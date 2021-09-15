export default {
     getToken: async (username, password) => {
        const response = await fetch('http://localhost:8080/api/account/', {
            method:"POST",
            headers: {
                accept: 'application/json',
                'content-type':'application/json'
            },
            body: JSON.stringify({username:username, password:password}),
        });
        
        const data = await response.json();
        if(!response.ok){
            const error = new Error(data.message || `Failed to get token`);
            error.response = data
            throw error;
        }
        return data;

    },
    getUserInformation: async (token) => {
        const response = await fetch('http://localhost:8080/api/account/', {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        const data = await response.json();
        if(!response.ok){
            const error = new Error(data.message || `Failed to get user information`);
            error.response = data
            throw error;
        }
        return data;
    }
}