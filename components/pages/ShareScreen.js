import React, {Fragment, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Clipboard,
  Button,
  ToastAndroid,
  Share,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import WebView from 'react-native-webview';
import * as RNFS from 'react-native-fs';
import ShareC from 'react-native-share';

import {Scripts} from '../scripts';
import PostPreview from '../PostPreview';

const ShareScreen = ({route, navigation}) => {
  var {post_url} = route.params;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    media_url: null,
    img_url: null,
    height: null,
    width: null,
    username: null,
    pp_url: null,
    is_private: null,
    is_verified: null,
    likes_count: null,
    comments_count: null,
    sidecar: [],
  });

  useEffect(() => {
    post_url = validateURL(post_url);
    if (!post_url) dsiplayError();
  });

  const onShare = async () => {
    try {
      console.log('========================onShare');
      await Share.share({
        title: 'Send Link',
        message: shareURL,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onShareImg = async () => {
    try {
      console.log('========================onShareImg');
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Blab',
          message: 'Grant Write External Storgae Permission',
        },
      );

      RNFS.readFile(RNFS.ExternalDirectoryPath + '/image.png', 'base64').then(
        (image) => {
          ShareC.open({
            url: 'data:image/jpeg;base64,' + image,
            type: 'image/jpeg',
          }).catch((err) => {
            console.log(err);
          });
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  const validateURL = (url) => {
    if (url) {
      if (!url.startsWith('https://')) {
        url = 'https://'.concat(_url);
      }
      try {
        let validate_url = new URL(url);
        return url;
      } catch (_) {
        return false;
      }
    }
  };

  const dsiplayError = () => {
    Alert.alert(
      'Error Occured',
      'Either the URL is invalid or you are not logged in.',
      [
        {text: 'Login', onPress: () => navigation.navigate('LoginScreen')},
        {text: 'OK', onPress: () => navigation.navigate('HomeScreen')},
      ],
      {cancelable: false},
    );
  };

  const handleFetch = (fdata) => {
    fdata = JSON.parse(fdata);

    if (fdata.success) {
      console.log('========================setData');

      setData({...fdata.shared_data});

      //send post data to server
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...fdata.shared_data}),
      };
      fetch('http://10.0.2.2:2000/api/v1/newpost', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

      setLoading(false);
    } else {
      dsiplayError();
    }
  };

  return (
    <Fragment>
      <View style={{flex: 0, height: 0}}>
        <WebView
          source={{uri: post_url}}
          injectedJavaScript={Scripts.fetchData}
          onMessage={(event) => {
            handleFetch(event.nativeEvent.data);
          }}
        />
      </View>

      <View style={Styles.centerAlignTop}>
        <PostPreview loading={loading} post_data={data} />
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 0.3,
          backgroundColor: '#101010',
        }}>
        <Button
          disabled={loading}
          title="Copy Link"
          onPress={() => {
            Clipboard.setString(data.media_url);
            ToastAndroid.show('Copied', ToastAndroid.SHORT);
          }}
        />
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 0.3,
          backgroundColor: '#101010',
        }}>
        <Button
          disabled={loading}
          title="Send Link"
          onPress={() => {
            onShare();
          }}
        />
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 0.3,
          backgroundColor: '#101010',
        }}>
        <Button disabled={loading} title="Share Image" onPress={onShareImg} />
      </View>
    </Fragment>
  );
};

const Styles = StyleSheet.create({
  centerAlign: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#101010',
  },
  centerAlignTop: {
    flex: 2,
    backgroundColor: '#101010',
  },
});

export default ShareScreen;
