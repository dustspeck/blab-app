import React from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import * as COLORS from '../../constants/colors';
const {height, width} = Dimensions.get('window');

const LearnMoreCard = ({navigation}) => {
  return (
    <View
      style={{
        height: null,
        width,
        padding: 15,
        backgroundColor: COLORS.GRAY_15,
      }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('WelcomeScreen');
        }}>
        <View
          style={{
            backgroundColor: COLORS.GRAY_25,
            borderRadius: 20,
            overflow: 'hidden',
            padding: width / 16,
          }}>
          <LinearGradient
            pointerEvents="none"
            colors={[COLORS.PRIMARY_COLOR, COLORS.SECONDARY_COLOR]}
            start={{x: 0.0, y: 0.25}}
            end={{x: 0.5, y: 1.0}}
            style={{
              flex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}></LinearGradient>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{fontWeight: 'bold', fontSize: width / 16, color: '#eee'}}>
              {'WHY & HOW TO  '}
            </Text>
            <Icon
              style={{fontSize: width / 12, color: '#eee'}}
              name="color-wand-sharp"
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LearnMoreCard;
