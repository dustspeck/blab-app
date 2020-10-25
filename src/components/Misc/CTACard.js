import React from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import * as COLORS from '../../constants/colors';
const {height, width} = Dimensions.get('window');

const CTACard = ({navigation, icon, text, action}) => {
  return (
    <View
      style={{
        height: null,
        width,
        padding: 15,
        backgroundColor: COLORS.GRAY_15,
      }}>
      <TouchableOpacity activeOpacity={0.8} onPress={action}>
        <View
          style={{
            backgroundColor: COLORS.GRAY_25,
            borderRadius: 20,
            overflow: 'hidden',
            paddingHorizontal: width / 16,
            paddingVertical: width / 22,
          }}>
          <LinearGradient
            pointerEvents="none"
            colors={[COLORS.GRAY_25, COLORS.GRAY_20]}
            // colors={[
            //   COLORS.PRIMARY_COLOR,
            //   COLORS.SECONDARY_COLOR,
            //   COLORS.PRIMARY_COLOR,
            // ]}
            start={{x: 0.0, y: 0.5}}
            end={{x: 1, y: 1}}
            style={{
              flex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              opacity: 0.25,
            }}></LinearGradient>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Icon
              name={icon}
              style={{
                fontSize: width / 14,
                color: '#ddd',
                textAlignVertical: 'center',
                marginHorizontal: width / 18,
              }}
            />
            <View>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: width / 26,
                  color: '#ddd',
                }}>
                {text}
              </Text>
              <Text
                style={{
                  fontSize: width / 30,
                  color: '#aaa',
                }}>
                {text}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CTACard;
