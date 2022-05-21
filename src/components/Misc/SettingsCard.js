import React from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Modal,
  Image,
  Linking,
  StyleSheet,
} from 'react-native';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ShareC from 'react-native-share';

import * as COLORS from '../../constants/colors';
import * as MISC from '../../constants/misc';
import * as PATHS from '../../constants/paths';

import BMC from '../../../public/assets/img/bmc.png';

const SettingsCard = ({navigation}) => {
  const {width, height} = Dimensions.get('window');
  return (
    <View>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          backgroundColor: COLORS.GRAY_30,
          margin: width / 20,
          borderRadius: width / 20,
          height: height / 2,
        }}
        onPress={() => {}}>
        <View
          flex={1}
          style={{
            alignItems: 'flex-start',
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}>
          <View style={{margin: 10, marginLeft: width / 6}}>
            <TouchableOpacity
              onPress={() => {
                ShareC.open({message: MISC.SHARE_APP_TEXT})
                  .then((res) => {})
                  .catch((err) => {});
              }}>
              <Text
                style={{
                  color: '#ddd',
                  fontSize: width / 20,
                }}>
                <Icon
                  name="share-social-sharp"
                  style={{fontSize: width / 20, color: '#ddd'}}
                />
                {'  Share this app'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{margin: 10, marginLeft: width / 6}}>
            <TouchableOpacity
              onPress={() => {
                Linking.canOpenURL(PATHS.PolicyAddress).then((supported) => {
                  if (supported) {
                    Linking.openURL(PATHS.PolicyAddress);
                  }
                });
              }}>
              <Text
                style={{
                  color: '#ddd',
                  fontSize: width / 20,
                }}>
                <Icon
                  name="shield-checkmark-sharp"
                  style={{fontSize: width / 20, color: '#ddd'}}
                />
                {'  Privacy Policy'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{margin: 10, marginLeft: width / 6}}>
            <TouchableOpacity
              onPress={() => {
                Linking.canOpenURL(PATHS.Disclaimer).then((supported) => {
                  if (supported) {
                    Linking.openURL(PATHS.Disclaimer);
                  }
                });
              }}>
              <Text
                style={{
                  color: '#ddd',
                  fontSize: width / 20,
                }}>
                <Icon
                  name="checkmark-done-circle-sharp"
                  style={{fontSize: width / 20, color: '#ddd'}}
                />
                {'  Disclaimer'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{margin: 10, marginLeft: width / 6}}>
            <TouchableOpacity
              onPress={() => {
                Linking.canOpenURL('https://play.google.com').then(
                  (supported) => {
                    if (supported) {
                      Linking.openURL(
                        `https://play.google.com/store/apps/details?id=${MISC.PSID}`,
                      );
                    }
                  },
                );
              }}>
              <Text
                style={{
                  color: '#ddd',
                  fontSize: width / 20,
                }}>
                <Icon
                  name="logo-google-playstore"
                  style={{fontSize: width / 20, color: '#ddd'}}
                />
                {'  Rate on Play Store'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{width: width / 1.2, ...styles.lineStyle}} />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: width / 6,
              // backgroundColor: 'red',
            }}>
            {/* <View>
              <Text
                style={{
                  marginHorizontal: width / 20,
                  fontSize: width / 30,
                  color: '#999',
                  textAlign: 'center',
                }}
                onPress={() => {}}>
                {'Show some love ❤️'}
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Linking.canOpenURL(PATHS.BMC).then((supported) => {
                    if (supported) Linking.openURL(PATHS.BMC);
                  });
                }}>
                <Image
                  source={BMC}
                  style={{
                    width: width * 0.5,
                    height: width * 0.5 * 0.25,
                    margin: 10,
                    marginBottom: 0,
                    marginHorizontal: 'auto',
                  }}
                  resizeMode={'stretch'}
                />
                <Text
                  style={{
                    marginHorizontal: width / 20,
                    fontSize: width / 35,
                    color: '#777',
                    textAlign: 'center',
                    margin: 10,
                    marginTop: 1,
                  }}>
                  {'Wallet & UPI enabled'}
                </Text>
              </TouchableOpacity>
            </View> */}
            {/* <View style={{width: width / 1.25, ...styles.lineStyle}} /> */}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  lineStyle: {
    borderWidth: 0.5,
    borderColor: '#555',
    margin: 10,
    alignItems: 'center',
  },
});

export default SettingsCard;
