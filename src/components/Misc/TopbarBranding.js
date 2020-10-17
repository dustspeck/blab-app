import React from 'react';
import {View, Text, Alert, TouchableOpacity} from 'react-native';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <Text style={{color: 'white', fontSize: 22, fontWeight: 'bold'}}>
        Blab for IG
      </Text>
      <TouchableOpacity
        onPress={() => {
          Alert.alert('Settings');
        }}>
        <Icon
          // name="settings-sharp"
          name="ellipsis-vertical"
          style={{color: 'white', fontSize: 24}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default TopbarBranding;
