import React, { useReducer, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInputMask } from 'react-native-masked-text';
import moment from 'moment';
import { MainStackNavProps } from '../../navigation/types';
import Touchable from '../../components/Touchable';
import Colors from '../../constants/Colors';
import { savePreferences } from '../../utils/config';
import RadioButtons from '../../components/RadioButtons';
import DatePicker from '../../components/DatePicker';
import { syncUserInfoDataWithServer } from '../../utils/syncStorageHelper';

import SearchableDropdown from 'react-native-searchable-dropdown';
import { provinces } from '../../utils/data';

function reducer(state, newState) {
  return { ...state, ...newState };
}

const UserInfo = ({ navigation }: MainStackNavProps<'UserInfo'>) => {
  const [state, setState] = useReducer(reducer, {});
  const [canSave, setCanSave] = useState(false);

  const handleChange = key => value => {
    setState({ [key]: value });
  };

  useEffect(() => {
    if (
      (state.phoneNumber || '') !== '' &&
      (state.gender || '') !== '' &&
      (state.province || '') !== '' &&
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
    await savePreferences({ userInfo: state });
    syncUserInfoDataWithServer();

    navigation.navigate('Main');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, padding: 20, alignItems: 'center' }}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, justifyContent: 'flex-start' }}
        >
          <Text style={styles.text}>
            Necesitamos algunos datos tuyos para poder realizar un diagnóstico
            más preciso y contactarte si necesitas ayuda.
          </Text>
          <SearchableDropdown
            onTextChange={text => console.log(text)}
            //On text change listner on the searchable input
            // onItemSelect={item => alert(JSON.stringify(item))}
            onItemSelect={handleChange('province')}
            //onItemSelect called after the selection from the dropdown
            containerStyle={{ marginTop: 20, padding: 0 }}
            //suggestion container style
            textInputStyle={{
              //inserted text style
              padding: 10,
              borderWidth: 1,
            }}
            itemStyle={{
              //single dropdown item style
              padding: 10,
              marginTop: 2,
              backgroundColor: '#FAF9F8',
              borderColor: '#bbb',
              borderWidth: 1,
            }}
            itemTextStyle={{
              //single dropdown item's text style
              color: '#222',
            }}
            itemsContainerStyle={
              {
                //items container style you can pass maxHeight
                //to restrict the items dropdown hieght
                // maxHeight: '30vw',
              }
            }
            items={provinces}
            //mapping of item array
            // defaultIndex={2}
            //default selected item index
            placeholder="Provincia"
            //place holder for the search input
            resetValue={false}
            //reset textInput Value with true and false state
            underlineColorAndroid="transparent"
            //To remove the underline from the android input
          />

          <TextInput
            placeholder="# Celular"
            value={state.phoneNumber}
            onChangeText={handleChange('phoneNumber')}
            keyboardType="phone-pad"
            style={styles.input}
            blurOnSubmit
          />
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
            onChange={handleChange('gender')}
          />
          <DatePicker
            label="Fecha de Nacimiento"
            onChange={handleChange('dob')}
          />
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
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={styles.footerText}>
              Gestionamos tu información de forma segura y para uso exclusivo
              oficial.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
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
    marginVertical: 20,
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
