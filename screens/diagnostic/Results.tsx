import React, { useEffect, useState } from 'react';
import {
  Linking,
  Alert,
  Text,
  StyleSheet,
  Platform,
  View,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { ScrollView, RectButton } from 'react-native-gesture-handler';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { DiagnosticStackNavProps } from './types';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import { getPreferences } from '../../utils/config';

function PositiveResults() {
  const navigation = useNavigation();
  return (
    <>
      <Text style={[styles.cardTitle, { color: Colors.palette.positive }]}>
        RIESGO LEVE
      </Text>
      <Text style={styles.cardSubTitle}>
        Según pautas oficiales, el conjunto de tus sintomas e historia no
        implican contagio de coronavirus o alto riesgo.
      </Text>
      <Text style={styles.cardText}>
        Te proponemos realizar el aislamiento voluntario, repasando el listado
        de medidas preventivas y compartir esta información con tus allegados
        para así todos poder evitar el contagio
      </Text>
      <RectButton
        style={[styles.button, styles.activeButton, { width: '80%' }]}
        onPress={() => navigation.navigate('Prevention')}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          Consejos para la prevención
        </Text>
      </RectButton>
      <Text style={styles.cardText}>
        Si tus síntomas fueron cambiando, por favor volvé a realizar el
        autoevaluación y seguí las recomendaciones dadas.
      </Text>
      <RectButton
        style={[styles.button, styles.activeButton, { width: '80%' }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          Realizar evaluación nuevamente
        </Text>
      </RectButton>
    </>
  );
}
function NeutralResults() {
  const navigation = useNavigation();
  return (
    <>
      <Text style={[styles.cardTitle, { color: Colors.palette.neutral }]}>
        RIESGO MODERADO
      </Text>
      <Text style={styles.cardSubTitle}>
        Algunos de tus síntomas pueden estar asociados al contagio de
        coronavirus pero no son concluyentes para determinar si efectivamente
        estás infectado.
      </Text>
      <Text style={styles.cardText}>
        Te proponemos realizar el aislamiento voluntario, repasando el listado
        de medidas preventivas y compartir esta información con tus allegados
        para así todos poder evitar el contagio
      </Text>
      <RectButton
        style={[styles.button, styles.activeButton, { width: '80%' }]}
        onPress={() => navigation.navigate('Prevention')}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          Consejos para la prevención
        </Text>
      </RectButton>
      <Text style={styles.cardText}>
        Si tus síntomas fueron cambiando, por favor volvé a realizar el
        autoevaluación y seguí las recomendaciones dadas.
      </Text>
      <RectButton
        style={[styles.button, styles.activeButton, { width: '80%' }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          Realizar evaluación nuevamente
        </Text>
      </RectButton>
    </>
  );
}

function NegativeResults({ province }) {
  const navigation = useNavigation();
  const tel = province?.tel || '0800-222-1002';
  const extra = province?.extra;
  const name = province?.name || 'Ministerio de Salud';

  return (
    <>
      <Text style={[styles.cardTitle, { color: Colors.palette.negative }]}>
        EN RIESGO
      </Text>
      <Text style={styles.cardSubTitle}>
        Te aconsejamos consultar con un profesional de acuerdo a las
        indicaciones en tu ciudad.
      </Text>
      <Text style={styles.cardText}>
        Aquí podés conseguir ayuda para conseguir los números de organismos
        oficiales según tu zona, para orientarte sobre cómo proceder y recibir
        asistencia médica y psicológica.
      </Text>

      <View
        style={{
          padding: 25,
          marginTop: 20,
          borderRadius: 10,
          backgroundColor: '#fff',
          alignItems: 'center',
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
            android: {
              elevation: 5,
            },
          }),
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              color: Colors.primaryColor,
              fontSize: 20,
              fontWeight: '700',
              paddingTop: 5,
            }}
            onPress={async () => {
              try {
                await Linking.openURL(`tel:${tel}`);
              } catch (e) {
                Alert.alert('Error al intentar hacer la llamada');
              }
            }}
          >
            {tel}
          </Text>
        </View>
        <Text
          style={{
            // fontSize: 10,
            fontWeight: '300',
            paddingTop: 5,
          }}
        >
          {extra}
        </Text>
      </View>

      <Text style={styles.cardText}>
        Si tus síntomas fueron cambiando, por favor volvé a realizar el
        autoevaluación y seguí las recomendaciones dadas.
      </Text>
      <RectButton
        style={[styles.button, styles.activeButton, { width: '80%' }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          Realizar evaluación nuevamente
        </Text>
      </RectButton>
    </>
  );
}

// function ResultsContent({ color, title, subtitle, extraContent }) {
//   const navigation = useNavigation();
//   return (
//     <>
//       <Text style={[styles.cardTitle, { color }]}>{title}</Text>
//       <Text style={styles.cardSubTitle}>{subtitle}</Text>
//       {extraContent}
//       <RectButton
//         style={[styles.button, styles.activeButton, { width: '80%' }]}
//         onPress={() => navigation.navigate('Prevention')}
//       >
//         <Text style={[styles.buttonText, styles.activeButtonText]}>
//           Consejos para la prevención
//         </Text>
//       </RectButton>
//       <Text style={styles.cardSubTitle}>
//         {`Si tus síntomas fueron cambiando, por favor volvé a realizar el autoevaluación y seguí las recomendaciones dadas.`}
//       </Text>
//       <RectButton
//         style={[styles.button, styles.activeButton, { width: '80%' }]}
//         onPress={() => navigation.goBack()}
//       >
//         <Text style={[styles.buttonText, styles.activeButtonText]}>
//           Realizar evaluación nuevamente
//         </Text>
//       </RectButton>
//     </>
//   );
// }

const CIRCLE_WIDTH = Layout.window.width * 1.6;

export default function Results({
  route,
}: DiagnosticStackNavProps<'DiagnosticResults'>) {
  const { results } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      Platform.OS === 'android' &&
        StatusBar.setBackgroundColor(Colors.secondaryTextColor);
    }, []),
  );

  const [province, setProvince] = useState(null);

  useEffect(() => {
    async function loadData() {
      const preferences = await getPreferences();
      setProvince(preferences.userInfo.province);
    }
    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            {
              position: 'absolute',
              backgroundColor: '#fff',
              height: CIRCLE_WIDTH,
              width: CIRCLE_WIDTH,
              borderRadius: CIRCLE_WIDTH / 2,
              transform: [
                { translateX: -(Layout.window.width * 0.3) },
                { translateY: -(CIRCLE_WIDTH / 2) },
              ],
            },
          ]}
        />
        <View style={styles.card}>
          {results === 'positive' && <PositiveResults />}
          {results === 'neutral' && <NeutralResults />}
          {results === 'negative' && <NegativeResults province={province} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#eee',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  cardTitle: { fontSize: 24, padding: 10, fontWeight: '700' },
  cardSubTitle: {
    fontSize: 17,
    paddingTop: 20,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 23,
  },
  cardText: {
    fontSize: 14,
    paddingTop: 20,
    textAlign: 'center',
    fontWeight: '200',
    lineHeight: 18,
  },
  button: {
    flexDirection: 'row',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginVertical: 20,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  buttonText: {
    padding: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  activeButton: {
    backgroundColor: Colors.primaryColor,
  },
  activeButtonText: { color: '#fff' },
});
