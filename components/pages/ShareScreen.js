import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Clipboard,
  ToastAndroid,
  PermissionsAndroid,
  Share,
  Alert,
  Linking,
} from 'react-native';
import {View, Button, Text, TouchableOpacity} from 'react-native';
import WebView from 'react-native-webview';
import * as RNFS from 'react-native-fs';
import ShareC from 'react-native-share';

import {Scripts} from '../scripts';
import PostPreview from '../PostPreview';

const ShareScreen = ({route, navigation}) => {
  var {valid_url} = route.params;
  var post_url = valid_url;
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
  const [blab_url, setBlabUrl] = useState('testing');

  useEffect(() => {
    post_url = validateURL(post_url);
    console.log(post_url);
    if (!post_url) displayError();
  });

  const onShare = async () => {
    try {
      console.log('========================onShare');
      await Share.share({
        title: 'Send Link',
        message: blab_url,
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
    console.log('SS: ' + url);
    if (url) {
      if (!url.startsWith('https://')) {
        url = 'https://'.concat(url);
      }
      try {
        let validate_url = new URL(url);
        return url;
      } catch (_) {
        return false;
      }
    }
  };

  const displayError = () => {
    Alert.alert(
      'Error Occured',
      'Either the URL is invalid or you are not logged in.',
      [
        {text: 'Login', onPress: () => navigation.navigate('LoginScreen')},
        {
          text: 'OK',
          onPress: () => navigation.navigate('HomeScreen'),
        },
      ],
      {cancelable: false},
    );
  };

  const handleFetch = (fdata) => {
    fdata = JSON.parse(fdata);

    if (fdata.success) {
      console.log('========================setData');

      setData({...fdata.shared_data});

      // send post data to server
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...fdata.shared_data}),
      };
      fetch('https://blab-server.herokuapp.com/api/v1/newpost', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

      setLoading(false);
    } else {
      displayError();
    }
  };

  return (
    <>
      <View style={{flex: 0}}>
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

      {/* Generate Link, Copy Link, Share Link*/}
      {/* Share Image, Download Media */}
      {/* Open Post, Remove watermark */}

      {/* <Button
        disabled={loading}
        title="Copy Link"
        style={{margin: 20}}
        onPress={() => {
          Clipboard.setString(data.media_url);
          ToastAndroid.show('Copied', ToastAndroid.SHORT);
        }}
      /> 
      <Button
        disabled={loading}
        title="Send Link"
        onPress={() => {onShare}}
      />
      <Button disabled={loading} title="Share Image" onPress={onShareImg} /> */}
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-around',
          backgroundColor: '#303030',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: '#303030',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 22,
              padding: 10,
              paddingHorizontal: 15,
              margin: 20,
              marginHorizontal: 10,
              height: 45,
              width: 200,
            }}>
            <Text
              style={{
                fontSize: 18,
                textAlignVertical: 'center',
                textAlign: 'center',
              }}
              onPress={onShare}>
              Share Public Link
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 22,
              padding: 10,
              paddingHorizontal: 15,
              margin: 20,
              marginHorizontal: 10,
              height: 45,
              width: 130,
            }}
            onPress={() => {
              Clipboard.setString(blab_url);
              ToastAndroid.show('Copied', ToastAndroid.SHORT);
            }}>
            <Text
              style={{
                fontSize: 18,
                textAlignVertical: 'center',
                textAlign: 'center',
              }}>
              Copy Link
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: '#303030',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 22,
              padding: 10,
              paddingHorizontal: 15,
              margin: 20,
              marginHorizontal: 10,
              height: 45,
              width: 200,
            }}
            onPress={onShareImg}>
            <Text
              style={{
                fontSize: 18,
                textAlignVertical: 'center',
                textAlign: 'center',
              }}>
              Send As Image
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 22,
              padding: 10,
              paddingHorizontal: 15,
              margin: 20,
              marginHorizontal: 10,
              height: 45,
              width: 130,
            }}>
            <Text
              style={{
                fontSize: 18,
                textAlignVertical: 'center',
                textAlign: 'center',
              }}>
              Save Media
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: '#303030',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              padding: 5,
              paddingHorizontal: 15,
              height: 30,
              margin: 20,
              marginTop: 2,
            }}
            onPress={() => {
              Linking.openURL(post_url);
            }}>
            <Text>Open on Instagram</Text>
          </TouchableOpacity>
        </View>

        {/* Ads */}
        <View>
          <Text style={{fontSize: 18, color: 'white'}}></Text>
        </View>
      </View>
    </>
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
