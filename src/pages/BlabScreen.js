import React, {useEffect, useState} from 'react';
import {StyleSheet, Dimensions, Linking} from 'react-native';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';

// import ShareTray from '../Share/ShareTray';
import ThemedModal from '../components/Misc/ThemedModal';

const ViewScreen = ({route, navigation}) => {
  const {height, width} = Dimensions.get('window');

  const [post_data, setpost_data] = useState({
    username: 'loading...',
    media_url: null,
  });
  const [loading, setLoading] = useState(true);
  const [bid, setBID] = useState('');
  const [modal_data, setModalData] = useState({
    visible: false,
    heading: null,
    text: null,
    buttons: [],
  });

  useEffect(() => {
    var bid = getBID(route.params.blab_url);
    fetch(`https://blab-server.herokuapp.com/api/v1/p/${bid}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.state === 1) {
          setpost_data({...res.data});
          setLoading(false);
        } else {
          setModalData({
            visible: true,
            heading: 'Error Occured',
            text: "Either this post has expired or you're here by mistake.",
            buttons: [
              {
                text: 'OK',
                action: () => {
                  setModalData({visible: false});
                  navigation.navigate('HomeScreen');
                },
              },
            ],
          });
        }
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
  }, []);

  const getBID = (burl) => {
    if (burl) {
      let bid = '';
      bid = burl.substring(burl.indexOf('/p/') + 3);
      bid = bid.slice(0, 12);
      setBID(bid);
      return bid;
    }
  };

  const formatNum = (num) => {
    num = parseInt(num);
    if (num < 999) return num;
    if (num < 1000000) return Math.round(num / 1000) + 'K';
    if (num < 10000000) return (num / 1000000).toFixed(2) + 'M';
    if (num < 1000000000) return Math.round(num / 1000000) + 'M';
    if (num < 1000000000000) return Math.round(num / 1000000000) + 'B';
    return 'loading...';
  };

  const returnStats = () => {
    if (post_data.video_view_count) {
      return (
        <>
          <Text>{formatNum(post_data.video_view_count)}</Text>
          <Text>
            {' '}
            {post_data.video_view_count > 1 ? ` views • ` : ` view • `}
          </Text>
          <Text>{formatNum(post_data.comments_count)}</Text>
          <Text>
            {post_data.comments_count > 1 ? ` comments ` : ` comment `}
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text>{formatNum(post_data.likes_count)}</Text>
          <Text> {post_data.likes_count > 1 ? ` likes • ` : ` like • `}</Text>
          <Text>{formatNum(post_data.comments_count)}</Text>
          <Text>
            {post_data.comments_count > 1 ? ` comments ` : ` comment `}
          </Text>
        </>
      );
    }
  };

  const returnMedia = (mediaUrl) => {
    if (mediaUrl) {
      if (mediaUrl.indexOf('.mp4') > -1) {
        return (
          <Video
            source={{uri: mediaUrl}}
            resizeMode="contain"
            style={{
              flex: 1,
              width,
              height: (width / post_data.width) * post_data.height,
            }}
            controls={true}
          />
        );
      } else {
        return (
          <Image
            source={{uri: mediaUrl}}
            resizeMode="contain"
            style={{
              flex: 1,
              width,
              height: (width / post_data.width) * post_data.height,
            }}
          />
        );
      }
    }
  };

  const onShare = async () => {
    try {
      console.log('========================onShare');
      await Share.share({
        title: 'Send Link',
        message: route.params.blab_url,
        excludedActivityTypes: ['com.blabforig'],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ThemedModal
        visible={modal_data.visible}
        heading={modal_data.heading}
        text={modal_data.text}
        buttons={modal_data.buttons}
      />
      <ScrollView style={{backgroundColor: '#151515'}}>
        {loading && (
          <View
            style={{
              flex: 1,
              height,
              width,
              backgroundColor: 'black',
              justifyContent: 'center',
            }}>
            <ActivityIndicator style={{margin: 10}} size="large" color="#fff" />
          </View>
        )}
        {!loading && (
          <>
            <View
              style={{
                backgroundColor: '#151515',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{flexDirection: 'row'}}
                onPress={() => {
                  Linking.openURL(
                    'instagram://user?username=' + post_data.username,
                  );
                }}>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    margin: 15,
                    marginLeft: 25,
                  }}
                  source={{uri: post_data.pp_url}}
                />
                <Text
                  style={{
                    fontWeight: '200',
                    textAlignVertical: 'center',
                    color: 'white',
                    fontSize: 18,
                  }}>
                  {post_data.username.length > 16
                    ? post_data.username.substring(0, 16) + '...'
                    : post_data.username}
                </Text>
              </View>
              <View>
                {post_data.is_private && (
                  <Text
                    style={{
                      backgroundColor: '#353535',
                      color: 'white',
                      borderRadius: 5,
                      margin: 20,
                      marginRight: 35,
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                    }}>
                    Private
                  </Text>
                )}
              </View>
            </View>
            <View style={{backgroundColor: 'black'}}>
              {returnMedia(post_data.media_url)}
            </View>
            <View style={{backgroundColor: '#151515'}}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 16,
                  margin: 10,
                  marginHorizontal: 25,
                }}>
                {returnStats()}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={{
                    height: 30,
                    width: 120,
                    borderRadius: 8,
                    backgroundColor: 'white',
                    margin: 10,
                    marginLeft: 20,
                  }}
                  onPress={onShare}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 15,
                      alignSelf: 'center',
                      textAlignVertical: 'center',
                      flex: 1,
                    }}>
                    <Icon
                      name="link-outline"
                      style={{color: 'black', fontSize: 15}}
                    />{' '}
                    Share Link
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  style={{
                    height: 30,
                    width: 100,
                    borderRadius: 8,
                    backgroundColor: 'white',
                    margin: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('ShareScreen', {
                      valid_url: post_data.post_url,
                    });
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 15,
                      alignSelf: 'center',
                      textAlignVertical: 'center',
                      flex: 1,
                    }}>
                    <Icon
                      name="arrow-redo-outline"
                      style={{color: 'black', fontSize: 15}}
                    />{' '}
                    Re-Blab
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: 'white',
                  backgroundColor: '#151515',
                  padding: 20,
                }}>
                {post_data.caption}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default ViewScreen;
