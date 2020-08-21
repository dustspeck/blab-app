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
  const [blab_url, setBlabUrl] = useState('https://blabforig.com/');

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
          message: 'Grant Write External Storage Permission',
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
    // console.log(urlToJSON(url));
    if (url) {
      if (!url.startsWith('https://')) {
        url = 'https://'.concat(url);
      }
      try {
        let validate_url = new URL(url);
        console.log('validated');
        return url;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
  };

  const urlToJSON = (url) => {
    var aURL = '';
    if (url.indexOf('?') > -1) {
      aURL = url + '&__a=1';
    } else {
      aURL = url + '?__a=1';
    }
    return aURL;
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
    console.log(fdata);
    fdata = JSON.parse(fdata);

    if (fdata.success) {
      console.log('========================setData');

      setData({...fdata.shared_data});

      // //send post data to server

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...fdata.shared_data}),
      };
      fetch('https://blab-server.herokuapp.com/api/v1/newpost', requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setBlabUrl(data.data);
        });

      setLoading(false);
    } else {
      displayError();
    }
  };

  return (
    <>
      <View style={{flex: 0}}>
        <WebView
          source={{uri: urlToJSON(post_url)}}
          injectedJavaScript={Scripts.fetchData__a}
          onMessage={(event) => {
            handleFetch(event.nativeEvent.data);
          }}
        />
      </View>
      <View
        style={{
          flex: 5,
          // backgroundColor: 'red'
        }}>
        <View
          style={{
            flex: 1,
            // backgroundColor: 'white'
            backgroundColor: '#212121',
          }}>
          {/* PostPreview */}
          {/* //TODO: Fit the Post size in this window // */}
          <PostPreview loading={loading} post_data={data} />
        </View>
      </View>
      <View style={{flex: 2, backgroundColor: 'black'}}>
        <View
          style={{
            flex: 1,
            // backgroundColor: 'green',
            margin: 10,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}>
            <View
              style={{
                flex: 1,
                // backgroundColor: 'red',
                margin: 5,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flex: 2,
                    // backgroundColor: 'purple',
                    margin: 3,
                  }}>
                  {/* Send Public Link */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={Styles.touchButton}
                    onPress={onShare}>
                    <Text style={Styles.buttonText}>Share Public Link</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    // backgroundColor: 'black',
                    margin: 3,
                  }}>
                  {/* Copy Link */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={Styles.touchSecondaryButton}
                    onPress={() => {
                      Clipboard.setString(blab_url);
                      ToastAndroid.show('Copied', ToastAndroid.SHORT);
                    }}>
                    <Text style={Styles.buttonText}>Copy Link</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                // backgroundColor: 'blue',
                margin: 5,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flex: 1,
                    // backgroundColor: 'purple',
                    margin: 3,
                  }}>
                  {/* Send As Image */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={Styles.touchButton}
                    onPress={onShareImg}>
                    <Text style={Styles.buttonText}>Send As Image</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    // backgroundColor: 'black',
                    margin: 3,
                  }}>
                  {/* Download Media */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={Styles.touchButton}>
                    <Text style={Styles.buttonText}>Save Media</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 0.75,
                // backgroundColor: 'yellow',
                margin: 5,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flex: 1,
                    // backgroundColor: 'red',
                    margin: 3,
                  }}>
                  {/* Open in Instagram */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={Styles.touchSecondaryButton}
                    onPress={() => {
                      Linking.openURL(post_url);
                    }}>
                    <Text style={{...Styles.buttonText, fontSize: 15}}>
                      Open on Instagram
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    // backgroundColor: 'red',
                    margin: 3,
                  }}>
                  {/* Open in Instagram */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={Styles.touchSecondaryButton}
                    onPress={() => {}}>
                    <Text style={{...Styles.buttonText, fontSize: 15}}>
                      Remove Watermark
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );

  {
    /* Generate Link, Copy Link, Share Link*/
  }
  {
    /* Share Image, Download Media */
  }
  {
    /* Open Post, Remove watermark */
  }
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
  touchButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 5,
  },
  touchSecondaryButton: {
    flex: 1,
    backgroundColor: '#eeeeee',
    borderRadius: 15,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});

export default ShareScreen;
