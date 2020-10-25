import React from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import * as COLORS from '../../constants/colors';
import CTACard from '../../components/Misc/CTACard';

const {height, width} = Dimensions.get('window');

const RateUsCard = ({setShowRateUsModal}) => {
  return (
    <CTACard
      icon={'logo-google-playstore'}
      text={'RATE THIS APP ON PLAY'}
      action={() => {
        setShowRateUsModal(true);
      }}
    />
  );
};

export default RateUsCard;
