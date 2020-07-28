import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, ActivityIndicator} from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as RNFS from 'react-native-fs';

const lock_logo = require('../public/assets/img/lock.jpg');

export class PostPreview extends Component {
  state = {
    img_uri: null,
    sizeF: 0.3,
  };

  onImageLoad = () => {
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
            RNFS.ExternalDirectoryPath + '/image.png',
          )
            .then((success) => {
              console.log('done move');
            })
            .catch((err) => console.log(err));
        });
    }, 500);
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

  render() {
    if (this.props.loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    } else {
      return (
        <>
          <ViewShot ref="viewShot" style={styles.VSBorder}>
            <View style={styles.card}>
              <Image
                style={styles.pp}
                source={{uri: this.props.post_data.pp_url}}
              />

              <Text style={styles.username}>
                {this.props.post_data.username.toString().length > 16
                  ? this.props.post_data.username.toString().substring(0, 16) +
                    '...'
                  : this.props.post_data.username}
              </Text>

              {this.props.post_data.is_private && (
                // <Text style={styles.private_tag}>Private</Text>
                <Image
                  style={{
                    height: 20,
                    width: 20,
                    margin: 12,
                    position: 'absolute',
                    right: 0,
                    opacity: 0.8,
                  }}
                  source={lock_logo}
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
                }}>
                {this.formatLnC(
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
                }}>
                {/* Blab for IG */}
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
  },
  VSBorder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  private_tag: {
    margin: 5,
    marginHorizontal: 10,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 15,
    backgroundColor: 'black',
    borderRadius: 4,
    paddingRight: 5,
    paddingLeft: 5,
    color: 'white',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
    right: 2,
    top: 8,
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
});

export default PostPreview;
