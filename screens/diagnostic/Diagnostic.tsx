import React, { useReducer, useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Platform,
  ScrollView,
  StatusBar,
  Picker,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import * as Location from 'expo-location';

import { QuestResults } from './types';
import Colors from '../../constants/Colors';
import { formatAge } from '../../utils/forms';
import Touchable from '../../components/Touchable';
import { saveDiagnosticLocally } from '../../utils/localStorageHelper';
import { syncRecordsDataWithServer } from '../../utils/syncStorageHelper';

const initialState = {
  age: '',
  symptoms: {},
  questions: {},
  medicalHistory: {},
};

function reducer(state, newState) {
  return { ...state, ...newState };
}

function QuestButton({ id, text, onPress, selected }) {
  const isSelected = selected[id] === 'yes';

  const handlePress = () => {
    onPress(id);
  };

  return (
    <Touchable
      style={[styles.button, isSelected && styles.activeButton]}
      onPress={handlePress}
    >
      <Text style={[styles.buttonText, isSelected && styles.activeButtonText]}>
        {text}
      </Text>
    </Touchable>
  );
}

function YesNoButtons({ id, onPress, state }) {
  const isYes = state[id] === 'yes';
  const isNo = state[id] === 'no';

  const handleYesPress = () => {
    onSelect('yes');
  };
  const handleNoPress = () => {
    onSelect('no');
  };

  const onSelect = (value) => {
    const newState = { ...state, [id]: value };
    onPress(newState);
  };

  return (
    <>
      <Touchable
        style={[styles.button, isYes && styles.activeButton]}
        onPress={handleYesPress}
      >
        <Text style={[styles.buttonText, isYes && styles.activeButtonText]}>
          Si
        </Text>
      </Touchable>
      <Touchable
        style={[styles.button, isNo && styles.activeButton]}
        onPress={handleNoPress}
      >
        <Text style={[styles.buttonText, isNo && styles.activeButtonText]}>
          No
        </Text>
      </Touchable>
    </>
  );
}

function TempPicker({ onChange, value }) {
  let defaultValue = { temp1: 37, temp2: 5 };

  if (value) {
    try {
      const v = value.split('.');
      defaultValue.temp1 = parseInt(v[0]);
      defaultValue.temp2 = parseInt(v[1]);
    } catch (e) {}
  }
  const [internalValue, setInternalValue] = useState(defaultValue);

  const handleChange = (key) => (val) => {
    internalValue[key] = val;
    setInternalValue(internalValue);
    onChange(`${internalValue.temp1}.${internalValue.temp2}`);
  };

  const arrTemp1 = Array.from(Array(10).keys()).map((e, i) => (
    <Picker.Item key={i + 34} label={`${i + 34}`} value={i + 34} />
  ));
  const arrTemp2 = Array.from(Array(10).keys()).map((e, i) => (
    <Picker.Item key={i + 1} label={`${i}`} value={i} />
  ));
  const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: 15,
      marginTop: 15,
    },
  });
  return (
    <View style={styles.buttonContainer}>
      <Picker
        // id="day"
        selectedValue={internalValue.temp1}
        onValueChange={handleChange('temp1')}
        style={{
          width: '25%',
          marginLeft: 'auto',
        }}
        mode="dropdown"
      >
        {arrTemp1}
      </Picker>
      <Text>.</Text>
      <Picker
        // id="month"
        selectedValue={internalValue.temp2}
        onValueChange={handleChange('temp2')}
        style={{ width: '20%' }}
        mode="dropdown"
      >
        {arrTemp2}
      </Picker>
    </View>
  );
}

interface QuestionaryProps {
  onShowResults: (value: QuestResults) => void;
}

