
import axios from 'axios';

// Replace BASE_URL with your backend address, for example: http://192.168.1.10:5000
export const BASE_URL = 'http://REPLACE_WITH_BACKEND_IP:5000';

export async function getFields() {
  const res = await axios.get(BASE_URL + '/api/fields');
  return res.data;
}

export async function getLiveSensorData(fieldId) {
  const res = await axios.get(BASE_URL + `/api/fields/${fieldId}/sensors`);
  return res.data;
}

export async function triggerIrrigation(fieldId) {
  const res = await axios.post(BASE_URL + `/api/irrigate`, { fieldId });
  return res.data;
}
