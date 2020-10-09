import React from 'react';
import {View, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import * as COLORS from '../../constants/colors';

const image2 = require('../../public/assets/img/steps.jpg');

const StepsPage = ({setIsFirstRun}) => {
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
          NO MORE
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 45,
            fontWeight: 'bold',
            marginHorizontal: 40,
          }}>
          hidden DMs.
        </Text>
        <Image
          source={image2}
          style={{
            marginTop: 20,
            alignSelf: 'center',
            height: 1979 * (width / 1825) * 0.9,
            width: width * 0.9,
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
            setIsFirstRun(false);
          }}>
          <LinearGradient
            start={{x: 0.0, y: 0.0}}
            end={{x: 1.0, y: 1.0}}
            colors={[COLORS.PRIMARY_COLOR, COLORS.SECONDARY_COLOR]}
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
                color: COLORS.PRIMARY_COLOR,
                color: 'white',
              }}
              name={'arrow-forward-outline'}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StepsPage;
