import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ToastAndroid,
  PermissionsAndroid,
  Share,
  Alert,
  Linking,
} from 'react-native';
import WebView from 'react-native-webview';
import * as RNFS from 'react-native-fs';
import ShareC from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import Clipboard from '@react-native-community/clipboard';

import {Scripts} from '../scripts';
import PostPreview from '../PostPreview';
import ShareTray from '../ShareTray';
import ThemedModal from '../ThemedModal';

const ShareScreen = ({route, navigation}) => {
  const abs_ext_path = RNFS.ExternalStorageDirectoryPath + '/Blab/';

  var {valid_url} = route.params;
  var post_url = valid_url;

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

  const [loading, setLoading] = useState(true);

  const [is_share_loading, setIsShareLoading] = useState(false);
  const [is_shared, setIsShared] = useState(false);

  const [save_progress, setSaveProgress] = useState(-1);
  const [is_saved, setIsSaved] = useState(false);
  const [saved_location, setSavedLocation] = useState();
  const [saved_mime, setSavedMime] = useState();

  const [modal_data, setModalData] = useState({
    visible: false,
    heading: null,
    text: null,
    action: () => {},
  });

  useEffect(() => {
    post_url = validateURL(post_url);
    console.log(post_url);
    if (!post_url) displayError();
  }, []);

  const handlePressSUB = () => {
    setIsShareLoading(true);
    if (!loading) generateLink(data);
  };

  const generateLink = (data) => {
    //send post data to server
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    };
    fetch('https://blab-server.herokuapp.com/api/v1/newpost', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log('Generate Link: ' + data);
        setBlabUrl(data.data);
        setIsShared(true);
        setIsShareLoading(false);
      })
      .catch((err) =>
        setModalData({
          visible: true,
          heading: 'Error Occured',
          text:
            'Could not connect to the server. Check your internet connection and try again.',
          action: () => {
            setModalData({visible: false});
            navigation.navigate('HomeScreen');
          },
        }),
      );
  };

  const downloadMedia = () => {
    setSaveProgress(0);
    setIsSaved(false);

    let ext = data.media_url.indexOf('.jpg') > -1 ? '.jpg' : '.mp4';
    RNFetchBlob.config({
      path: abs_ext_path + 'filename' + ext,
      fileCache: true,
    })
      .fetch('GET', data.media_url, {
        //headers
      })
      .progress((received, total) => {
        console.log('progress', received / total);
        setSaveProgress(received / total);
      })
      .then((res) => {
        setSaveProgress(1);
        setIsSaved(true);
        setSavedLocation('file://' + abs_ext_path + 'filename' + ext);
        setSavedMime(ext === '.mp4' ? 'video/mp4' : 'image/jpg');
        ToastAndroid.showWithGravity(
          'Media saved.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      })
      .catch((err) =>
        setModalData({
          visible: true,
          heading: 'Error Occured',
          text: 'Could not save the media. Check your internet connection.',
          action: () => {
            setModalData({visible: false});
            navigation.navigate('HomeScreen');
          },
        }),
      );
  };

  const dummyDownload = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('done');
    }, 10000);
  });

  const downloadInitiate = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to memory to download the file ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        downloadMedia();
      } else {
        setModalData({
          visible: true,
          heading: 'Permission Denied!',
          text: 'You need to give storage permission to download the file.',
          action: () => {
            setModalData({visible: false});
            navigation.navigate('HomeScreen');
          },
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onShare = async () => {
    try {
      console.log('========================onShare');
      await Share.share({
        title: 'Send Link',
        message: blab_url,
        excludedActivityTypes: ['com.blab'],
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

      await ShareC.open({
        url: 'file://' + abs_ext_path + '.cache/filename.png',
        type: 'image/jpeg',
      }).catch((err) => {
        console.log(err);
      });

      // RNFS.readFile(RNFS.ExternalDirectoryPath + '/image.png', 'base64').then(
      //   (image) => {
      //     ShareC.open({
      //       url: 'file://' + RNFS.ExternalDirectoryPath + '/image.png',
      //       // url: 'data:image/jpeg;base64,' + image,
      //       type: 'image/jpeg',
      //     }).catch((err) => {
      //       console.log(err);
      //     });
      //   },
      // );
    } catch (error) {
      console.log(error);
    }
  };

  const onStory = async () => {
    console.log('========================onStory');
    try {
      let is_video = data.video_view_count ? true : false;
      console.log('is_video: ', is_video);

      if (is_video && !is_saved) {
        await downloadInitiate();
      } else {
        let options = is_video
          ? {
              // method: ShareC.InstagramStories.SHARE_BACKGROUND_VIDEO,
              // backgroundVideo: saved_location,
              // social: ShareC.Social.INSTAGRAM_STORIES,
              social: ShareC.Social.INSTAGRAM,
              url: saved_location,
              forceDialog: true,
            }
          : {
              method: ShareC.InstagramStories.SHARE_STICKER_IMAGE,
              stickerImage:
                'file://' + abs_ext_path + '.cache/' + 'filename.png',
              backgroundBottomColor: '#fefefe',
              backgroundTopColor: '#000',
              social: ShareC.Social.INSTAGRAM_STORIES,
            };

        await ShareC.shareSingle(options);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onRepost = async () => {
    console.log('========================onRepost');
    try {
      //copy caption
      console.log(data.caption);
      Clipboard.setString(data.caption);
      ToastAndroid.showWithGravity(
        'Copied caption to clipboard',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );

      let is_video = data.video_view_count ? true : false;
      console.log('is_video: ', is_video);

      if (!is_saved) {
        // if (is_video && !is_saved) {
        await downloadInitiate();
      } else {
        // let is_video = data.video_view_count ? true : false;
        let options = is_video
          ? {
              social: ShareC.Social.INSTAGRAM,
              url: saved_location,
              forceDialog: true,
            }
          : {
              url: 'file://' + abs_ext_path + 'filename.jpg',
              social: ShareC.Social.INSTAGRAM,
              forceDialog: true,
            };
        await ShareC.shareSingle(options);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onOpen = async () => {
    try {
      console.log('========================onOpen');
      console.log(saved_location);
      await ShareC.open({
        url: saved_location,
        type: saved_mime,
        // excludedActivityTypes: ['com.instagram', 'com.instagram.android', 'com.whatsapp', 'com.whatsapp.android', 'com.blab']
      }).catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const onSave = () => {
    downloadInitiate();
  };

  const validateURL = (url) => {
    if (url) {
      if (!url.startsWith('https://')) {
        url = 'https://'.concat(url);
      }
      try {
        let validate_url = new URL(url);
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
    // Alert.alert(
    //   'Error Occured',
    //   'Either the URL is invalid or you are not logged in.',
    //   [
    //     {text: 'Login', onPress: () => navigation.navigate('LoginScreen')},
    //     {
    //       text: 'OK',
    //       onPress: () => navigation.navigate('HomeScreen'),
    //     },
    //   ],
    //   {cancelable: false},
    // );
    setModalData({
      visible: true,
      heading: 'Error Occured!',
      text: 'Either the URL is invalid or you are not logged in.',
      action: () => {
        setModalData({visible: false});
        navigation.navigate('HomeScreen');
      },
    });
  };

  const handleFetch = (fdata) => {
    console.log('Handle Fetch:' + fdata);
    fdata = JSON.parse(fdata);

    if (fdata.success) {
      console.log('========================setData');
      setData({...fdata.shared_data});
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
          onError={() => {
            console.log('Connection Issue');
            setModalData({
              visible: true,
              heading: 'Error Occured!',
              text: 'Please check your internet connection.',
              action: () => {
                setModalData({visible: false});
                navigation.navigate('HomeScreen');
              },
            });
          }}
        />
      </View>

      <ThemedModal
        visible={modal_data.visible}
        heading={modal_data.heading}
        text={modal_data.text}
        action={modal_data.action}
      />

      <View style={{flex: 5}}>
        <View style={{flex: 1, backgroundColor: '#444'}}>
          <PostPreview loading={loading} post_data={data} cache={true} />
        </View>
      </View>

      <View style={{flex: 2, backgroundColor: 'black'}}>
        <ShareTray
          loading={loading}
          data={data}
          blab_url={blab_url}
          is_share_loading={is_share_loading}
          is_shared={is_shared}
          save_progress={save_progress}
          is_saved={is_saved}
          handlePressSUB={handlePressSUB}
          onShare={onShare}
          onShareImg={onShareImg}
          onOpen={onOpen}
          onSave={onSave}
          onStory={onStory}
          onRepost={onRepost}
        />
      </View>
    </>
  );
};

export default ShareScreen;

//Linking.openURL(post_url);

// <Modal visible={share_modal_open} transparent={true}>
//   <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)' }} onPress={() => { setShareModalOpen(!share_modal_open) }}>
//     <View flex={5} flexDirection='column' justifyContent='flex-end'>
//       <TouchableOpacity style={{ height: 50, width: 150, borderRadius: 10, backgroundColor: 'white', alignSelf: 'center' }}
//         onPress={() => { Alert.alert(":|") }}></TouchableOpacity>
//     </View><View flex={2}></View>
//   </TouchableOpacity>
// </Modal>

/* Generate Link, Copy Link, Share Link*/
/* Share Image, Download Media */
/* Open Post, Remove watermark, Change BG color */
