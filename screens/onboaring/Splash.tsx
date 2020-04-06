import React from 'react';
import { View, Image } from 'react-native';
import { MainStackNavProps } from '../../navigation/types';

export const Splash = ({ navigation }: MainStackNavProps<'Splash'>) => {
  return (
    <View
      style={{
        backgroundColor: '#75AADB',
        width: '100%',
        height: '100%',
      }}
    >
      <Image
        source={require('../../assets/images/splash.png')}
        resizeMode="contain"
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
};
