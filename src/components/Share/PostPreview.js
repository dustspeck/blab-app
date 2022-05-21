import React, {useState, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

import {ShowInterstitialAd} from '../../sharedMethods/AdsProvider';
import {hasBypassedAdDays} from '../../sharedMethods/DBManager';

import * as PATHS from '../../constants/paths';

const lock_logo = require('../../../public/assets/img/lock.jpg');
const lock_d_logo = require('../../../public/assets/img/lock_d.jpg');

const PostPreview = (props) => {
  const viewShot = useRef();
  const [img_uri, setImgUri] = useState(null);
  const [sizeF, setSizeF] = useState(0.3);
  const [dark, setDark] = useState(false);
  const [brand, setBrand] = useState(true);
  const [toggle_load, setToggleLoad] = useState(true);
  const [is_cached, setIsCached] = useState(false);
  // const abs_ext_path = RNFS.ExternalStorageDirectoryPath + '/Blab/';
  // const abs_ext_path = PATHS.ExternalDir;

  const imageLoadAction = () => {
    console.log('Image Loaded');
    if (!is_cached && props.cache) {
      console.log('Cache Called');
      cacheMedia();
    }
    setToggleLoad(true);
    console.log('Set load true');
    console.log('Data:' + JSON.stringify(props.post_data));
    //resize acc to layout
    let factor = props.post_data.height / props.post_data.width;
    if (factor > 1.2) {
      setSizeF(0.27);
    } else if (factor < 0.9) {
      setSizeF(0.33);
    }

    //take viewshot after 500ms and save
    try {
      setTimeout(() => {
        try {
          viewShot.current
            .capture({result: 'data-uri', format: 'jpeg'})
            .then((uri) => {
              console.log('got URI');
              setImgUri(uri);

              console.log('Moving file');
              //move from cache to ext stg
              // RNFS.moveFile(img_uri, PATHS.ExternalCacheDir + 'sticker.png')
              RNFS.moveFile(uri, PATHS.ExternalCacheDir + 'sticker.png')
                .then((success) => {
                  console.log('done move');
                  props.doneMoveSetter();
                  setToggleLoad(false);
                })
                .catch((err) => console.log('=============AT 1: ' + err));
            });
        } catch (err) {
          console.log(err);
        }
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };

  const onImageLoad = async () => {
    try {
      let check = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (!check) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // onSuccess(true);
          imageLoadAction();
        } else {
          // onSuccess(false);
          console.log('==========Not Allowed');
        }
      } else {
        // onSuccess(true);
        imageLoadAction();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const cacheMedia = () => {
    let ext = props.post_data.img_url.indexOf('.jpg') > -1 ? '.jpg' : '.mp4';
    RNFetchBlob.config({
      path:
        PATHS.ExternalCacheDir +
        `${getPostIdentifier(props.post_data.post_url)}` +
        ext,
      fileCache: true,
    })
      .fetch('GET', props.post_data.img_url, {
        //headers
      })
      .progress((received, total) => {
        console.log('caching progress', received / total);
      })
      .then(async (res) => {
        setIsCached(true);
        //add data
        let pre = await AsyncStorage.getItem('db_blabbed_history');
        pre = JSON.parse(pre);
        pre.data.unshift({
          id: Math.floor(Math.random() * 1000000),
          thumbnail:
            PATHS.ExternalCacheDir +
            `${getPostIdentifier(props.post_data.post_url)}` +
            ext,
          post_url: props.post_data.post_url,
          username: props.post_data.username,
        });
        await AsyncStorage.setItem('db_blabbed_history', JSON.stringify(pre));
        //
        // ToastAndroid.showWithGravity(
        //   'Cached',
        //   ToastAndroid.SHORT,
        //   ToastAndroid.BOTTOM,
        // );
      })
      .catch((err) => console.log(err));
  };

  const onRemoveTag = async () => {
    setToggleLoad(true);
    if (brand) {
      const enabled_ads = await hasBypassedAdDays();
      ShowInterstitialAd({
        enabled_ads: enabled_ads,
        postAction: () => {
          setBrand(!brand);
          onImageLoad();
        },
      });
    } else {
      setBrand(!brand);
      onImageLoad();
    }
  };

  const formatNum = (num) => {
    num = parseInt(num);
    if (num < 999) return num;
    // if (num < 9999) return `${parseInt(num / 1000)},${num % 1000}`;
    if (num < 1000000) return Math.round(num / 1000) + 'K';
    if (num < 10000000) return (num / 1000000).toFixed(2) + 'M';
    if (num < 1000000000) return Math.round(num / 1000000) + 'M';
    if (num < 1000000000000) return Math.round(num / 1000000000) + 'B';
    return '1T+';
  };

  const formatLnC = (l, c) => {
    l = parseInt(l);
    c = parseInt(c);
    if (l == 1 && c == 1) {
      return `1 like • 1 comment`;
    } else {
      if (l == 1) return `1 like • ${formatNum(c)} comments`;
      else if (c == 1) return `${formatNum(l)} likes • 1 comment`;
      else return `${formatNum(l)} likes • ${formatNum(c)} comments`;
    }
  };

  const formatVnC = (v, c) => {
    v = parseInt(v);
    c = parseInt(c);
    if (v == 1 && c == 1) {
      return `1 view • 1 comment`;
    } else {
      if (v == 1) return `1 view • ${formatNum(c)} comments`;
      else if (v == 1) return `${formatNum(v)} views • 1 comment`;
      else return `${formatNum(v)} views • ${formatNum(c)} comments`;
    }
  };

  const getPostIdentifier = (post_url) => {
    console.log('post_url' + post_url);
    var pid = post_url.substr(post_url.indexOf('/p/') + 3);
    pid = pid.indexOf('/') > -1 ? pid.substr(0, pid.indexOf('/')) : pid;
    console.log('PID:' + pid);
    return pid;
  };

  // render() {
  if (props.loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  } else {
    return (
      <>
        {/* <View width={'100%'} height={50} backgroundColor="red">
            <BannerAd
              size={BannerAdSize.SMART_BANNER}
              unitId={TestIds.BANNER}
            />
          </View> */}
        <View
          style={{
            position: 'absolute',
            bottom: '30%',
            right: 0,
            zIndex: 10,
            height: 50,
            width: 50,
          }}>
          <TouchableOpacity
            disabled={toggle_load}
            onPress={() => {
              setDark(!dark);
              onImageLoad();
            }}
            style={{
              flex: 1,
              backgroundColor: dark ? '#ffffff' : '#252525',
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
              elevation: 20,
            }}
            activeOpacity={0.5}>
            <Icon
              name={
                toggle_load
                  ? 'time-outline'
                  : dark
                  ? 'sunny-outline'
                  : 'moon-outline'
              }
              style={{
                flex: 1,
                fontSize: 25,
                marginLeft: 'auto',
                marginRight: 'auto',
                textAlignVertical: 'center',
                color: dark ? '#252525' : 'white',
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: '45%',
            right: 0,
            zIndex: 10,
            height: 50,
            width: 50,
          }}>
          <TouchableOpacity
            disabled={toggle_load}
            onPress={onRemoveTag}
            style={{
              flex: 1,
              backgroundColor: dark ? '#ffffff' : '#252525',
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
              elevation: 20,
            }}
            activeOpacity={0.5}>
            <Icon
              name={toggle_load ? 'time-outline' : 'pricetag-outline'}
              style={{
                flex: 1,
                fontSize: 25,
                marginLeft: 'auto',
                marginRight: 'auto',
                textAlignVertical: 'center',
                color: dark ? '#252525' : 'white',
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.VSBorder}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <ViewShot
              ref={viewShot}
              style={{
                ...styles.card,
                backgroundColor: dark ? '#252525' : 'white',
              }}>
              <Image style={styles.pp} source={{uri: props.post_data.pp_url}} />

              <Text
                style={{
                  ...styles.username,
                  color: dark ? 'white' : 'black',
                }}>
                {props.post_data.username.toString().length > 16
                  ? props.post_data.username.toString().substring(0, 16) + '...'
                  : props.post_data.username}
              </Text>

              {props.post_data.is_private && (
                <Image
                  style={styles.privateLock}
                  source={dark ? lock_d_logo : lock_logo}
                />
              )}

              <Image
                style={{
                  height: props.post_data.height * sizeF,
                  width: props.post_data.width * sizeF,
                  resizeMode: 'contain',
                  marginTop: 45,
                }}
                source={{
                  uri: props.post_data.img_url
                    ? props.post_data.img_url
                    : 'data:',
                }}
                onLoad={() => {
                  console.log('Image loaded');
                  onImageLoad();
                }}
              />

              <Text
                style={{
                  position: 'absolute',
                  bottom: 0,
                  margin: 5,
                  marginLeft: 10,
                  fontSize: 14,
                  color: dark ? 'white' : 'black',
                }}>
                {props.post_data.video_view_count
                  ? formatVnC(
                      props.post_data.video_view_count,
                      props.post_data.comments_count,
                    )
                  : formatLnC(
                      props.post_data.likes_count,
                      props.post_data.comments_count,
                    )}
              </Text>

              <Text
                style={{
                  margin: 2,
                  marginTop: 10,
                  marginHorizontal: 10,
                  textAlign: 'right',
                  fontSize: 12,
                  color: dark ? 'white' : 'black',
                }}>
                {brand && 'Blab for IG'}
              </Text>
            </ViewShot>
          </ScrollView>
        </View>
      </>
    );
  }
};
// }

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 10,
  },
  VSBorder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pp: {
    height: 30,
    width: 30,
    borderRadius: 30,
    margin: 8,
    position: 'absolute',
  },
  username: {
    position: 'absolute',
    alignSelf: 'flex-start',
    margin: 5,
    marginLeft: 50,
    fontSize: 16,
    top: 8,
    fontWeight: 'bold',
  },
  privateLock: {
    height: 20,
    width: 20,
    margin: 12,
    position: 'absolute',
    right: 0,
    opacity: 0.8,
  },
});

export default PostPreview;
