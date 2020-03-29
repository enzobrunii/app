import axios from 'axios';
import getEnvVars from './environment';
import Constants from 'expo-constants';

const { apiUrl } = getEnvVars();

console.log('iid', Constants.installationId);

export const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: { 'X-CO-UUID': Constants.installationId },
});