function Questionary({ onShowResults }: QuestionaryProps) {
  const [state, setState] = useReducer(reducer, initialState);
  const [disabled, setDisabled] = useState(true);
  const [positiveTravelContact, setPositiveTravelContact] = useState(false);
  const [positiveExtraConditions, setpositiveExtraConditions] = useState(false);

  const onSelectSymptoms = useCallback(
    (id) => {
      const newSelected = {
        ...state.symptoms,
        [id]: state.symptoms[id] === 'yes' ? 'no' : 'yes',
      };
      setState({ symptoms: newSelected });
    },
    [state.symptoms],
  );

  const onSelectMedicalHistory = useCallback(
    (id) => {
      const newSelected = {
        ...state.medicalHistory,
        [id]: state.medicalHistory[id] === 'yes' ? 'no' : 'yes',
      };
      setState({ medicalHistory: newSelected });
    },
    [state.medicalHistory],
  );

  const handleChangeAge = (age) => {
    setState({ age: formatAge(age) });
  };

  useEffect(() => {
    const hasAnswers = Object.keys(state.questions);
    const hasPositiveAnswers =
      hasAnswers.filter((k) => state.questions[k] === 'yes').length >= 1;
    const hasPositiveConditions =
      Object.keys(state.medicalHistory).filter(
        (k) => state.medicalHistory[k] === 'yes',
      ).length >= 1;

    setDisabled(!(hasAnswers.length >= 3));
    setPositiveTravelContact(!!hasPositiveAnswers);
    setpositiveExtraConditions(!!hasPositiveConditions);
  }, [state]);

  const handleShowResults = (result) => {
    onShowResults(result);
    // scrollRef.current.scrollTo({ x: 0, animated: false });
  };

  const handlePress = async () => {
    let result: QuestResults;

    function hasExtraConditions() {
      if (parseInt(state.age) >= 60 || positiveExtraConditions) {
        result = 'negative';
      } else {
        result = 'neutral';
      }
    }

    if (state.symptoms['fever'] === 'yes' && positiveTravelContact) {
      if (
        state.symptoms['cough'] === 'yes' ||
        state.symptoms['throat'] === 'yes' ||
        state.symptoms['breath'] === 'yes'
      ) {
        if (state.symptoms['breath'] === 'yes') {
          result = 'negative';
        } else {
          hasExtraConditions();
        }
      } else {
        result = 'positive';
      }
    } else {
      result = 'positive';
    }

    let location;
    try {
      location = await Location.getLastKnownPositionAsync();
    } catch (e) {
      console.log('Could not get last known location', e);
      location = '';
    }

    saveDiagnosticLocally(state, result, location, () => {
      handleShowResults(result);
      syncRecordsDataWithServer();
    });
  };

  const handleYesNoPress = (values) => {
    setState({ questions: values });
  };

  const scrollRef = React.useRef<ScrollView | null>(null);

  useScrollToTop(scrollRef);

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.questContainer}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
      >
        <Text style={styles.title}>
          Si tenés algún malestar y pensás que puede estar ligado al contagio de
          coronavirus, podemos realizar un{' '}
          <Text style={{ fontWeight: '700' }}>
            auto-evaluación de detección temprana
          </Text>{' '}
          respondiendo una serie de preguntas, detallando los síntomas que estás
          teniendo y si creés haber estado en contacto con alguien infectado.
        </Text>
        <Text style={styles.section}>Edad</Text>
        <TextInput
          placeholder="¿Cual es tu edad?"
          value={state.age}
          onChangeText={handleChangeAge}
          keyboardType="phone-pad"
          style={styles.input}
          blurOnSubmit
        />
        <Text style={styles.section}>Dolencias y síntomas</Text>
        <View style={styles.questButtons}>
          <QuestButton
            id="fever"
            text="Fiebre"
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="cough"
            text="Tos seca"
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="throat"
            text="Dolor de garganta"
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="breath"
            text="Dificultad para respirar"
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="headache"
            text="Dolor de cabeza"
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="diarrhea"
            text="Descompostura o diarrea"
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="tiredness"
            text="Cansancio general"
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
        </View>
        {state.symptoms && state.symptoms.fever === 'yes' && (
          <>
            <Text style={styles.section}>Temperatura Corporal</Text>
            <TempPicker
              value={state.temperature}
              onChange={(val) => setState({ temperature: val })}
            />
          </>
        )}
        <Text style={styles.section}>Viajes o contactos confirmados</Text>
        <Text style={styles.subtitle}>
          ¿Estuviste en contacto con algún caso confirmado de Coronavirus, en
          los ultimos 14 días?
        </Text>
        <View style={styles.questButtons}>
          <YesNoButtons
            id="confirmedContact"
            onPress={handleYesNoPress}
            state={state.questions}
          />
        </View>
        <Text style={styles.subtitle}>
          ¿Estuviste de viaje fuera del país, en los ultimos 14 días?
        </Text>
        <View style={styles.questButtons}>
          <YesNoButtons
            id="suspectedOutside"
            onPress={handleYesNoPress}
            state={state.questions}
          />
        </View>
        <Text style={styles.subtitle}>
          ¿Estuviste en alguna Provincia con casos locales de Coronavirus, en
          los ultimos 14 días?
        </Text>
        <View style={styles.questButtons}>
          <YesNoButtons
            id="suspectedInside"
            onPress={handleYesNoPress}
            state={state.questions}
          />
        </View>
        <Text style={styles.section}>Antecedentes medicos</Text>
        <View style={styles.questButtons}>
          <QuestButton
            id="immunosuppression"
            text="Inmunosupresión"
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="diabetes"
            text="Diabetes"
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="cancer"
            text="Cáncer"
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="hepatic"
            text="Enfermedad hepática"
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="pregnant"
            text="Embarazo"
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="newborn"
            text="Recién nacido con síntomas"
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="respiratoryDisease"
            text="Enfermedad respiratoria (Asma, EPOC)"
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="kidneyDisease"
            text="Enfermedad Renal Crónica"
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="cardiologicalDisease"
            text="Enfermedad cardiológica (HTA)"
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
        </View>
      </ScrollView>
      <Touchable
        enabled={!disabled}
        style={[
          styles.button,
          styles.activeButton,
          { width: undefined, margin: 10 },
          disabled && { backgroundColor: '#ccc' },
        ]}
        onPress={handlePress}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          REALIZAR EVALUACIÓN
        </Text>
      </Touchable>
    </>
  );
}

export default function Diagnostic({ navigation }) {
  const onShowResults = (value: QuestResults) => {
    navigation.navigate('DiagnosticResults', {
      results: value,
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Questionary onShowResults={onShowResults} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  questContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  questButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  title: { paddingTop: 20, fontSize: 16, fontWeight: '300' },
  section: {
    paddingTop: 20,
    paddingBottom: 10,
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: { paddingTop: 20, paddingBottom: 10 },
  input: {
    backgroundColor: 'white',
    marginVertical: 10,
    padding: 15,
    borderColor: 'white',
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
