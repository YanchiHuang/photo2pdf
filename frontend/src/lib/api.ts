import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const uploadImages = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const response = await axios.post(`${API_URL}/upload`, formData);
    return response.data.files;
};

export const generatePdf = async (images: string[], options: any) => {
    const response = await axios.post(`${API_URL}/generate-pdf`, { images, options });
    return response.data;
};
