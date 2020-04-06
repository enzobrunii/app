import { Dimensions } from 'react-native';
import isEmpty from 'lodash/isEmpty';
import { getDistance } from 'geolib';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const HEATMAP_WEB_RADIUS = 100;
export const HEATMAP_WEB_OPACITY = 0.7;
export const HEATMAP_WEB_ZOOM = 15;

export const HEATMAP_GET_DATA_DISTANCE = 8000;

const HEATMAP_UPDATE_INTERVAL = 10; //seconds
const HEATMAP_UPDATE_DISTANCE = 100; //meters

const dataIsOld = (lastUpdated, updateInterval) => {
  const now = new Date().getTime();
  const diffTime = Math.abs(now - lastUpdated);
  if (diffTime > 1000 * updateInterval) {
    return true;
  }
  return false;
};

const locationIsFar = (previousLocation, updatedLocation) => {
  if (
    !previousLocation ||
    !updatedLocation ||
    getDistance(previousLocation, updatedLocation) > HEATMAP_UPDATE_DISTANCE
  ) {
    return true;
  }
  return false;
};

export const shouldUpdateHeatMap = (currentHeatmapData, updatedLocation) => {
  if (
    updatedLocation &&
    (isEmpty(currentHeatmapData) ||
      dataIsOld(currentHeatmapData.lastUpdated, HEATMAP_UPDATE_INTERVAL) ||
      locationIsFar(currentHeatmapData.center, updatedLocation))
  ) {
    return true;
  }
  return false;
};

//DEV Params

// Default location is Argentina's coords
export const DEFAULT_LOCATION = { latitude: -34.604476, longitude: -58.374188 };
export const DEFAULT_LOCATION_WEB = {
  lat: DEFAULT_LOCATION.latitude,
  lng: DEFAULT_LOCATION.longitude,
};

export const HEATMAP_HARDCODED_POSITIONS = [
  { lat: -34.612146, lng: -58.384734, weight: 80 },
  { lat: -34.609858, lng: -58.384788, weight: 100 },
  { lat: -34.604476, lng: -58.374188, weight: 60 },
];

export const HEATMAP_HARDCODED_MOBILE_POSITIONS = HEATMAP_HARDCODED_POSITIONS.map(
  item => ({
    latitude: item.lat,
    longitude: item.lng,
    weight: item.weight,
  }),
);

export const HEATMAP_HARDCODED_DATA_WEB = {
  positions: HEATMAP_HARDCODED_POSITIONS,
  options: {
    radius: HEATMAP_WEB_RADIUS,
    opacity: HEATMAP_WEB_OPACITY,
  },
};

export const heatmapInitialValues = {
  mapData: {
    positions: [],
    options: {
      radius: HEATMAP_WEB_RADIUS,
      opacity: HEATMAP_WEB_OPACITY,
    },
  },
  lastUpdated: undefined,
  center: undefined,
  isSocial: false,
};
