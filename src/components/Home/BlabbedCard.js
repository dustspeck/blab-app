import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  TextInput,
  Image,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  Linking,
  Alert,
  StyleSheet,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import * as RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-community/async-storage';

import * as COLORS from '../../constants/colors';

const BlabbedCard = ({data, setData, navigation}) => {
  const {height, width} = Dimensions.get('window');
  const abs_ext_path = RNFS.ExternalStorageDirectoryPath + '/Blab/';

  console.log('BL Data: ' + JSON.stringify(data));

  const removeElement = async (item) => {
    try {
      console.log('Remove:' + JSON.stringify(item.id));
      let pre = await AsyncStorage.getItem('db_blabbed_history');
      pre = JSON.parse(pre);
      console.log('Pre: ' + JSON.stringify(pre));
      let new_data = [];
      let r_pid;
      new_data = data.filter((d) => {
        if (!r_pid) r_pid = d.id == item.id ? item.thumbnail : null;
        return d.id !== item.id;
      });
      new_data = {data: new_data};
      await AsyncStorage.setItem(
        'db_blabbed_history',
        JSON.stringify(new_data),
      );
      setData(new_data.data);
      console.log('Remove PID: ', r_pid);
      await RNFS.unlink(`${r_pid}`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <View
        style={{
          height: null,
          width,
          padding: 15,
          backgroundColor: COLORS.GRAY_15,
        }}>
        <View
          style={{
            backgroundColor: COLORS.GRAY_25,
            borderRadius: 20,
            overflow: 'hidden',
          }}>
          {/* <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Text style={{color: '#aaa', margin: 'auto'}}>qwe</Text>
          </View> */}
          <LinearGradient
            pointerEvents="none"
            colors={['#00000000', '#00000000', '#00000045']}
            start={{x: 0.0, y: 0.25}}
            end={{x: 0.5, y: 1.0}}
            style={{
              flex: 1,
              zIndex: 200,
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}></LinearGradient>

          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              height: width / 3 - 10,
              width: width / 3 - 10,
              zIndex: 2,
            }}
            onPress={() => {
              navigation.navigate('Posts');
            }}>
            <View
              style={{
                color: '#aaa',
                fontSize: 15,
                position: 'absolute',
                zIndex: 3,
                right: 12,
                bottom: width / 6 - 12,
                backgroundColor: 'rgba(100, 100, 100, 0.8)',
                borderRadius: 12,
                padding: 3,
                paddingHorizontal: 8,
              }}>
              <Text style={{color: '#bbb', fontSize: 12}}>
                VIEW ALL
                <Icon name="chevron-forward" style={{fontSize: 12}} />
              </Text>
            </View>
          </TouchableOpacity>

          <FlatList
            style={{
              backgroundColor: '#202020',
              flexWrap: 'wrap',
              flexDirection: 'column',
            }}
            numColumns={3}
            keyExtractor={(item) => item.id}
            data={data.slice(0, 6)}
            ListEmptyComponent={() => (
              <View style={Styles.emptyComponent}>
                <Text style={{color: 'white'}}>
                  The posts you blab will appear here.
                </Text>
              </View>
            )}
            renderItem={({item}) => {
              return (
                <Pressable
                  onPress={() => {
                    navigation.navigate('ViewScreen', {
                      post_url: item.post_url,
                    });
                  }}
                  onLongPress={() => {
                    Alert.alert(
                      'Delete',
                      'Are you sure you want to remove this blab?',
                      [
                        {text: 'No', onPress: () => {}},
                        {
                          text: 'Yes',
                          onPress: () => {
                            removeElement(item);
                          },
                        },
                      ],
                      {cancelable: true},
                    );
                  }}
                  style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}>
                  <Image
                    style={Styles.historyPreview}
                    source={{uri: 'file:///' + item.thumbnail}}
                  />
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </>
  );
};
const Styles = StyleSheet.create({
  emptyComponent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height / 3,
    width: Dimensions.get('window').width,
    backgroundColor: '#202020',
  },
  historyPreview: {
    width: Dimensions.get('window').width / 3 - 10,
    height: Dimensions.get('window').width / 3 - 10,
    backgroundColor: 'black',
    margin: 1,
    marginBottom: 2,
  },
});

export default BlabbedCard;
