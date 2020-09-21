import React from 'react';
import {StyleSheet, ToastAndroid} from 'react-native';
import {View, Button, Text, TouchableOpacity} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import Icon from 'react-native-vector-icons/Ionicons';

const ShareTray = ({
  loading,
  data,
  is_share_loading,
  blab_url,
  is_shared,
  save_progress,
  is_saved,
  handlePressSUB,
  onShare,
  onShareImg,
  onOpen,
  onSave,
  onStory,
  onRepost,
}) => {
  return (
    <>
      <View style={{flex: 1, margin: 10}}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                // backgroundColor: 'green'
              }}>
              <View
                style={{
                  flex: 2,
                  margin: 5,
                  // backgroundColor: 'green'
                }}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <View
                    style={{
                      flex: 3,
                      // backgroundColor: 'red',
                      marginLeft: 5,
                      marginRight: 5,
                    }}>
                    {!is_shared ? (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={loading}
                        onPress={handlePressSUB}>
                        <View
                          style={{
                            backgroundColor: 'white',
                            width: '100%',
                            height: 70,
                            borderRadius: 35,
                          }}>
                          <Icon
                            style={Styles.iconStyle}
                            name={
                              is_share_loading
                                ? 'hourglass-outline'
                                : 'globe-outline'
                            }
                          />
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={onShare}>
                          <View style={Styles.roundButton}>
                            <Icon
                              style={Styles.iconStyle}
                              name="link-outline"
                            />
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            Clipboard.setString(blab_url);
                            ToastAndroid.show('Copied', ToastAndroid.SHORT);
                          }}>
                          <View style={Styles.roundButton}>
                            <Icon
                              style={Styles.iconStyle}
                              name="copy-outline"
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <View style={{flex: 1}}>
                    {!is_shared ? (
                      <Text style={Styles.buttonInfo}>
                        {is_share_loading
                          ? 'Generating Link ...'
                          : 'Share using Blab'}
                      </Text>
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        }}>
                        <Text style={Styles.buttonInfo}>Share Link</Text>
                        <Text style={Styles.buttonInfo}>{'  Copy Link'}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  margin: 5,
                  // backgroundColor: 'green'
                }}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <View
                    style={{
                      flex: 3,
                      // backgroundColor: 'pink'
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      // onPress={() => { setShareModalOpen(true) }}
                      onPress={onShareImg}>
                      <View style={Styles.roundButton}>
                        <Icon style={Styles.iconStyle} name="image-outline" />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={Styles.buttonInfo}>Send Image</Text>
                  </View>
                </View>
              </View>
              <View style={{flex: 1, margin: 5}}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <View style={{flex: 3}}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={save_progress == 1 ? onOpen : onSave}
                      disabled={save_progress > 0 && save_progress < 1}>
                      <View style={Styles.roundButton}>
                        <Icon
                          style={
                            save_progress == 1
                              ? {...Styles.iconStyle, color: 'green'}
                              : Styles.iconStyle
                          }
                          name={
                            save_progress == -1
                              ? 'download-outline'
                              : save_progress == 1
                              ? 'open-outline'
                              : 'hourglass-outline'
                          }
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1}}>
                    {save_progress == -1 && (
                      <Text style={Styles.buttonInfo}>Save Media</Text>
                    )}
                    {save_progress > -1 && save_progress < 1 && (
                      <Text style={Styles.buttonInfo}>
                        Loading... {Math.round(save_progress * 100) + '%'}
                      </Text>
                    )}
                    {save_progress == 1 && (
                      <Text style={Styles.buttonInfo}>Open Media</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 0.55,
              // backgroundColor: 'orange'
            }}>
            <View
              style={{
                margin: 10,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onStory}
                disabled={save_progress > 0 && save_progress < 1}>
                <View
                  style={{
                    backgroundColor: is_saved ? 'rgb(200, 220, 200)' : 'white',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: 135,
                    height: 30,
                    borderRadius: 35,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    name={
                      data.video_view_count
                        ? is_saved
                          ? 'logo-instagram'
                          : 'arrow-down-outline'
                        : 'logo-instagram'
                    }
                    style={{
                      fontSize: 20,
                      alignSelf: 'center',
                      textAlignVertical: 'center',
                      color: 'black',
                    }}
                  />
                  <Text style={{fontSize: 15, textAlignVertical: 'center'}}>
                    {save_progress == -1 || save_progress == 1
                      ? ' Add to story'
                      : ' Loading...'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onRepost}
                disabled={save_progress > 0 && save_progress < 1}>
                <View
                  style={{
                    backgroundColor: is_saved ? 'rgb(200, 220, 200)' : 'white',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: 135,
                    height: 30,
                    borderRadius: 35,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    name={
                      data.video_view_count
                        ? is_saved
                          ? 'logo-instagram'
                          : 'arrow-down-outline'
                        : 'logo-instagram'
                    }
                    style={{
                      fontSize: 20,
                      alignSelf: 'center',
                      textAlignVertical: 'center',
                      color: 'black',
                    }}
                  />
                  <Text style={{fontSize: 15, textAlignVertical: 'center'}}>
                    {save_progress == -1 || save_progress == 1
                      ? ' Repost'
                      : ' Loading...'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
const Styles = StyleSheet.create({
  iconStyle: {
    flex: 1,
    fontSize: 30,
    alignSelf: 'center',
    textAlignVertical: 'center',
    color: 'black',
  },
  roundButton: {
    backgroundColor: 'white',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  buttonInfo: {
    color: 'white',
    fontSize: 13,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    // backgroundColor: 'blue',
  },
});
export default ShareTray;
