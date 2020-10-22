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
const {height, width} = Dimensions.get('window');

const BlabbedCard = ({data, setData, navigation}) => {
  const abs_ext_path = RNFS.ExternalStorageDirectoryPath + '/Blab/';

  console.log('BL Data: ' + JSON.stringify(data));

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

          {data.length > 1 ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={Styles.viewAll}
              onPress={() => {
                navigation.navigate('Posts');
              }}>
              <View style={Styles.viewAllIcon}>
                <Text style={{color: '#bbb', fontSize: 12}}>
                  VIEW ALL
                  <Icon name="chevron-forward" style={{fontSize: 12}} />
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}

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
    height: height / 6,
    width: width,
    backgroundColor: '#202020',
  },
  historyPreview: {
    width: width / 3 - 10,
    height: width / 3 - 10,
    backgroundColor: 'black',
    margin: 1,
    marginBottom: 2,
  },
  viewAll: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: width / 3 - 10,
    width: width / 3 - 10,
    zIndex: 2,
  },
  viewAllIcon: {
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
  },
});

export default BlabbedCard;
