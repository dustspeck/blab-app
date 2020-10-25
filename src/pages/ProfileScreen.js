import React, {useEffect, useState, useRef} from 'react';
import {View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import WebView from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from 'react-native-cookies';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import admob, {
  MaxAdContentRating,
  BannerAd,
  TestIds,
  BannerAdSize,
} from '@react-native-firebase/admob';
import {InterstitialAd, AdEventType} from '@react-native-firebase/admob';

import TopbarBranding from '../components/Misc/TopbarBranding';
import OptionsMenu from '../components/Profile/OptionsMenu';

import {Scripts} from '../constants/scripts';
import * as COLORS from '../constants/colors';
import * as ADS from '../constants/adunits';

import verified_badge from '../../public/assets/img/vbadge.png';
import private_badge from '../../public/assets/img/pbadge.png';

// const interstitialAd = InterstitialAd.createForAdRequest(
//   TestIds.INTERSTITIAL,
// );
const showInterstitialAd = () => {
  const interstitialAd = InterstitialAd.createForAdRequest(ADS.Interstitial);
  interstitialAd.onAdEvent((type, error) => {
    if (type === AdEventType.LOADED) {
      interstitialAd.show();
    }
  });
  interstitialAd.load();
};

const {width, height} = Dimensions.get('window');

const ProfileScreen = ({navigation}) => {
  const LoginWebView = useRef();
  const [loggedin, setLoggedin] = useState(false);
  const [user_details, setUserDetails] = useState({});
  const [options_visible, setOptionsVisible] = useState(false);

  const initializeConstants = async () => {
    try {
      let history = await AsyncStorage.getItem('user_data');
      history = JSON.parse(history);
      setUserDetails(history);
      if (history.username) setLoggedin(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserData = (data) => {
    data = JSON.parse(data);
    if (data.success == true) {
      setUserDetails({...data.user_data});
      setLoggedin(true);
      AsyncStorage.setItem('user_data', JSON.stringify(data.user_data));
    } else {
      setUserDetails({username: null});
      setLoggedin(false);
      AsyncStorage.setItem('user_data', JSON.stringify(data.user_data));
    }
  };

  const onLogout = async () => {
    LoginWebView.current.clearCache(true);
    const cc = await CookieManager.clearAll();
    console.log('CookieManager.clearAll =>', cc);
    setUserDetails({
      username: null,
      pp_url: null,
      follwers_count: null,
      following_count: null,
      user_id: null,
      is_private: null,
      is_verified: null,
    });
    LoginWebView.current.reload();
    setLoggedin(false);
  };

  useEffect(() => {
    admob()
      .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: true,
        tagForUnderAgeOfConsent: true,
      })
      .then(() => {});
  }, []);

  useEffect(() => {
    initializeConstants();
  }, []);

  useEffect(() => {
    LoginWebView.current.reload();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', initializeConstants);
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <View style={{flex: 0}}>
        <WebView
          ref={LoginWebView}
          source={{uri: 'https://www.instagram.com/accounts/edit/?__a=1'}}
          injectedJavaScript={Scripts.fetchUserDetails__a}
          onMessage={(event) => {
            handleUserData(event.nativeEvent.data);
          }}
        />
      </View>
      <OptionsMenu
        visible={options_visible}
        setVisible={setOptionsVisible}
        onLogout={onLogout}
        navigation={navigation}
      />
      <TopbarBranding navigation={navigation} />
      <View style={{backgroundColor: COLORS.GRAY_15, flex: 1}}>
        <View style={{flex: 3}}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View
              style={{
                width: width / 3 + 8,
                height: width / 3 + 8,
                borderColor: loggedin ? COLORS.PRIMARY_COLOR : '#aaa',
                borderWidth: 4,
                borderStyle: 'solid',
                borderRadius: width / 3,
                marginTop: 30,
                flexDirection: 'row',
              }}>
              {loggedin ? (
                <>
                  <Image
                    style={{
                      width: width / 3,
                      height: width / 3,
                      borderRadius: width / 6,
                      backgroundColor: COLORS.GRAY_25,
                      borderColor: COLORS.GRAY_15,
                      borderWidth: 6,
                      borderRadius: width / 6,
                    }}
                    source={{uri: user_details.pp_url}}
                  />
                  {user_details.is_private && (
                    <Image
                      style={{
                        height: width / 15,
                        width: width / 15,
                        marginLeft: -width / 40,
                      }}
                      source={private_badge}
                    />
                  )}
                  {user_details.is_verified && (
                    <Image
                      style={{
                        height: width / 20,
                        width: width / 20,
                        marginLeft: -width / 40,
                      }}
                      source={verified_badge}
                    />
                  )}
                </>
              ) : (
                <LinearGradient
                  colors={[COLORS.GRAY_25, COLORS.GRAY_35]}
                  start={{x: 0.0, y: 0.25}}
                  end={{x: 0.5, y: 1.0}}
                  style={{
                    width: width / 3,
                    height: width / 3,
                    borderRadius: width / 6,
                    backgroundColor: COLORS.GRAY_25,
                    borderColor: COLORS.GRAY_15,
                    borderWidth: 6,
                    borderStyle: 'solid',
                    borderRadius: width / 6,
                  }}>
                  <Icon
                    name="help"
                    style={{
                      flex: 1,
                      color: '#aaa',
                      fontSize: width / 5,
                      textAlignVertical: 'center',
                      textAlign: 'center',
                    }}
                  />
                </LinearGradient>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: loggedin ? COLORS.PRIMARY_COLOR : COLORS.ALERT,
                fontSize: width / 18,
                fontWeight: 'bold',
                marginTop: 20,
                textAlign: 'center',
              }}>
              {loggedin
                ? `Hi, ${
                    user_details.username
                      ? user_details.username.toUpperCase() + ' 👋'
                      : ''
                  }  `
                : 'NOT CONNECTED'}
            </Text>
          </View>
        </View>

        <View style={{flex: 4}}>
          <Text
            style={{
              color: 'white',
              marginHorizontal: width / 10,
              marginBottom: width / 10,
              fontSize: width / 23,
            }}>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout.
          </Text>
          {loggedin ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{marginHorizontal: width / 6}}
              onPress={() => {
                showInterstitialAd();
                setOptionsVisible(true);
              }}>
              <View
                style={{
                  width: width / 1.5,
                  height: width / 8,
                  backgroundColor: COLORS.GRAY_45,
                  borderRadius: width / 50,
                }}>
                <Text
                  style={{
                    flex: 1,
                    textAlignVertical: 'center',
                    textAlign: 'center',
                    fontSize: width / 22,
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 'auto',
                    marginBottom: 'auto',
                  }}>
                  <Icon
                    name="settings-sharp"
                    style={{
                      fontSize: width / 16,
                      textAlignVertical: 'center',
                      marginTop: 'auto',
                      marginBottom: 'auto',
                    }}
                  />
                  {'  Account Settings'}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{marginHorizontal: width / 6}}
              onPress={() => {
                // showInterstitialAd();
                navigation.navigate('LoginScreen');
              }}>
              <View
                style={{
                  width: width / 1.5,
                  height: width / 8,
                  // marginHorizontal: width / 6,
                  backgroundColor: COLORS.PRIMARY_COLOR,
                  borderRadius: width / 50,
                }}>
                <Text
                  style={{
                    flex: 1,
                    textAlignVertical: 'center',
                    textAlign: 'center',
                    fontSize: width / 22,
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 'auto',
                    marginBottom: 'auto',
                  }}>
                  <Icon
                    name="logo-instagram"
                    style={{
                      fontSize: width / 16,
                      textAlignVertical: 'center',
                      marginTop: 'auto',
                      marginBottom: 'auto',
                    }}
                  />
                  {'  Connect to Instagram'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{marginHorizontal: width / 6, marginTop: 15}}
            onPress={() => {}}>
            <View
              style={{
                width: width / 1.5,
                height: width / 8,
              }}>
              <Text
                style={{
                  flex: 1,
                  textAlignVertical: 'center',
                  textAlign: 'center',
                  fontSize: width / 25,
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                }}>
                {/* <Icon
                  name="bulb-sharp"
                  style={{
                    fontSize: width / 25,
                    textAlignVertical: 'center',
                    marginTop: 'auto',
                    marginBottom: 'auto',
                  }}
                /> */}
                {'💡  Learn how it works'}
              </Text>
            </View>
          </TouchableOpacity>
          {/* <View
            style={{
              width: '100%',
              height: 120,
              backgroundColor: COLORS.GRAY_15,
              marginTop: 25,
            }}>
            <BannerAd
              size={BannerAdSize.SMART_BANNER}
              unitId={TestIds.BANNER}
            />
          </View> */}
        </View>
      </View>
    </>
  );
};

export default ProfileScreen;
