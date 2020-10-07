import React from 'react';
import {View, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import * as Constants from '../constants';

const image1 = require('../../public/assets/img/splscr_img1.jpg');

const IntroPage = ({nextStage}) => {
  const {height, width} = Dimensions.get('window');
  return (
    <View
      style={{
        display: 'flex',
        position: 'absolute',
        height,
        width,
        zIndex: 500,
        backgroundColor: 'black',
      }}>
      <View style={{flex: 8, backgroundColor: '#000'}}>
        <Text
          style={{
            color: 'white',
            fontSize: 70,
            fontWeight: 'bold',
            margin: 40,
            marginBottom: -20,
          }}>
          STOP
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 45,
            fontWeight: 'bold',
            marginHorizontal: 40,
          }}>
          being uncool.
        </Text>
        <Image
          source={image1}
          style={{
            marginTop: 20,
            alignSelf: 'center',
            height: 1979 * (width / 1825) * 0.9,
            width: width * 0.9,
            opacity: 0.8,
          }}
        />
      </View>
      <View
        style={{
          flex: 2,
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            nextStage();
          }}>
          <LinearGradient
            start={{x: 0.0, y: 0.0}}
            end={{x: 1.0, y: 1.0}}
            colors={[Constants.PRIMARY_COLOR, Constants.SECONDARY_COLOR]}
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
            }}>
            <Icon
              style={{
                flex: 1,
                fontSize: 30,
                alignSelf: 'center',
                textAlignVertical: 'center',
                color: Constants.PRIMARY_COLOR,
                color: 'white',
              }}
              name={'checkmark-outline'}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IntroPage;
