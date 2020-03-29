/* global google */
import React, { useState, useEffect, useRef } from 'react';
import { View, Button } from 'react-native';
import GoogleMapReact from 'google-map-react';
import { getHeatmapData } from '../../api/services';

import { useLocation } from '../../hooks/use-location';
import Constants from 'expo-constants';

import {
  shouldUpdateHeatMap,
  HEATMAP_WEB_ZOOM,
  HEATMAP_WEB_RADIUS,
  HEATMAP_WEB_OPACITY,
  HEATMAP_GET_DATA_DISTANCE,
  DEFAULT_LOCATION_WEB,
} from './mapConfig';

const heatmapInitialValues = {
  mapData: {
    positions: [],
    options: {
      radius: HEATMAP_WEB_RADIUS,
      opacity: HEATMAP_WEB_OPACITY,
    },
  },
  lastUpdated: undefined,
  center: undefined,
};

export default function Map({ navigation }) {
  const [heatmapData, setHeatmapData] = useState(heatmapInitialValues);
  const { location } = useLocation();

  const [coords, setCoords] = useState(
    location
      ? {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        }
      : DEFAULT_LOCATION_WEB,
  );

  useEffect(() => {
    if (location) {
      const locationCoords = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      if (shouldUpdateHeatMap(heatmapData, locationCoords)) {
        getHeatmapData({
          ...locationCoords,
          distance: HEATMAP_GET_DATA_DISTANCE,
        })
          .then(response => {
            const positions = response.data;
            const mapData = {
              positions: positions,
              options: {
                radius: HEATMAP_WEB_RADIUS,
                opacity: HEATMAP_WEB_OPACITY,
              },
            };
            const now = new Date().getTime();
            const heatmapData = {
              mapData: mapData,
              lastUpdated: now,
              center: locationCoords,
            };

            setCoords(locationCoords);
            setHeatmapData(heatmapData);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }, [location]);

  const MyPosition = () => (
    <div
      style={{
        backgroundColor: 'rgba(66, 135, 244, 1)',
        borderColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 10,
        height: 15,
        width: 15,
      }}
    ></div>
  );

  return (
    <View style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: `${Constants.manifest.extra.googleMapsWebApiKey}`,
        }}
        center={coords}
        zoom={HEATMAP_WEB_ZOOM}
        heatmapLibrary={true}
        heatmap={heatmapData.mapData}
        options={{ fullscreenControl: false, zoomControl: false }}
      >
        {location ? (
          <MyPosition
            lat={location.coords.latitude}
            lng={location.coords.longitude}
          />
        ) : null}
      </GoogleMapReact>
    </View>
  );
}
