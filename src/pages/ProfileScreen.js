import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
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
import {RewardedAd, RewardedAdEventType} from '@react-native-firebase/admob';

import TopbarBranding from '../components/Misc/TopbarBranding';
import OptionsMenu from '../components/Profile/OptionsMenu';
// import SettingsCard from '../components/Misc/SettingsCard';

import {Scripts} from '../constants/scripts';
import {ShowInterstitialAd, ShowRewardAd} from '../sharedMethods/AdsProvider';
import {hasBypassedAdDays} from '../sharedMethods/DBManager';

import * as COLORS from '../constants/colors';

import verified_badge from '../../public/assets/img/vbadge.png';
import private_badge from '../../public/assets/img/pbadge.png';

const {width, height} = Dimensions.get('window');

const ProfileScreen = ({navigation}) => {
  const LoginWebView = useRef();
  const [loggedin, setLoggedin] = useState(false);
  const [user_details, setUserDetails] = useState({});
  const [options_visible, setOptionsVisible] = useState(false);
  const [loading_ad, setLoadingAd] = useState(false);

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
      followers_count: null,
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

  const loginscreenAction = async () => {
    setLoadingAd(true);
    // ShowRewardAd({
    //   successAction: () => {
    //     setLoadingAd(false);
    //     navigation.navigate('LoginScreen');
    //   },
    //   failureAction: () => {
    //     setLoadingAd(false);
    //   },
    // });
    const enabled_ads = await hasBypassedAdDays();
    console.log('enabled_ads: ', enabled_ads);
    ShowInterstitialAd({
      enabled_ads: enabled_ads,
      postAction: () => {
        setLoadingAd(false);
        navigation.navigate('LoginScreen');
      },
    });
  };

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
      {/* <SettingsCard /> */}
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
                      ? user_details.username.toUpperCase() + ' 👋 '
                      : ''
                  }  `
                : 'NOT CONNECTED '}
            </Text>
          </View>
        </View>

        <View style={{flex: 4}}>
          <Text
            style={{
              color: 'white',
              marginHorizontal: width / 10,
              fontSize: width / 20,
              fontWeight: 'bold',
              marginBottom: 10,
              textAlign: 'center',
            }}>
            Why Connect to Instagram?
          </Text>
          <Text
            style={{
              color: 'white',
              marginHorizontal: width / 10,
              marginBottom: width / 6,
              fontSize: width / 25,
              textAlign: 'center',
            }}>
            Connecting your Instagram account will let you share private posts
            over Blab.
          </Text>

          {loggedin ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{marginHorizontal: width / 6}}
              onPress={() => {
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
            <>
              <TouchableOpacity
                disabled={loading_ad}
                activeOpacity={0.8}
                style={{marginHorizontal: width / 6}}
                onPress={loginscreenAction}>
                <View
                  style={{
                    width: width / 1.5,
                    height: width / 8,
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
                      name={loading_ad ? 'time-outline' : 'logo-instagram'}
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
              <Text
                style={{
                  color: COLORS.PRIMARY_COLOR,
                  marginHorizontal: width / 10,
                  marginVertical: width / 20,
                  fontSize: width / 30,
                  textAlign: 'center',
                }}>
                {
                  "Your account remains secured as you enter your login credentials directly on the Instagram's website.\n"
                }
              </Text>
            </>
          )}
          {/* <TouchableOpacity
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
                {'💡  Learn how it works'}
              </Text>
            </View>
          </TouchableOpacity> */}
          {loggedin && (
            <Text
              style={{
                color: COLORS.DIS_PRIMARY_COLOR,
                fontSize: width / 30,
                marginHorizontal: width / 10,
                marginVertical: width / 10,
                textAlign: 'center',
                flex: 1,
              }}>
              We respect the copyright of the owners. Do not repost or share
              without the owner's permission.
            </Text>
          )}
        </View>
      </View>
    </>
  );
};

export default ProfileScreen;
