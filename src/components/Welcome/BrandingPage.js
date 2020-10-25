import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import logo from '../../../public/assets/img/logo.png';
import * as COLORS from '../../constants/colors';
const {height, width} = Dimensions.get('window');

const BrandingPage = (props) => {
  return (
    <View style={{height, width}}>
      <View style={{flex: 8, backgroundColor: COLORS.GRAY_15}}>
        <Image
          source={logo}
          resizeMode="contain"
          style={{
            height: width / 3,
            width: width / 3,
            padding: 20,
            marginTop: width / 8,
            alignSelf: 'center',
          }}
        />
        <Text style={Styles.heading}>BLAB for Instagram</Text>
        <View style={Styles.subHeading}>
          <Icon name="add-circle" style={Styles.subHeadingIcon} />
          <Text style={Styles.subHeadingText}>
            Add Private Instagram Posts to your Story,
          </Text>
        </View>
        <View style={Styles.subHeading}>
          <Icon name="play" style={Styles.subHeadingIcon} />
          <Text style={Styles.subHeadingText}>
            Share Private Instagram Videos within seconds,
          </Text>
        </View>
        <View style={Styles.subHeading}>
          <Icon name="download" style={Styles.subHeadingIcon} />
          <Text style={Styles.subHeadingText}>
            Download any Instagram Post on your device,
          </Text>
        </View>
        <View
          style={{
            ...Styles.subHeading,
            marginVertical: 0,
          }}>
          <Text
            style={{
              ...Styles.subHeadingText,
              width: null,
              marginHorizontal: width / 10,
              color: '#555',
            }}>
            and more...
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 2,
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: COLORS.GRAY_15,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            props.nextStage();
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
              name={'checkmark-outline'}
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
      </View>
    </View>
  );
};
const Styles = StyleSheet.create({
  heading: {
    color: 'white',
    textAlign: 'center',
    fontSize: width / 14,
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
export default BrandingPage;
