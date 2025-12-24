
import axios from "axios";

const networkCall = async (endPoint, body)=>{

    const response = await fetch(`${import.meta.env.VITE_API_URL}${endPoint}`, {
        method: 'POST',
        headers:{
            'Content-Type':'application/json',
            // 'Content-Type': 'multipart/form-data',
            'accept': '*/*',
            'apiKey':import.meta.env.VITE_API_KEY,
            'Authorization': "Bearer " + localStorage.getItem('token')
        },
        body: JSON.stringify(body)
    });
    if(response.status == 401){
        localStorage.clear();
        window.location.href = '/login'
    }
    const json = await response.json();
    return json;
}

export const axiosNetworkCall = async (endPoint, body) => {
    try {
        const formData = new FormData();
        Object.keys(body).forEach(key => {
        formData.append(key, body[key]);
        });

      const response = await axios.post(`${import.meta.env.VITE_API_URL}${endPoint}`, body, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'accept': '*/*',
          'apiKey': import.meta.env.VITE_API_KEY,
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
      throw error;
    }
  };
  

export default networkCall;