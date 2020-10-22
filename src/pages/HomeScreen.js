import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {
  Linking,
  Alert,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Keyboard,
  ScrollView,
  FlatList,
} from 'react-native';
import * as RNFS from 'react-native-fs';
import WebView from 'react-native-webview';
import ShareMenu from 'react-native-share-menu';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';

import {Scripts} from '../constants/scripts';
import AskPermissions from '../components/Home/AskPermissions';
import ThemedModal from '../components/Misc/ThemedModal';
import UrlInputCard from '../components/Home/UrlInputCard';

import * as COLORS from '../constants/colors';
import * as PATHS from '../constants/paths';
import * as MODALS from '../constants/modals';
import {validateURL, extractURL} from '../sharedMethods/URLInspector';

import LoginStatus from '../components/Home/LoginStatus';
import TopbarBranding from '../components/Misc/TopbarBranding';
import BlabbedCard from '../components/Home/BlabbedCard';
import LearnMoreCard from '../components/Home/LearnMoreCard';

const HomeScreen = ({navigation, shared_data, route}) => {
  //constants
  const {width, height} = Dimensions.get('window');

  //refs
  const LoginWebView = useRef();

  //states
  const [has_permission, setHasPermission] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user_details, setUserDetails] = useState({
    username: null,
    pp_url: null,
    follwers_count: null,
    following_count: null,
    user_id: null,
    is_private: null,
    is_verified: null,
  });
  const [blabbed_history, setBlabbedHistory] = useState([]);
  const [last_perm, setLastPerm] = useState(false);
  const [nointernet_modal, setNoInternetModal] = useState(false);
  const [modal_data, setModalData] = useState({
    visible: false,
    heading: null,
    text: null,
    buttons: [],
  });
  const [isWVLoading, setIsWVLoading] = useState(false);
  const [is_keyboard_shown, setIsKeyboardShown] = useState(false);

  //constants
  const initializeConstants = async () => {
    try {
      let history = await AsyncStorage.getItem('user_data');
      history = JSON.parse(history);
      setUserDetails(history);

      //path
      let exists = await RNFS.exists(PATHS.ExternalCacheDir);
      if (!exists) {
        RNFS.mkdir(PATHS.ExternalCacheDir);
      }
      //permission
      let db_perm = await AsyncStorage.getItem('db_perm');
      setLastPerm(db_perm);
    } catch (err) {
      console.log(err);
    }
  };

  const initialURLGetter = async () => {
    const blab_url = await Linking.getInitialURL();
    if (blab_url) {
      navigation.navigate('BlabScreen', {blab_url});
    }
  };

  //updates
  const checkUpdates = () => {
    setModalData({
      ...MODALS.Update,
      visible: true,
      buttons: [
        {
          text: 'UPDATE',
          action: () => {
            setModalData({visible: false});
          },
        },
      ],
    });
  };

  //db
  const connectData = async () => {
    console.log(route);
    try {
      if (route.params.load) {
        LoginWebView.current.reload();
        console.log('=============== RELOAD: ' + route.params.load);
      }
    } catch (error) {
      console.log(error);
    }
    try {
      let data = await AsyncStorage.getItem('db_blabbed_history');
      console.log('DB: ' + data);
      if (data) {
        let history = await AsyncStorage.getItem('db_blabbed_history');
        history = JSON.parse(history);
        setBlabbedHistory(history.data);
      } else {
        setIsFirstRun(true);
        let empty_data = {data: []};
        await AsyncStorage.setItem(
          'db_blabbed_history',
          JSON.stringify(empty_data),
        );
        navigation.navigate('WelcomeScreen');
      }
    } catch (e) {
      console.log(e);
    }

    try {
      let data = await AsyncStorage.getItem('user_data');
      console.log('=============History: ' + data);
      if (data) {
        let history = await AsyncStorage.getItem('user_data');
        history = JSON.parse(history);
        setUserDetails(history);
      } else {
        await AsyncStorage.setItem('user_data', JSON.stringify(user_details));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onSuccess = (result) => {
    console.log('Result:' + result);
    console.log('hasP:' + has_permission);
    AsyncStorage.setItem('db_perm', `${result}`);
    setLastPerm(result);
    setHasPermission(result);
  };

  const displayError = () => {
    setModalData({
      ...MODALS.InvalidURL,
      buttons: [
        {
          text: 'OK',
          action: () => {
            setModalData({visible: false});
          },
        },
      ],
    });
  };

  //data
  const handleSetData = (newData) => {
    setBlabbedHistory(newData);
  };

  const handleUserData = (data) => {
    data = JSON.parse(data);
    if (data.success == true) {
      setUserDetails({...data.user_data});
      AsyncStorage.setItem('user_data', JSON.stringify(data.user_data));
    } else {
      setUserDetails({username: null});
      AsyncStorage.setItem('user_data', JSON.stringify(data.user_data));
    }
    setLoading(false);
  };

  const _keyboardDidShow = () => {
    setIsKeyboardShown(true);
  };

  const _keyboardDidHide = () => {
    setIsKeyboardShown(false);
  };

  //useeffects
  useEffect(() => {
    initializeConstants();
    connectData();
    // checkUpdates();
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', connectData);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    ShareMenu.getSharedText((text) => {
      var valid_url = validateURL(extractURL(text));
      if (valid_url !== false) navigation.navigate('ShareScreen', {valid_url});
      else displayError();
    });
  }, []);

  useEffect(() => {
    initialURLGetter();
  }, []);

  useEffect(() => {
    LoginWebView.current.reload();
  }, []);

  return (
    <>
      {/* {isFirstRun && (
        <WelcomePage isFirstRun={isFirstRun} setIsFirstRun={setIsFirstRun} />
      )} */}
      <ThemedModal
        visible={modal_data.visible}
        heading={modal_data.heading}
        text={modal_data.text}
        buttons={modal_data.buttons}
      />
      <ScrollView
        stickyHeaderIndices={[1]}
        removeClippedSubviews={false}
        keyboardShouldPersistTaps="handled"
        endFillColor={COLORS.GRAY_15}>
        <View style={{flex: 0}}>
          <WebView
            ref={LoginWebView}
            source={{uri: 'https://www.instagram.com/accounts/edit/?__a=1'}}
            injectedJavaScript={Scripts.fetchUserDetails__a}
            onMessage={(event) => {
              handleUserData(event.nativeEvent.data);
            }}
            onLoadStart={() => {
              setIsWVLoading(true);
            }}
            onLoadEnd={() => {
              setIsWVLoading(false);
            }}
          />
        </View>
        <TopbarBranding navigation={navigation} />
        <LoginStatus
          loading={loading}
          user_details={user_details}
          navigation={navigation}
        />
        {has_permission || last_perm ? (
          <View style={{backgroundColor: COLORS.GRAY_15, flex: 1}}>
            <UrlInputCard
              navigation={navigation}
              isKeyboardShown={is_keyboard_shown}
            />
            <BlabbedCard
              data={blabbed_history}
              setData={handleSetData}
              navigation={navigation}
            />
            {blabbed_history.length < 2 ? (
              <LearnMoreCard navigation={navigation} />
            ) : null}
          </View>
        ) : (
          <AskPermissions onSuccess={onSuccess} />
        )}
      </ScrollView>
    </>
  );
};

