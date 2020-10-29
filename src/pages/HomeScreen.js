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
import {hasRated} from '../sharedMethods/DBManager';

import LoginStatus from '../components/Home/LoginStatus';
import TopbarBranding from '../components/Misc/TopbarBranding';
import BlabbedCard from '../components/Home/BlabbedCard';
import LearnMoreCard from '../components/Home/LearnMoreCard';
import ShowRatingModal from '../components/Misc/ShowRatingModal';
import RatingModal from '../components/Misc/RatingModal';
import RateUsCard from '../components/Home/RateUsCard';

const HomeScreen = ({navigation, shared_data, route}) => {
  //constants
  const {width, height} = Dimensions.get('window');

  //refs
  const LoginWebView = useRef();

  //states
  const [has_permission, setHasPermission] = useState(true);
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
  const [modal_data, setModalData] = useState({
    visible: false,
    heading: null,
    text: null,
    buttons: [],
  });
  const [has_rated, setHasRated] = useState(true);
  const [show_rateus_modal, setShowRateUsModal] = useState(false);
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

  const initialShareGetter = () => {
    ShareMenu.getSharedText((text) => {
      var valid_url = validateURL(extractURL(text));
      if (valid_url !== false) navigation.navigate('ShareScreen', {valid_url});
      else displayError();
    });
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
    LoginWebView.current.reload();
    try {
      let db_data = await AsyncStorage.getItem('db_blabbed_history');
      if (db_data) {
        db_data = JSON.parse(db_data);
        setBlabbedHistory(db_data.data);
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
      let db_data = await AsyncStorage.getItem('user_data');
      if (db_data) {
        db_data = JSON.parse(db_data);
        setUserDetails(db_data);
      } else {
        await AsyncStorage.setItem('user_data', JSON.stringify(user_details));
      }
    } catch (e) {
      console.log(e);
    }

    setHasRated(await hasRated());
  };

  const onSuccess = (result) => {
    AsyncStorage.setItem('db_perm', `${result}`);
    setLastPerm(result);
    setHasPermission(result);
  };

  //data
  const handleSetData = (newData) => {
    setBlabbedHistory(newData);
  };

  const handleUserData = (data) => {
    data = JSON.parse(data);
    if (data.success) {
      setUserDetails(data.user_data);
    } else {
      setUserDetails({username: null});
    }
    AsyncStorage.setItem('user_data', JSON.stringify(data.user_data));
    setLoading(false);
  };

  //useeffects
  useEffect(() => {
    initializeConstants();
    connectData();
    // checkUpdates();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', connectData);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    initialShareGetter();
  }, []);

  useEffect(() => {
    initialURLGetter();
  }, []);

  useEffect(() => {
    LoginWebView.current.reload();
  }, []);

  return (
    <>
      <ThemedModal
        visible={modal_data.visible}
        heading={modal_data.heading}
        text={modal_data.text}
        buttons={modal_data.buttons}
      />
      <ShowRatingModal />
      {show_rateus_modal && (
        <RatingModal
          showMenu={show_rateus_modal}
          setShowMenu={setShowRateUsModal}
        />
      )}
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
            {!has_rated && (
              <RateUsCard setShowRateUsModal={setShowRateUsModal} />
            )}
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

// const _keyboardDidShow = () => {
//   setIsKeyboardShown(true);
// };

// const _keyboardDidHide = () => {
//   setIsKeyboardShown(false);
// };

// useEffect(() => {
//   Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
//   Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
//   return () => {
//     Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
//     Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
//   };
// }, []);
