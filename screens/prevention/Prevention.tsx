import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import {
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Layout from '../../constants/Layout';
import { PreventionItem, PreventionStackNavProps } from './types';
import { SharedElement } from 'react-navigation-shared-element';

const data: PreventionItem[] = [
  {
    id: '1',
    title: '¿Qué es el coronavirus?',
    shortText:
      'También llamado COVID-19, es una enfermedad infecciosa causada por un nuevo virus que no había sido detectado en humanos hasta la fecha.',
    longText:
      'También llamado COVID-19, es una enfermedad infecciosa causada por un nuevo virus que no había sido detectado en humanos hasta la fecha.\n\nEl virus causa una complicación respiratoria como la gripe, similar a la Influenza, junto con diversos síntomas, que en casos graves pueden producir neumonía e incluso, la muerte.',
    image: require('../../assets/images/prevention/coronavirus.png'),
  },
  {
    id: '2',
    title: '¿Cuáles son los síntomas?',
    shortText:
      'Los síntomas más comunes del contagio de coronavirus son fiebre, tos y dolor de garganta.',
    longText:
      'Los síntomas más comunes del contagio de coronavirus son fiebre, tos y dolor de garganta.\n\nEn algunos casos puede provocar dificultades respiratorias severas, requiriendo hospitalización.',
    image: require('../../assets/images/prevention/fever.png'),
  },
  {
    id: '3',
    title: '¿Cómo se propaga?',
    shortText:
      'La principal vía para la diseminación del virus es la exposición ante una persona infectada mediante el estornudo o tos y también por la circulación de objetos contaminados, donde el virus permanece un tiempo variable según su material.',
    longText:
      'La principal vía para la diseminación del virus es la exposición ante una persona infectada mediante el estornudo o tos y también por la circulación de objetos contaminados, donde el virus permanece un tiempo variable según su material.\n\nEstas pequeñas partículas pueden llegar a la boca o la nariz de las personas que se encuentren en contacto o posiblemente entrar a los pulmones al respirar.',
    image: require('../../assets/images/prevention/spread.png'),
  },
  {
    id: '4',
    title: '¿Cómo podemos protegernos?',
    shortText:
      'La principal vía de contagio es a través de las manos, tocando un objeto contaminado y llevándose las manos a la boca y ojos.',
    longText:
      'La principal vía de contagio es a través de las manos, tocando un objeto contaminado y llevándose las manos a la boca y ojos.\n\nEsta epidemia requiere que colaboremos con medidas simples, que apuntan a disminuir la probabilidad de contagio entre las personas.\n\nSEPARACIÓN SOCIAL: Tratá de mantener siempre una distancia mayor a 1 metro con los demás.\n\nCONTACTO CORPORAL: Evitá tocar las manos o la cara para saludar o interactuar con otras personas.\n\nAGLOMERACIONES: Evitá concurrir a lugares donde puedas estar en contacto con más de 20 personas.\n\nAUTO AISLAMIENTO: El auto aislamiento, o cuarentena voluntaria, ayuda a que el sistema de salud no colapse si en caso de contagio múltiple, se deba atender a varias personas a la vez.\n\nSi tenés síntomas de gripe quedate en tu casa, no concurras a tu trabajo o a lugares públicos. Consultá a las líneas de atención profesional para saber cómo proceder.',
    image: require('../../assets/images/prevention/transmission.png'),
  },
  {
    id: '5',
    title: '¿Cómo ayuda la higiene?',
    shortText:
      'Mantené la limpieza, principalmente de las superficies donde usás las manos (picaportes, canillas, teclados, asas, etc).',
    longText:
      'Mantené la limpieza, principalmente de las superficies donde usás las manos (picaportes, canillas, teclados, asas, etc).\n\nTambién mantené tus manos limpias. Evitá tocarte la cara.\n\nCubrite con el pliegue del codo y no con las manos al estornudar.',
    image: require('../../assets/images/prevention/hygiene.png'),
  },
  {
    id: '6',
    title: '¿Cuándo es aconsejable consultar?',
    shortText:
      'Ante la presencia de fiebre y síntomas respiratorios como tos, dolor de garganta, dificultad para respirar y haber permanecido en áreas con circulación del virus o al haber estado en contacto con un caso confirmado o probable.',
    longText:
      'Ante la presencia de fiebre y síntomas respiratorios como tos, dolor de garganta, dificultad para respirar y haber permanecido en áreas con circulación del virus o al haber estado en contacto con un caso confirmado o probable.\nSe insta a la población a que se comunique de inmediato con el sistema de salud, refiera el antecedente de viaje y evite el contacto social.',
    image: require('../../assets/images/prevention/travel.png'),
  },
  {
    id: '7',
    title: '¿Cuándo hacer cuarentena?',
    shortText:
      'Hasta el día 12/04 la cuarentena es obligatoria para todos, salvo actividades exceptuadas.',
    longText:
      'Hasta el día 12/04 la cuarentena es obligatoria para todos, salvo actividades exceptuadas.\nPara aquellas personas exceptuadas, se recomienda mantener el distanciamiento social y extremar medidas de higiene.',
    image: require('../../assets/images/prevention/quarantine.png'),
  },
];

export default function Prevention({
  navigation,
}: PreventionStackNavProps<'Prevention'>) {
  const renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback
        containerStyle={{ flexDirection: 'row' }}
        onPress={() =>
          navigation.navigate('PreventionDetail', {
            item,
          })
        }
      >
        <View style={styles.card}>
          {Platform.OS === 'web' ? (
            <Image
              source={item.image}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <SharedElement id={item.id}>
              <Image
                source={item.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </SharedElement>
          )}
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardText}>{item.shortText}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        contentContainerStyle={{ justifyContent: 'center' }}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
  },
  card: {
    flex: 1,
    width: Layout.window.width / 2 - 15,
    backgroundColor: '#fff',
    padding: 20,
    margin: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardImage: { width: 100, height: 100, alignSelf: 'center' },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    paddingVertical: 10,
  },
  cardText: {
    fontSize: 13,
    fontWeight: '200',
  },
});
