import { postRecords, postUserInfo } from '../api/services';
import {
  getLocalDiagnostics,
  deleteLocalDiagnostics,
} from './localStorageHelper';
import { getPreferences, savePreferences } from '../utils/config';

export async function syncLocalDataWithServer() {
  syncUserInfoDataWithServer();
  syncRecordsDataWithServer();
}

export async function syncUserInfoDataWithServer() {
  try {
    const preferences = await getPreferences();
    const userInfo = preferences.userInfo;
    if (userInfo && !userInfo.infoSent) {
      await postUserInfo(userInfo);
      userInfo.infoSent = true;
      await savePreferences({ userInfo: userInfo });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function syncRecordsDataWithServer() {
  try {
    const diagnostics = await getLocalDiagnostics();
    if (diagnostics && diagnostics.length) {
      await postRecords(diagnostics);
      await deleteLocalDiagnostics();
    }
  } catch (error) {
    console.log(error);
  }
}
