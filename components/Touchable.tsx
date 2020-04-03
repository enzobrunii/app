import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

// Workaround for RectButton not working inside the bottom sheet
export default function Touchable({ children, ...props }) {
  if (Platform.OS === 'ios') {
    return <TouchableOpacity {...props} disabled={(props.enabled === undefined) ? false : !props.enabled}>{children}</TouchableOpacity>;
  }
  return <RectButton {...props}>{children}</RectButton>;
}
