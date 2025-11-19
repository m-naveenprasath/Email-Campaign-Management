import axios from 'axios';

const API = axios.create({
  baseURL: 'https://130.211.206.150/api/', // adjust if your backend URL differs
});

// Campaign APIs
export const fetchCampaigns = () => API.get('campaigns/dashboard');
export const createCampaign = (data) => API.post('campaigns/', data);
export const scheduleCampaign = (id) => API.post(`campaigns/${id}/schedule/`);
export const rescheduleCampaign = (id, scheduled_time) => API.post(`campaigns/${id}/reschedule/`, { scheduled_time });
export const deleteCampaign = (id) => API.delete(`campaigns/${id}/`);
export const updateCampaign = (id, payload) => API.put(`campaigns/${id}/`, payload);


// Recipient APIs
export const fetchRecipients = () => API.get('recipients/');
export const bulkUploadRecipients = (formData) => API.post('recipients/bulk_upload/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
// Create Recipient
export const createRecipient = (data) =>
  API.post('recipients/', data);

// Update Recipient
export const updateRecipient = (id, data) =>
  API.put(`recipients/${id}/`, data);

// Delete Recipient
export const deleteRecipient = (id) =>
  API.delete(`recipients/${id}/`);


// Delivery Logs
export const fetchDeliveryLogs = () => API.get('delivery-logs/');
export const fetchDeliveryLogsId = (campaignId) => API.get(`delivery-logs/?campaign_id=${campaignId}`);
