import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export default function RadioButtons({ options, label, onChange, value }) {
  function handlePress(val) {
    onChange(val);
  }

  return (
    <View style={styles.buttonContainer}>
      <Text style={{ textTransform: 'uppercase', paddingEnd: 10 }}>
        {label}
      </Text>
      {options.map(item => {
        return (
          <React.Fragment key={item.key}>
            <Text>{item.text}</Text>
            <TouchableOpacity
              style={styles.circle}
              onPress={() => {
                handlePress(item.key);
              }}
            >
              {value === item.key && <View style={styles.checkedCircle} />}
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 30,
  },

  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },

  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primaryColor,
  },
});
