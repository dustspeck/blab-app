import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import logo from '../../../public/assets/img/logo.png';
import step1 from '../../../public/assets/img/step1.jpg';
import step2 from '../../../public/assets/img/step2.jpg';
import step3 from '../../../public/assets/img/step3.jpg';
import * as COLORS from '../../constants/colors';
const {height, width} = Dimensions.get('window');

const Step1Page = (props) => {
  return (
    <View style={{height, width, backgroundColor: COLORS.GRAY_15}}>
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', 'black', 'black']}
        style={{
          width,
          height: width / 3,
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 20,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            props.nextStage();
          }}
          style={{
            width: width / 6,
            height: width / 6,
          }}>
          <LinearGradient
            start={{x: 0.0, y: 0.0}}
            end={{x: 1.0, y: 1.0}}
            colors={[COLORS.PRIMARY_COLOR, COLORS.SECONDARY_COLOR]}
            style={{
              width: width / 6,
              height: width / 6,
              borderRadius: width / 12,
            }}>
            <Icon
              name={'arrow-forward-outline'}
              style={{
                flex: 1,
                fontSize: width / 12,
                alignSelf: 'center',
                textAlignVertical: 'center',
                color: COLORS.PRIMARY_COLOR,
                color: 'white',
              }}
            />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
      <ScrollView>
        <Text style={Styles.heading}>How to Blab Instagram Posts</Text>
        <View style={Styles.subHeading}>
          <Text
            style={{
              fontSize: width / 16,
              padding: 10,
              fontWeight: 'bold',
              color: COLORS.PRIMARY_COLOR,
            }}>
            1/2
          </Text>
          <Text
            style={{
              ...Styles.subHeadingText,
              fontSize: width / 22,
              paddingHorizontal: 20,
            }}>
            Import Public/Private Posts from Instagram
          </Text>
        </View>
        <Image
          source={step1}
          resizeMode="contain"
          style={{
            height: width - 125,
            width: width - 20,
            padding: 5,
            borderRadius: 25,
            marginTop: 10,
            alignSelf: 'center',
          }}
        />
        <Image
          source={step2}
          resizeMode="contain"
          style={{
            height: width - 60,
            width: width - 20,
            padding: 5,
            borderRadius: 25,
            marginTop: 10,
            alignSelf: 'center',
          }}
        />
        <Image
          source={step3}
          resizeMode="contain"
          style={{
            height: width - 60,
            width: width - 20,
            padding: 5,
            borderRadius: 25,
            marginTop: 10,
            alignSelf: 'center',
          }}
        />
        <View style={{...Styles.subHeading, marginTop: width / 10}}>
          <Icon
            name="information-circle"
            style={{
              ...Styles.subHeadingIcon,
              fontSize: width / 14,
              color: COLORS.DIS_PRIMARY_COLOR,
            }}
          />
          <Text
            style={{
              ...Styles.subHeadingText,
              fontSize: width / 24,
              color: COLORS.DIS_PRIMARY_COLOR,
            }}>
            You can also copy/paste the post URL in the text input on the main
            screen.
          </Text>
        </View>
        <View style={{height: width / 3}}></View>
      </ScrollView>
    </View>
  );
};
const Styles = StyleSheet.create({
  heading: {
    color: 'white',
    textAlign: 'center',
    fontSize: width / 18,
    fontWeight: 'bold',
    margin: width / 10,
    marginBottom: 20,
  },
  subHeading: {
    color: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: width / 30,
  },
  subHeadingText: {fontSize: width / 18, color: 'white', width: width / 1.45},
  subHeadingIcon: {
    fontSize: width / 18,
    color: 'white',
    textAlignVertical: 'center',
    padding: width / 30,
  },
});
export default Step1Page;