export default HomeScreen;

/* <View style={{backgroundColor: '#151515', flex: 0.6}}>
  {loading ? (
    //data is loading
    <ActivityIndicator style={{margin: 10}} size="large" color="#fff" />
  ) : user_details.username === null ? (
    //not logged in
    <GuestDetails
      isWVLoading={isWVLoading}
      blab_count={blabbed_history ? blabbed_history.length : 0}
      navigation={navigation}
    />
  ) : (
    //logged in
    <UserDetails
      blab_count={blabbed_history ? blabbed_history.length : 0}
      ig_details={{...user_details}}
      onLogout={onLogout}
    />
  )}
</View> */

/* {has_permission || last_perm ? (
  <BlabbedList
    data={blabbed_history}
    setData={handleSetData}
    navigation={navigation}
  />
) : (
  <AskPermissions onSuccess={onSuccess} />
)} */

// import admob, {
//   MaxAdContentRating,
//   BannerAd,
//   TestIds,
//   BannerAdSize,
// } from '@react-native-firebase/admob';

// useEffect(() => {
//   console.log('==============admob effect');
//   admob()
//     .setRequestConfiguration({
//       // Update all future requests suitable for parental guidance
//       maxAdContentRating: MaxAdContentRating.PG,

//       // Indicates that you want your content treated as child-directed for purposes of COPPA.
//       tagForChildDirectedTreatment: true,

//       // Indicates that you want the ad request to be handled in a
//       // manner suitable for users under the age of consent.
//       tagForUnderAgeOfConsent: true,
//     })
//     .then(() => {
//       // Request config successfully set!
//       console.log('==============admob set');
//     });
// }, []);
