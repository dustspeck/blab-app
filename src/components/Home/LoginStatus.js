import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import * as COLORS from '../../constants/colors';

const LoginStatus = ({isWVLoading, blab_count, navigation}) => {
  const {height, width} = Dimensions.get('window');
  return (
    <>
      <View
        style={{
          height: null,
          width,
          padding: 15,
          backgroundColor: COLORS.GRAY_15,
        }}>
        <View
          style={{
            padding: 15,
            // marginTop: 20,
            backgroundColor: COLORS.GRAY_25,
            borderRadius: 20,
            overflow: 'hidden',
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <View
              style={{
                height: width / 8,
                width: width / 8,
                borderRadius: width / 16,
                // backgroundColor: 'red',
              }}>
              <Icon
                name="alert-circle-outline"
                style={{
                  flex: 1,
                  fontSize: width / 8,
                  color: '#e94560',
                  textAlignVertical: 'center',
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-around',
                marginLeft: 15,
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Text style={{fontSize: 18, color: '#ddd', fontWeight: 'bold'}}>
                  NOT CONNECTED
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'white',
                    marginLeft: 15,
                    opacity: 0.5,
                    textAlignVertical: 'center',
                    color: COLORS.PRIMARY_COLOR,
                  }}>
                  <Icon
                    style={{fontSize: 14, color: COLORS.PRIMARY_COLOR}}
                    name="information-circle"
                  />
                  {' Tap to fix'}
                </Text>
              </View>
              <Text style={{fontSize: 14, color: '#ccc'}}>
                Connect account to share private posts.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default LoginStatus;
