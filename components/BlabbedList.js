import React, {useState} from 'react';
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
import {Linking, Alert, StyleSheet, Dimensions} from 'react-native';

const BlabbedList = ({data, setData, navigation}) => {
  const {width, height} = Dimensions.get('window');

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
        renderItem={({item}) => (
          <Pressable
            onPress={() => {
              Alert.alert(`${item.id}: Under Dev`);
              // navigation.navigate('ViewScreen', {blab_url: 'Et0NXHRp5aIW'});
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
                      let newData = [];
                      for (let i = 0; i < data.length; i++) {
                        if (data[i].id !== item.id) {
                          newData.push(data[i]);
                        }
                      }
                      setData(newData);
                    },
                  },
                ],
                {cancelable: true},
              );
            }}
            style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}>
            <Image style={Styles.historyPreview} source={item.uri} />
          </Pressable>
        )}
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
