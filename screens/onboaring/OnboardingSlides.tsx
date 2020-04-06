import React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import Constants from 'expo-constants';
import { StyleSheet, View, Image, Text } from 'react-native';
import { savePreferences, getPreferences } from '../../utils/config';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import { MainStackNavProps } from '../../navigation/types';
import { pageHit } from '../../utils/analytics';

const slides = [
  {
    key: 'slide1',
    text:
      'CoTrack necesita saber tu ubicación para avisarte en tiempo real si en tu recorrido estuviste en contacto cercano con alguna persona contagiada',
    image: require('../../assets/images/prevention/spread.png'),
    backgroundColor: '#fff',
  },
  {
    key: 'slide2',
    text:
      'Si presentás síntomas o creés haber estado en contacto con alguien infectado, CoTrack te puede ayudar a realizar un diagnóstico y aconsejarte qué hacer según el resultado',
    image: require('../../assets/images/prevention/fever.png'),
    backgroundColor: '#fff',
  },
  {
    key: 'slide3',
    text:
      'CoTrack te brinda información completa y confiable para ayudar a prevenir la infección, medidas para resguardarse e información útil y actualizada',
    image: require('../../assets/images/prevention/washing.png'),
    backgroundColor: '#fff',
  },
  // {
  //   key: 'somethun4',
  //   text:
  //     'CoTrack no envía datos privados ni requiere que te identifiques, tan sólo saber tu ubicación, la cual también podés decidir si compartirla o no en caso de contagio',
  //   image: require('../../assets/images/prevention/warning.png'),
  //   backgroundColor: '#fff',
  // },
];

export const OnboardingSlides = ({ navigation }: MainStackNavProps<'Help'>) => {
  const renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={{ flex: 2, alignItems: 'center' }}>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const handleDone = async () => {
    const preferences = await getPreferences();
    await savePreferences({ showOnboarding: false });
    navigation.navigate(
      preferences.userInfo &&
        preferences.userInfo.acceptedTerms ===
          Constants.manifest.extra.termsVersion
        ? 'Main'
        : 'UserInfo',
    );
  };
  return (
    <AppIntroSlider
      nextLabel="Siguiente"
      prevLabel="Anterior"
      doneLabel="Finalizar"
      renderItem={renderItem}
      showPrevButton
      // @ts-ignore
      buttonTextStyle={styles.buttonText}
      activeDotStyle={styles.activeDot}
      slides={slides}
      onLoad={pageHit(`Slide1`)}
      onSlideChange={index => {
        pageHit(`Slide${index}`);
      }}
      onDone={handleDone}
      contentContainerStyle={{
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: Layout.maxWidth,
    width: '100%',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  image: {
    width: 256,
    height: 256,
  },
  text: {
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
    padding: 20,
    fontWeight: '200',
  },
  buttonText: {
    color: Colors.primaryColor,
  },
  activeDot: {
    backgroundColor: Colors.primaryColor,
  },
});
