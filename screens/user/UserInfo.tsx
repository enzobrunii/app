import React, { useReducer, useRef, useEffect, useState } from 'react';
import {
  Linking,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Image,
  CheckBox,
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import moment from 'moment';
import { MainStackNavProps } from '../../navigation/types';
import Touchable from '../../components/Touchable';
import Colors from '../../constants/Colors';
import { savePreferences, getPreferences } from '../../utils/config';
import RadioButtons from '../../components/RadioButtons';
import DatePicker from '../../components/DatePicker';
import ProvincePicker from '../../components/ProvincePicker';
import { syncUserInfoDataWithServer } from '../../utils/syncStorageHelper';

import { mapStyles } from '../map/mapStyles';

function reducer(state, newState) {
  return { ...state, ...newState };
}

const UserInfo = ({ navigation }: MainStackNavProps<'UserInfo'>) => {
  const [state, setState] = useReducer(reducer, {});
  const [canSave, setCanSave] = useState(false);
  const [isVisibleModalDni, setIsVisibleModalDni] = useState(false);

  const [selectedProvince, setSelectedProvince] = useState(0);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      const preferences = await getPreferences();
      if (preferences.userInfo) {
        preferences.userInfo.terms = false;
        preferences.userInfo.province &&
          setSelectedProvince(preferences.userInfo.province.id);
      }
      setState(preferences.userInfo);
      setLoaded(true);
    }
    loadData();
  }, []);

  const handleChange = key => value => {
    setState({ [key]: value });
  };

  const handleOpenLink = url => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  useEffect(() => {
    if (
      (state.phoneNumber || '') !== '' &&
      (state.email || '') !== '' &&
      (state.gender || '') !== '' &&
      (state.province || '') !== '' &&
      (state.dni || '') !== '' &&
      (state.terms || '') !== '' &&
      isValidDate()
    ) {
      setCanSave(true);
    } else {
      setCanSave(false);
    }
  }, [state]);

  function isValidDate() {
    if ((state.dob || '') === '') {
      return false;
    }
    return moment(state.dob, 'D/M/YYYY', true).isValid();
  }
  async function handleContinue() {
    state.acceptedTerms = Constants.manifest.extra.termsVersion;
    await savePreferences({ userInfo: state });
    syncUserInfoDataWithServer();
    navigation.navigate('Main');
  }

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View
          style={{
            marginTop: 22,
            position: 'absolute',
            top: '20%',
            zIndex: 99999,
            display:
              Platform.OS === 'web' && !isVisibleModalDni ? 'none' : null,
          }}
        >
          <Modal
            animationType="slide"
            transparent={true}
            presentationStyle="overFullScreen"
            visible={isVisibleModalDni}
            style={Platform.OS === 'web' ? { borderWidth: 0 } : undefined}
          >
            <View
              style={{ marginTop: 15, width: '90%', marginHorizontal: '5%' }}
            >
              <Text style={mapStyles.modalTitle}>
                ¿Por qué pedimos estos datos?
              </Text>
              <View style={[mapStyles.modalBody]}>
                <Text style={{ textAlign: 'left' }}>
                  La información que generamos entre todos sobre nuestros
                  síntomas es utilizada por las autoridades nacionales y
                  provinciales para predecir y monitorear brotes de COVID-19.
                  {'\n\n'}
                  En caso de ser necesario por tus síntomas o a criterio de
                  gobierno, deben poder contactarte para coordinar que te
                  realices un test. {'\n\n'}
                  Tu información GPS se almacena en tu telefono y solamente se
                  comparte si vos lo decidís.{'\n\n'}
                  <Text style={{ marginTop: 15 }}>
                    Te pedimos leas los{' '}
                    <Text
                      onPress={() =>
                        handleOpenLink('https://cotrack.social/tyc.html')
                      }
                      style={{
                        color: Colors.primaryColor,
                        textDecorationLine: 'underline',
                        marginTop: 15,
                      }}
                    >
                      Términos y Condiciones de Uso
                    </Text>{' '}
                    y las{' '}
                    <Text
                      onPress={() =>
                        handleOpenLink('https://cotrack.social/faq.html')
                      }
                      style={{
                        color: Colors.primaryColor,
                        textDecorationLine: 'underline',
                        marginTop: 15,
                      }}
                    >
                      Preguntas Frecuentes
                    </Text>{' '}
                    disponibles en{' '}
                    <Text
                      onPress={() => handleOpenLink('https://cotrack.social/')}
                      style={{
                        color: Colors.primaryColor,
                        textDecorationLine: 'underline',
                        marginTop: 15,
                      }}
                    >
                      https://cotrack.social/
                    </Text>{' '}
                    para más detalle
                  </Text>
                </Text>
              </View>
              <View style={mapStyles.modalButtonContainer}>
                <TouchableOpacity onPress={() => setIsVisibleModalDni(false)}>
                  <View style={mapStyles.modalButton}>
                    <Text style={{ color: 'white' }}>Aceptar</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
        <View
          style={{
            flex: 1,
            padding: 20,
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            style={{
              flex: 1,
              justifyContent: 'flex-start',
            }}
          >
            <Text style={styles.text}>
              Necesitamos algunos datos tuyos para poder realizar un diagnóstico
              más preciso y contactarte si necesitas ayuda.
            </Text>

            <ProvincePicker
              label="Provincia"
              onChange={handleChange('province')}
              value={state.province}
            />

            <TextInput
              placeholder="DNI"
              value={state.dni}
              onChangeText={handleChange('dni')}
              keyboardType="phone-pad"
              style={styles.input}
              blurOnSubmit
            />
            <View style={[styles.input, { borderWidth: 0 }]}>
              <RadioButtons
                label="Sexo"
                options={[
                  {
                    key: 'M',
                    text: 'Masculino',
                  },
                  {
                    key: 'F',
                    text: 'Femenino',
                  },
                ]}
                value={state.gender}
                onChange={handleChange('gender')}
              />
            </View>

            <DatePicker
              label="Fecha de Nacimiento"
              onChange={handleChange('dob')}
              value={state.dob}
            />

            <TextInput
              placeholder="Email"
              value={state.email}
              onChangeText={handleChange('email')}
              keyboardType="email-address"
              style={styles.input}
              blurOnSubmit
            />

            <TextInput
              placeholder="# Celular"
              value={state.phoneNumber}
              onChangeText={handleChange('phoneNumber')}
              keyboardType="phone-pad"
              style={styles.input}
              blurOnSubmit
            />

            <Text
              onPress={() => setIsVisibleModalDni(true)}
              style={{
                color: Colors.primaryColor,
                textDecorationLine: 'underline',
                marginTop: 15,
              }}
            >
              ¿Por qué pedimos estos datos?
            </Text>

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <CheckBox
                value={state.terms}
                onValueChange={handleChange('terms')}
              />
              <Text style={{ marginTop: 0, marginBottom: 20 }}>
                {' '}
                He leído y acepto los{' '}
                <Text
                  onPress={() =>
                    handleOpenLink('https://cotrack.social/tyc.html')
                  }
                  style={{
                    color: Colors.primaryColor,
                    textDecorationLine: 'underline',
                    marginTop: 15,
                  }}
                >
                  términos y condiciones
                </Text>
              </Text>
            </View>
            <Touchable
              enabled={canSave}
              style={[
                styles.button,
                styles.activeButton,
                { width: undefined, margin: 10 },
                !canSave && { backgroundColor: '#ccc' },
              ]}
              onPress={handleContinue}
            >
              <Text style={[styles.buttonText, styles.activeButtonText]}>
                Continuar
              </Text>
            </Touchable>
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
              <Text style={styles.footerText}>
                Gestionamos tu información de forma segura y para uso exclusivo
                oficial.
              </Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'scroll',
    maxHeight: '100%',
  },
  logo: {
    width: 150,
    height: 100,
  },
  text: {
    fontSize: 14,
    fontWeight: '300',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '200',
    textAlign: 'center',
  },
  input: {
    marginTop: 20,
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  button: {
    flexDirection: 'row',
    minHeight: 50,
    width: '49%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
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

export default UserInfo;
