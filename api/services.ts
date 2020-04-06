import { axiosInstance } from './axiosInstance';

import {
  userInfoRoute,
  recordsRoute,
  locationsRoute,
  heatMapRoute,
  heatMapSocialRoute,
} from './routes';

/**
 * Send user info.
 * https://apitester.com/shared/checks/e90f115a0899400ebad5adf7b6a8fe89
 *
 * @param reqData user information.
 */
export const postUserInfo = reqData => {
  return axiosInstance.post(userInfoRoute, reqData);
};

/**
 * Send recorded diagnostics.
 * https://apitester.com/shared/checks/19983961c32d41b7948cf41bba2ddf6d
 *
 * @param reqData Array of diagnostics.
 */
export const postRecords = reqData => {
  return axiosInstance.post(recordsRoute, reqData);
};

/**
 * Send recorded locations.
 * https://apitester.com/shared/checks/23e8408db7874a3595303e7797d6afb9
 *
 * @param reqData Array of locations and timestamps.
 */
export const postLocations = reqData => {
  return axiosInstance.post(locationsRoute, reqData);
};

/**
 * Get heatmap for a given location.
 * https://apitester.com/shared/checks/40f3cbe39aef402eb4ac9bddd1ee0aef
 *
 * @param reqData Current user location.
 */
export const getHeatmapData = reqData => {
  // return mockGetHeatmapData(reqData);
  return axiosInstance.post(heatMapRoute, reqData);
};

/**
 * Get heatmap social for a given location.
 *
 *
 * @param reqData Current user location.
 */
export const getHeatmapSocialData = reqData => {
  // return mockGetHeatmapData(reqData);
  return axiosInstance.post(heatMapSocialRoute, reqData);
};

/**
 *
 * DEV: Mocked responses
 *
 */

export const mockGetHeatmapData = reqData => {
  const mockedData = mockedHeatmapRespose(reqData);
  const mockedResponse = { data: mockedData };
  return new Promise(resolve => {
    setTimeout(() => resolve(mockedResponse), 2000);
  });
};

/**
 *
 * DEV: Mocked responses helpers
 *
 */

const randomPointAtDistance = (reqData, distance) => {
  const r = distance / 111300,
    y0 = reqData.lat,
    x0 = reqData.lng,
    u = Math.random(),
    v = Math.random(),
    w = r * Math.sqrt(u),
    t = 2 * Math.PI * v,
    x = w * Math.cos(t),
    y1 = w * Math.sin(t),
    x1 = x / Math.cos(y0),
    weight = Math.floor(Math.random() * 100);
  return { lat: y0 + y1, lng: x0 + x1, weight: weight };
};

// weight: Math.floor(Math.random() * Math.floor(5)),

const mockedHeatmapRespose = reqData => {
  const distance = 1000;
  const numberOfResults = 3;
  let arrayOfPositions = [];
  for (let i = 0; i < numberOfResults; i++) {
    arrayOfPositions.push(randomPointAtDistance(reqData, distance));
  }
  return arrayOfPositions;
};
