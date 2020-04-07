import React, { useRef, useState, useEffect } from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  Modal
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE, Heatmap } from 'react-native-maps';
import SwipeablePanel from 'rn-swipeable-panel';
import { getHeatmapData, getHeatmapSocialData } from '../../api/services';

import { useLocation } from '../../hooks/use-location';
import Colors from '../../constants/Colors';

import { panelStyles, mapStyles } from './mapStyles';
import {
  shouldUpdateHeatMap,
  heatmapInitialValues,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  HEATMAP_WEB_RADIUS,
  HEATMAP_WEB_OPACITY,
  HEATMAP_GET_DATA_DISTANCE,
  DEFAULT_LOCATION,
} from './mapConfig';

function PanelContent() {
  return (
    <View style={panelStyles.panel}>
      <View style={{ paddingBottom: 20 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={panelStyles.panelTitle}>RECOPILANDO INFORMACIÓN</Text>
        </View>
        <Text style={panelStyles.panelSubtitle}>
          La aplicación se irá actualizando con los datos de ubicación y
          recorridos de personas confirmadas con el contagio
        </Text>
      </View>
      <Text style={panelStyles.panelSubtitle}>
        CoTrack utiliza tu ubicación para cruzar información de lugares y
        trayectos donde hayas estado, con las ubicaciones aproximadas de otros
        usuarios contagiados de coronavirus dentro de los últimos 14 días.
        {`\n\n`}Las coordenadas y horarios de localización se guardan en tu
        teléfono celular de manera encriptada. No hay ningún tipo de
        identificación con la cual se relacione ni a vos ni a tu dispositivo
        móvil con los datos de ubicación.{`\n\n`}La información de personas
        infectadas es provista por entes gubernamentales y nadie más que un
        organismo de salud puede certificar el contagio efectivo. El organismo
        preguntará al paciente si acepta compartir su información de ubicación
        de los últimos 14 días con motivo de ayudar a prevenir el contagio a
        otros usuarios. Sin embargo el paciente podrá optar por no hacerlo.
      </Text>
    </View>
  );
}

function PanelHeader(props) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      <TouchableWithoutFeedback {...props}>
        <View style={panelStyles.barContainer}>
          <View style={panelStyles.bar} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default function Map({ navigation }) {
  const { location, error } = useLocation({ runInBackground: true });
  const [mapReady, setMapReady] = useState(false);
  const [heatmapData, setHeatmapData] = useState(heatmapInitialValues);
  const [heatmapDataAux, setHeatmapDataAux] = useState(heatmapInitialValues);
  const [bottomPanel, setBottomPanel] = useState(true);
  const [isVisibleModalSocial, setIsVisibleModalSocial] = useState(false);

  const mapRef = useRef<MapView>();

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
            const mapData = positions.map(item => ({
              latitude: item.lat,
              longitude: item.lng,
              weight: item.weight,
            }));
            const now = new Date().getTime();
            const heatmapData = {
              mapData: mapData,
              lastUpdated: now,
              center: locationCoords,
              isSocial: false,
            };
            // setCoords({
            //   latitude: location.coords.latitude,
            //   longitude: location.coords.longitude,
            // });
            setHeatmapData(heatmapData);
          })
          .catch(error => {
            console.log(error);
          });

        getHeatmapSocialData({
          ...locationCoords,
          distance: HEATMAP_GET_DATA_DISTANCE,
        })
          .then(response => {
            const positions = response.data;

            const mapData = positions.map(item => ({
              latitude: item.lat,
              longitude: item.lng,
              weight: item.weight,
            }));
            const now = new Date().getTime();
            const heatmapData = {
              mapData: mapData,
              lastUpdated: now,
              center: locationCoords,
              isSocial: true,
            };

            setHeatmapDataAux(heatmapData);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }, [location]);

  return (
    <SafeAreaView style={[mapStyles.container]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        loadingEnabled
        initialRegion={
          location
            ? {
                ...location.coords,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }
            : undefined
        }
        initialCamera={{
          // center: coords,
          center: location ? location.coords : DEFAULT_LOCATION,
          pitch: 1,
          heading: 1,
          altitude: 11,
          zoom: 4,
        }}
        style={mapStyles.map}
        showsMyLocationButton={false}
        onMapReady={() => setMapReady(true)}
      >
        {heatmapData.mapData && heatmapData.mapData.length > 0 ? (
          <Heatmap
            points={heatmapData.mapData}
            radius={HEATMAP_WEB_RADIUS / 3}
            opacity={HEATMAP_WEB_OPACITY}
          />
        ) : null}
      </MapView>

      <View style={mapStyles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[mapStyles.button, mapStyles.locationButton]}
          onPress={() => navigation.navigate('Help')}
        >
          <Icon
            name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-help-circle-outline`}
            size={24}
            color="rgba(66,135,244,1)"
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            mapStyles.button,
            mapStyles.layerButton,
            { backgroundColor: heatmapData.isSocial ? 'green' : 'gray' },
          ]}
          onPress={() => {
            !heatmapData.isSocial && setIsVisibleModalSocial(true);

            setHeatmapData(heatmapInitialValues);

            setTimeout(() => {
              const aux = heatmapData;
              setHeatmapData(heatmapDataAux);
              setHeatmapDataAux(aux);
            }, 500);
          }}
        >
          <Icon
            name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-people`}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[mapStyles.button, mapStyles.infoButton]}
          disabled={!location}
          onPress={() =>
            mapRef.current.animateToRegion({
              ...location.coords,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            })
          }
        >
          <Icon
            name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-locate`}
            size={24}
            color={!location ? Colors.tabIconDefault : 'rgba(66, 135, 244, 1)'}
          />
        </TouchableOpacity>
      </View>
      <PanelHeader onPress={() => setBottomPanel(true)} />
      <SwipeablePanel
        isActive={bottomPanel}
        onClose={() => setBottomPanel(false)}
        onPressCloseButton={() => setBottomPanel(false)}
        showCloseButton
        >
  			<PanelContent />
  		</SwipeablePanel>
      <Modal
        animationType="slide"
        transparent={true}
        presentationStyle="overFullScreen"
        visible={isVisibleModalSocial}
      >
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', margin: 20 }}>
          <Text style={mapStyles.modalTitle}>Datos Comunitarios</Text>
          <Text
            style={[
              mapStyles.modalBody,
              {
                borderRightWidth: 0,
                borderLeftWidth: 0,
                borderWidth: 0,
                textAlign: 'center'
              },
            ]}
          >
            Los datos que estarás viendo ahora son datos reportados
            voluntariamente. No son datos oficiales!
          </Text>
          <View style={{ backgroundColor: 'white' }}>
            <TouchableOpacity onPress={() => setIsVisibleModalSocial(false)}>
              <View style={mapStyles.modalButton}>
                <Text style={{ color: 'white' }}>Aceptar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
