import React from 'react';
import {View, Text} from 'react-native';
import {Dimensions} from 'react-native';

import * as COLORS from '../../constants/colors';

const TopbarBranding = () => {
  const {width, height} = Dimensions.get('window');
  return (
    <View
      style={{
        height: null,
        width,
        padding: 15,
        backgroundColor: COLORS.GRAY_15,
      }}>
      <Text>Blab for IG</Text>
    </View>
  );
};

export default TopbarBranding;
