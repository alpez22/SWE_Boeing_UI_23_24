import axios from 'axios';

const API_URL = 'http://your_backend_api_url';

export const fetchLines = async () => {
  try {
    const response = await axios.get(`${API_URL}/lines`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch lines:', error);
    return [];
  }
};

export const updateLine = async (lineNum) => {
  try {
    const response = await axios.post(`${API_URL}/update-line`, { lineNum });
    return response.data;
  } catch (error) {
    console.error('Failed to update line:', error);
    throw error;
  }
};
