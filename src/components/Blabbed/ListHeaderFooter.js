import React from 'react';
import {View, Text, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
exports.ListHeader = () => (
  <View
    style={{
      backgroundColor: 'inherit',
      height: height / 12 + 5,
      width,
    }}></View>
);

exports.ListFooter = () => (
  <View
    style={{
      backgroundColor: 'inherit',
      height: height / 10,
      width,
    }}></View>
);
