import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {Linking, Alert, StyleSheet, Dimensions} from 'react-native';
import WebView from 'react-native-webview';
import ShareMenu from 'react-native-share-menu';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';

import {Scripts} from '../scripts';
import UserDetails from '../UserDetails';
import GuestDetails from '../GuestDetails';
import UrlInput from '../UrlInput';
import BlabbedList from '../BlabbedList';

const HomeScreen = ({navigation, shared_data, route}) => {
  //data
  const connectData = async () => {
    try {
      let data = {id: 1, value: ['hihi']};
      // await AsyncStorage.setItem('@storage_Key', JSON.stringify(data));
      let v = await AsyncStorage.getItem('@storage_Key');
      console.log(v);
      v = JSON.parse(v);
      v.value.push('hello');
      await AsyncStorage.setItem('@storage_Key', JSON.stringify(v));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    connectData();
  }, []);
  //

  const {width, height} = Dimensions.get('window');

  const LoginWebView = useRef();

  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState();
  const [user_details, setUserDetails] = useState({
    username: null,
    pp_url: null,
    follwers_count: null,
    following_count: null,
    user_id: null,
    is_private: null,
    is_verified: null,
  });
  const [blabbed_history, setBlabbedHistory] = useState([
    {id: 0, uri: require('../../public/assets/img/post.jpg')},
    {id: 1, uri: require('../../public/assets/img/post.jpg')},
    {id: 2, uri: require('../../public/assets/img/post.jpg')},
    {id: 3, uri: require('../../public/assets/img/post.jpg')},
    {id: 4, uri: require('../../public/assets/img/post.jpg')},
    {id: 5, uri: require('../../public/assets/img/post.jpg')},
    {id: 6, uri: require('../../public/assets/img/post.jpg')},
    {id: 7, uri: require('../../public/assets/img/post.jpg')},
  ]);

  useEffect(() => {
    ShareMenu.getSharedText((text) => {
      console.log('ShareMenu rec:' + text);
      var post_url = extractURL(text);
      var valid_url = validateURL(post_url);
      console.log('validated:' + valid_url);
      if (valid_url !== false) navigation.navigate('ShareScreen', {valid_url});
      else dsiplayError();
    });
  }, []);

  useEffect(() => {
    const post_url = Linking.getInitialURL().then((post_url) => {
      var valid_url = validateURL(post_url);
      if (valid_url !== false) {
        navigation.navigate('ShareScreen', {valid_url});
      }
    });
    return () => {};
  }, []);

  useEffect(() => {
    console.log('RELOADED');
    LoginWebView.current.reload();
  }, []);

  useEffect(() => {
    try {
      if (route.params.load) {
        setLoad(true);
      } else {
        setLoad(false);
      }
    } catch (_) {}
  });

  useEffect(() => {
    try {
      if (route.params.load) {
        const {load} = route.params;
        if (load) reloadWebview();
      }
    } catch (_) {}
  }, [load]);

  const extractURL = (text) => {
    let link = text.substr(text.indexOf('https://www.instagram.com/p/'));
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
      if (!url.startsWith('https://www.instagram.com/p/')) return false;
      try {
        let validate_url = new URL(url);
        return url;
      } catch (_) {
        return false;
      }
    } else return false;
  };

  const dsiplayError = () => {
    Alert.alert(
      'Error Occured',
      'Invalid URL',
      [{text: 'OK', onPress: () => {}}],
      {cancelable: false},
    );
  };

  const handleSetData = (newData) => {
    setBlabbedHistory(newData);
  };

  const handleUserData = (data) => {
    data = JSON.parse(data);
    if (data.success == true) {
      setUserDetails({...data.user_data});
    }
    setLoading(false);
  };

  reloadWebview = () => {
    console.log('RELOADED');
    LoginWebView.current.reload();
  };

  return (
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
        />
      </View>

      {loading ? (
        //data is loading
        <View style={{backgroundColor: '#151515', flex: 0.6}}>
          <ActivityIndicator style={{margin: 10}} size="large" color="#fff" />
        </View>
      ) : user_details.username === null ? (
        //not logged in
        <View style={{backgroundColor: '#151515', flex: 0.6}}>
          <GuestDetails
            blab_count={blabbed_history.length}
            navigation={navigation}
          />
        </View>
      ) : (
        //logged in
        <View
          style={{
            backgroundColor: '#151515',
            flex: 0.6,
          }}>
          <UserDetails
            blab_count={blabbed_history.length}
            ig_details={{...user_details}}
          />
        </View>
      )}

      <View style={{backgroundColor: '#151515', flex: 1}}>
        <UrlInput navigation={navigation} />
        <BlabbedList
          data={blabbed_history}
          setData={handleSetData}
          navigation={navigation}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
