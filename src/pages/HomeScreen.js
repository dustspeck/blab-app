import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {
  Linking,
  Alert,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import * as RNFS from 'react-native-fs';
import WebView from 'react-native-webview';
import CookieManager from 'react-native-cookies';
import ShareMenu from 'react-native-share-menu';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';

import {Scripts} from '../constants/scripts';
import WelcomePage from '../components/Welcome/WelcomePage';
import UserDetails from '../components/Home/UserDetails';
import GuestDetails from '../components/Home/GuestDetails';
import UrlInput from '../components/Home/UrlInput';
import BlabbedList from '../components/Home/BlabbedList';
import AskPermissions from '../components/Home/AskPermissions';
import ThemedModal from '../components/Misc/ThemedModal';

const HomeScreen = ({navigation, shared_data, route}) => {
  //constants
  const abs_ext_path = RNFS.ExternalStorageDirectoryPath + '/Blab/';
  const {width, height} = Dimensions.get('window');

  //sample
  const db_sample = {
    data: [
      {id: 1, thumbnail: abs_ext_path + 'filename.jpg'},
      {id: 2, thumbnail: abs_ext_path + 'filename.jpg'},
    ],
  };
  //

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
  const [last_perm, setLastPerm] = useState(true);
  const [nointernet_modal, setNoInternetModal] = useState(false);
  const [modal_data, setModalData] = useState({
    visible: false,
    heading: null,
    text: null,
    buttons: [],
  });
  const [isWVLoading, setIsWVLoading] = useState(false);

  //constants
  const initializeConstants = async () => {
    try {
      //path
      let exists = await RNFS.exists(abs_ext_path + '/.cache');
      if (!exists) {
        RNFS.mkdir(abs_ext_path + '/.cache');
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
      visible: true,
      heading: 'Update Available',
      text: 'Nvm, just checking',
      buttons: [
        {
          text: 'UPDATE',
          action: () => {
            setModalData({...modal_data, visible: false});
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
        //sample
        // await AsyncStorage.setItem(
        //   'db_blabbed_history',
        //   JSON.stringify(db_sample),
        // );
        //
        let history = await AsyncStorage.getItem('db_blabbed_history');
        history = JSON.parse(history);
        // console.log('BL Sent:' + history);
        console.log('BL Sent:' + history.data);
        // setBlabbedHistory(history);
        setBlabbedHistory(history.data);
      } else {
        setIsFirstRun(true);
        let empty_data = {data: []};
        await AsyncStorage.setItem(
          'db_blabbed_history',
          JSON.stringify(empty_data),
        );
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

  //URL
  const extractURL = (text) => {
    let link = text.substr(
      text.indexOf('https://www.instagram.com/p/') > -1
        ? text.indexOf('https://www.instagram.com/p/')
        : text.indexOf('https://www.instagram.com/reel/'),
    );
    link = link.substr(
      0,
      link.indexOf(' ') > -1 ? link.indexOf(' ') : link.length,
    );
    return link;
  };

  const validateURL = (url) => {
    if (url) {
      console.log('validateURL rec:' + url);
      if (!url.startsWith('https://')) url = 'https://'.concat(url);
      if (
        !url.startsWith('https://www.instagram.com/p/') &&
        !url.startsWith('https://www.instagram.com/reel/')
      )
        return false;
      try {
        let validate_url = new URL(url);
        return url;
      } catch (_) {
        return false;
      }
    } else return false;
  };

  const displayError = () => {
    Alert.alert(
      'Error Occured',
      'Invalid URL',
      [{text: 'OK', onPress: () => {}}],
      {cancelable: false},
    );
  };

  //data
  const handleSetData = (newData) => {
    setBlabbedHistory(newData);
  };

  const handleUserData = (data) => {
    data = JSON.parse(data);
    if (data.success == true) {
      setUserDetails({...data.user_data});
    } else {
      setUserDetails({username: null});
    }
    setLoading(false);
  };

  // reloadWebview = () => {
  //   LoginWebView.current.reload();
  // };

  onLogout = async () => {
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
  };

  //useeffects
  useEffect(() => {
    initializeConstants();
    connectData();
    checkUpdates();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', connectData);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    ShareMenu.getSharedText((text) => {
      console.log('ShareMenu rec:' + text);
      var post_url = extractURL(text);
      var valid_url = validateURL(post_url);
      console.log('validated:' + valid_url);
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
      {isFirstRun && (
        <WelcomePage isFirstRun={isFirstRun} setIsFirstRun={setIsFirstRun} />
      )}
      <ThemedModal
        visible={modal_data.visible}
        heading={modal_data.heading}
        text={modal_data.text}
        buttons={modal_data.buttons}
      />

      <View style={{flex: 1, minHeight: height}}>
        <View style={{flex: 0}}>
          <WebView
            ref={LoginWebView}
            source={{uri: 'https://www.instagram.com/accounts/edit/?__a=1'}}
            injectedJavaScript={Scripts.fetchUserDetails__a}
            onMessage={(event) => {
              console.log(event.nativeEvent.data);
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

        <View style={{backgroundColor: '#151515', flex: 0.6}}>
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
        </View>

        <View style={{backgroundColor: '#151515', flex: 1}}>
          <UrlInput navigation={navigation} />
          {has_permission || last_perm ? (
            <BlabbedList
              data={blabbed_history}
              setData={handleSetData}
              navigation={navigation}
            />
          ) : (
            <AskPermissions onSuccess={onSuccess} />
          )}
        </View>
      </View>
    </>
  );
};

export default HomeScreen;
