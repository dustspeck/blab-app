import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

const lock_logo = require('../public/assets/img/lock.jpg');
const lock_d_logo = require('../public/assets/img/lock_d.jpg');

export class PostPreview extends Component {
  state = {
    img_uri: null,
    sizeF: 0.3,
    dark: false,
    toggle_load: false,
    is_cached: false,
  };
  abs_ext_path = RNFS.ExternalStorageDirectoryPath + '/Blab/';

  onImageLoad = () => {
    // this.cacheMedia();
    if (!this.state.is_cached) {
      this.cacheMedia();
    }
    this.setState({toggle_load: true});
    console.log('Data:' + JSON.stringify(this.props.post_data));
    //resize acc to layout
    let factor = this.props.post_data.height / this.props.post_data.width;
    if (factor > 1.2) {
      this.setState({sizeF: 0.27});
    } else if (factor < 0.9) {
      this.setState({sizeF: 0.33});
    }

    //take viewshot after 500ms and save
    setTimeout(() => {
      this.refs.viewShot
        .capture({result: 'data-uri', format: 'jpeg'})
        .then((uri) => {
          this.setState({img_uri: uri});

          //move from cache to ext stg
          RNFS.moveFile(
            this.state.img_uri,
            this.abs_ext_path + '.cache/' + 'filename.png',
          )
            .then((success) => {
              console.log('done move');
              this.setState({toggle_load: false});
            })
            .catch((err) => console.log(err));
        });
    }, 500);
  };

  cacheMedia = () => {
    let ext =
      this.props.post_data.img_url.indexOf('.jpg') > -1 ? '.jpg' : '.mp4';
    RNFetchBlob.config({
      path:
        this.abs_ext_path +
        `/.cache/${this.getPostIdentifier(this.props.post_data.post_url)}` +
        ext,
      fileCache: true,
    })
      .fetch('GET', this.props.post_data.img_url, {
        //headers
      })
      .progress((received, total) => {
        console.log('caching progress', received / total);
      })
      .then(async (res) => {
        this.setState({is_cached: true});
        //add data
        let pre = await AsyncStorage.getItem('db_blabbed_history');
        pre = JSON.parse(pre);
        pre.data.push({
          id: Math.floor(Math.random() * 1000000),
          thumbnail:
            this.abs_ext_path +
            `.cache/${this.getPostIdentifier(this.props.post_data.post_url)}` +
            ext,
        });
        await AsyncStorage.setItem('db_blabbed_history', JSON.stringify(pre));
        //
        ToastAndroid.showWithGravity(
          'Cached',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      })
      .catch((err) => console.log(err));
  };

  formatNum = (num) => {
    num = parseInt(num);
    if (num < 999) return num;
    // if (num < 9999) return `${parseInt(num / 1000)},${num % 1000}`;
    if (num < 1000000) return Math.round(num / 1000) + 'K';
    if (num < 10000000) return (num / 1000000).toFixed(2) + 'M';
    if (num < 1000000000) return Math.round(num / 1000000) + 'M';
    if (num < 1000000000000) return Math.round(num / 1000000000) + 'B';
    return '1T+';
  };

  formatLnC = (l, c) => {
    l = parseInt(l);
    c = parseInt(c);
    if (l == 1 && c == 1) {
      return `1 like • 1 comment`;
    } else {
      if (l == 1) return `1 like • ${this.formatNum(c)} comments`;
      else if (c == 1) return `${this.formatNum(l)} likes • 1 comment`;
      else return `${this.formatNum(l)} likes • ${this.formatNum(c)} comments`;
    }
  };

  formatVnC = (v, c) => {
    v = parseInt(v);
    c = parseInt(c);
    if (v == 1 && c == 1) {
      return `1 view • 1 comment`;
    } else {
      if (v == 1) return `1 view • ${this.formatNum(c)} comments`;
      else if (v == 1) return `${this.formatNum(v)} views • 1 comment`;
      else return `${this.formatNum(v)} views • ${this.formatNum(c)} comments`;
    }
  };

  getPostIdentifier = (post_url) => {
    console.log('post_url' + post_url);
    var pid = post_url.substr(post_url.indexOf('/p/') + 3);
    pid = pid.indexOf('/') > -1 ? pid.substr(0, pid.indexOf('/')) : pid;
    console.log('PID:' + pid);
    return pid;
  };

  render() {
    // console.log('Data:' + JSON.stringify(this.props.post_data));
    if (this.props.loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    } else {
      return (
        <>
          <View
            style={{
              position: 'absolute',
              bottom: '30%',
              right: 0,
              zIndex: 10,
              height: 60,
              width: 60,
            }}>
            <TouchableOpacity
              disabled={this.state.toggle_load}
              onPress={() => {
                this.setState(this.state.dark ? {dark: false} : {dark: true});
                this.onImageLoad();
              }}
              style={{
                flex: 1,
                backgroundColor: this.state.dark ? 'white' : '#242424',
                borderTopLeftRadius: 30,
                borderBottomLeftRadius: 30,
                elevation: 20,
              }}
              activeOpacity={0.5}>
              <Icon
                name={
                  this.state.toggle_load
                    ? 'time-outline'
                    : this.state.dark
                    ? 'sunny-outline'
                    : 'moon-outline'
                }
                style={{
                  flex: 1,
                  fontSize: 30,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  textAlignVertical: 'center',
                  color: this.state.dark ? '#242424' : 'white',
                }}
              />
            </TouchableOpacity>
          </View>
          <ViewShot
            ref="viewShot"
            style={styles.VSBorder}
            options={{quality: 0.6}}>
            <View
              style={{
                ...styles.card,
                backgroundColor: this.state.dark ? '#242424' : 'white',
              }}>
              <Image
                style={styles.pp}
                source={{uri: this.props.post_data.pp_url}}
              />

              <Text
                style={{
                  ...styles.username,
                  color: this.state.dark ? 'white' : 'black',
                }}>
                {this.props.post_data.username.toString().length > 16
                  ? this.props.post_data.username.toString().substring(0, 16) +
                    '...'
                  : this.props.post_data.username}
              </Text>

              {this.props.post_data.is_private && (
                <Image
                  style={styles.privateLock}
                  source={this.state.dark ? lock_d_logo : lock_logo}
                />
              )}

              <Image
                style={{
                  height: this.props.post_data.height * this.state.sizeF,
                  width: this.props.post_data.width * this.state.sizeF,
                  resizeMode: 'contain',
                  marginTop: 45,
                }}
                source={{
                  uri: this.props.post_data.img_url
                    ? this.props.post_data.img_url
                    : 'data:',
                }}
                onLoad={this.onImageLoad}
              />

              <Text
                style={{
                  position: 'absolute',
                  bottom: 0,
                  margin: 5,
                  marginLeft: 10,
                  fontSize: 14,
                  color: this.state.dark ? 'white' : 'black',
                }}>
                {this.props.post_data.video_view_count
                  ? this.formatVnC(
                      this.props.post_data.video_view_count,
                      this.props.post_data.comments_count,
                    )
                  : this.formatLnC(
                      this.props.post_data.likes_count,
                      this.props.post_data.comments_count,
                    )}
              </Text>

              <Text
                style={{
                  margin: 2,
                  marginTop: 10,
                  marginHorizontal: 10,
                  textAlign: 'right',
                  fontSize: 12,
                  color: this.state.dark ? 'white' : 'black',
                }}>
                Blab for IG
              </Text>
            </View>
          </ViewShot>
        </>
      );
    }
  }
}

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
