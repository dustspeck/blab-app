import React, {useEffect, useState} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {Text, View, Image, ScrollView} from 'react-native';
import Video from 'react-native-video';

//   todo: add save button for blabbed list or fav
//   todo: download media
const ViewScreen = ({route}) => {
  const {height, width} = Dimensions.get('window');

  const [post_data, setpost_data] = useState({});
  const [img_dim, setimg_dim] = useState({});

  useEffect(() => {
    fetch(`https://blabforig.com/api/v1/p/${route.params.blab_url}`)
      .then((res) => res.text())
      .then((res) => {
        res = JSON.parse(res);
        console.log(res);
        setpost_data({...res.data});
      });
  }, []);

  const formatNum = (num) => {
    num = parseInt(num);
    if (num < 999) return num;
    // if (num < 9999) return `${parseInt(num / 1000)},${num % 1000}`;
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
    if (mediaUrl.indexOf('.mp4') > -1) {
      return (
        <Video
          //   source={{uri: mediaUrl}}
          source={{
            uri:
              'https://instagram.fdel25-1.fna.fbcdn.net/v/t50.2886-16/117293885_123581939441428_2907363007064062360_n.mp4?_nc_ht=instagram.fdel25-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=olw5ChV3wHgAX8_mhZ_&oe=5F305EC4&oh=e3a7ecff46d0a441925e0c2f3425ad76',
          }}
          resizeMode="contain"
          style={{flex: 1, width: null, height: null}}
          controls={true}
        />
      );
    } else {
      return (
        // <img alt={`${post_data.username}`} src={`${post_data.media_url}`} />
        <Image
          source={{
            uri:
              // 'https://instagram.fdel25-1.fna.fbcdn.net/v/t51.2885-15/e35/80816679_880656345684599_6068253935871744002_n.jpg?_nc_ht=instagram.fdel25-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=SLV5_g9Ln2gAX-jTU2m&oh=8277e067f18c2212b9f355f59c816e1c&oe=5F54426D',
              // 'https://instagram.fdel25-1.fna.fbcdn.net/v/t51.2885-15/e35/s1080x1080/117083117_352359552434458_4204805013101316422_n.jpg?_nc_ht=instagram.fdel25-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=eYh8E4bdLJYAX9EWzIP&oh=a609b4fffb634383f9f0072f1357b768&oe=5F55339B',
              mediaUrl,
          }}
          resizeMode="contain"
          style={{flex: 1, width: null, height: null}}
        />
      );
    }
  };

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          height,
          width,
          flexDirection: 'column',
          justifyContent: 'space-around',
          backgroundColor: 'red',
        }}>
        {/* <Text>ViewScreen: {route.params.blab_url}</Text> */}
        <View
          style={{
            backgroundColor: '#121212',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                margin: 10,
                marginLeft: 25,
                //   marginTop: 25,
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
              {post_data.username}
            </Text>
          </View>
          <View>
            <Text
              style={{
                backgroundColor: '#353535',
                color: 'white',
                borderRadius: 5,
                marginRight: 35,
                marginTop: 15,
                paddingHorizontal: 5,
                paddingVertical: 2,
              }}>
              Private
            </Text>
          </View>
        </View>

        <View style={{flex: 2, backgroundColor: '#121212'}}>
          {returnMedia(post_data.media_url)}
        </View>
        <View style={{flex: 1, backgroundColor: '#121212'}}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 16,
              margin: 10,
              marginHorizontal: 35,
            }}>
            {returnStats()}
          </Text>
        </View>
      </View>
      <Text style={{color: 'white', backgroundColor: '#121212', padding: 20}}>
        {post_data.caption}
      </Text>
    </ScrollView>
  );
};

export default ViewScreen;

// const styles = StyleSheet.create({})
