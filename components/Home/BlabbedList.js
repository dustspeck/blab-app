import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
  FlatList,
} from 'react-native';
import {
  Linking,
  Alert,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import * as RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-community/async-storage';

const img_steps = require('../../public/assets/img/steps.jpg');

const BlabbedList = ({data, setData, navigation}) => {
  const {width, height} = Dimensions.get('window');
  const abs_ext_path = RNFS.ExternalStorageDirectoryPath + '/Blab/';

  console.log('BL Data: ' + data);

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
      <FlatList
        style={{
          backgroundColor: '#202020',
          flexWrap: 'wrap',
          flexDirection: 'column',
        }}
        numColumns={3}
        keyExtractor={(item) => item.id}
        data={data}
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
                // navigation.navigate('BlabScreen', {
                //   blab_url: 'https://blabforig.com/p/X9x3a0TJvanH',
                // });
                // navigation.navigate('BlabScreen', {blab_url: 'https://blabforig.com/p/X9x3a0TJvanH'});
                // navigation.navigate('BlabScreen', {blab_url: 'https://blabforig.com/p/tCulwiK2Ohwx'});
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
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
    backgroundColor: 'black',
    margin: 1,
    marginBottom: 2,
  },
});

export default BlabbedList;
