import React from 'react';
import {View, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as COLORS from '../../constants/colors';
const SelectorTick = ({selected, item}) => {
  const {width, height} = Dimensions.get('window');
  return (
    <View
      style={{
        position: 'absolute',
        bottom: width / 50,
        right: width / 50,
        zIndex: 20,
      }}>
      <View
        style={{
          height: width / 12,
          width: width / 12,
          backgroundColor: COLORS.GRAY_25,
          borderRadius: width / 5,
          opacity: 0.3,
        }}
      />
      <Icon
        name={
          selected.includes(item.id) ? 'checkmark-circle' : 'ellipse-outline'
        }
        style={{
          fontSize: width / 12,
          color: COLORS.PRIMARY_COLOR,
          position: 'absolute',
        }}
      />
    </View>
  );
};

export default SelectorTick;
