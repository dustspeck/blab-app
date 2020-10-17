import React, {useState, useEffect, useRef} from 'react';
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

import TopbarBranding from '../components/Misc/TopbarBranding';
import * as COLORS from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

const BlabbedScreen = ({navigation}) => {
  const abs_ext_path = RNFS.ExternalStorageDirectoryPath + '/Blab/';

  const [data, setData] = useState();
  const [showTop, setShowTop] = useState(true);
  const [isSelection, setIsSelection] = useState(false);
  const [selected, setSelected] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [filterText, setFilterText] = useState();
  const [filterData, setFilterData] = useState();

  const FlatListRef = useRef();

  const connectData = async () => {
    try {
      let data = await AsyncStorage.getItem('db_blabbed_history');
      console.log('DB: ' + data);
      if (data) {
        let history = await AsyncStorage.getItem('db_blabbed_history');
        history = JSON.parse(history);
        console.log('BL Sent:' + history.data);
        setData(history.data);
      } else {
        setIsFirstRun(true);
        let empty_data = {data: []};
        await AsyncStorage.setItem(
          'db_blabbed_history',
          JSON.stringify(empty_data),
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const removeElements = async (items) => {
    try {
      let newData = await AsyncStorage.getItem('db_blabbed_history');
      newData = JSON.parse(newData);
      newData = newData.data;
      let r_pid = null;
      items.forEach((delID) => {
        newData.splice(
          newData.findIndex((v) => {
            r_pid = v.thumbnail;
            return v.id == delID;
          }),
          1,
        );
      });
      setData(newData);
      await AsyncStorage.setItem(
        'db_blabbed_history',
        JSON.stringify({data: newData}),
      );
      await RNFS.unlink(`${r_pid}`);
      setSelected([]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilter = (filter) => {
    setFilterText(filter);
    if (filter) {
      setIsFilter(true);
      setFilterData(data.filter((v) => v.username.includes(filter)));
    } else setIsFilter(false);
  };

  useEffect(() => {
    connectData();
  }, []);

  return (
    <>
      <TopbarBranding />

      <View style={Styles.floatBar}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={Styles.floatButton}
          onPress={() => {
            FlatListRef.current.scrollToOffset({animated: true, offset: 0});
          }}>
          <Icon
            name="chevron-up"
            style={{
              flex: 1,
              alignSelf: 'center',
              textAlignVertical: 'center',
              fontSize: 30,
              color: '#aaa',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={
            isSelection
              ? {...Styles.floatButton, backgroundColor: '#eee'}
              : Styles.floatButton
          }
          onPress={() => {
            if (isSelection) {
              if (selected.length > 1) {
                Alert.alert(
                  'Confirm',
                  'Are you sure you want to dismiss the current selection?',
                  [
                    {
                      text: 'Yes',
                      onPress: () => {
                        setIsSelection(!isSelection);
                        setSelected([]);
                      },
                    },
                    {text: 'No'},
                  ],
                );
              } else {
                setIsSelection(!isSelection);
                setSelected([]);
              }
            } else {
              setIsSelection(!isSelection);
              setSelected([]);
            }
          }}>
          <Icon
            name="checkmark"
            style={
              isSelection
                ? {...Styles.selectionButtonIcon, color: '#222'}
                : Styles.selectionButtonIcon
            }
          />
        </TouchableOpacity>
        {isSelection && (
          <TouchableOpacity
            activeOpacity={0.5}
            style={Styles.floatButton}
            onPress={() => {
              if (allSelected) {
                setSelected([]);
                setAllSelected(false);
              } else {
                let all = [];
                data.forEach((v) => {
                  all.push(v.id);
                });
                setSelected(all);
                setAllSelected(true);
              }
            }}>
            <Icon
              name="checkmark-done"
              style={{
                flex: 1,
                alignSelf: 'center',
                textAlignVertical: 'center',
                fontSize: 30,
                color: '#aaa',
              }}
            />
          </TouchableOpacity>
        )}
        {isSelection && selected.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.5}
            style={Styles.floatButton}
            onPress={() => {
              removeElements(selected);
            }}>
            <Icon
              name="trash"
              style={{
                flex: 1,
                alignSelf: 'center',
                textAlignVertical: 'center',
                fontSize: 30,
                color: '#aaa',
              }}
            />
          </TouchableOpacity>
        )}
      </View>

      <View
        style={{
          backgroundColor: 'transparent',
          height: height / 12 - 5,
          width,
          position: 'absolute',
          top: height / 12,
          zIndex: 20,
        }}>
        <TextInput
          style={{
            flex: 1,
            color: 'white',
            fontSize: 18,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 25,
            height: 50,
            paddingHorizontal: 20,
            margin: 4,
            marginHorizontal: 10,
            alignSelf: 'stretch',
            borderWidth: 1,
            backgroundColor: 'rgba(30, 30, 30, 1)',
          }}
          placeholder="Search blabs with username"
          placeholderTextColor="#aaaaaa"
          onChangeText={(v) => {
            handleFilter(v);
          }}
        />
      </View>

      <FlatList
        ref={FlatListRef}
        style={{
          backgroundColor: COLORS.GRAY_15,
          flexWrap: 'wrap',
          flexDirection: 'column',
        }}
        numColumns={3}
        keyExtractor={(item) => item.id}
        data={isFilter ? filterData : data}
        ListEmptyComponent={() => (
          <View style={Styles.emptyComponent}>
            <Text style={{color: 'white'}}>No items to show here.</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View
            style={{
              backgroundColor: 'inherit',
              height: height / 12 + 5,
              width,
            }}></View>
        )}
        ListFooterComponent={() => (
          <View
            style={{
              backgroundColor: 'inherit',
              height: height / 10,
              width,
            }}></View>
        )}
        renderItem={({item}) => {
          return (
            <Pressable
              onPress={() => {
                if (isSelection) {
                  if (selected.includes(item.id)) {
                    setSelected(selected.filter((v) => v !== item.id));
                  } else {
                    setSelected([...selected, item.id]);
                  }
                } else
                  navigation.navigate('ViewScreen', {post_url: item.post_url});
              }}
              onLongPress={() => {
                setIsSelection(true);
                setSelected([...selected, item.id]);
                console.log(selected);
              }}
              style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}>
              <Image
                style={
                  selected.includes(item.id)
                    ? {opacity: 0.35, ...Styles.historyPreview}
                    : Styles.historyPreview
                }
                source={{uri: 'file:///' + item.thumbnail}}
              />
              {isSelection ? (
                <View
                  style={{
                    position: 'absolute',
                    bottom: width / 50,
                    right: width / 50,
                    zIndex: 20,
                  }}>
                  <View
                    style={{
                      height: width / 12,
                      width: width / 12,
                      backgroundColor: COLORS.GRAY_25,
                      borderRadius: width / 5,
                      opacity: 0.3,
                    }}
                  />
                  <Icon
                    name={
                      selected.includes(item.id)
                        ? 'checkmark-circle'
                        : 'ellipse-outline'
                    }
                    style={{
                      fontSize: width / 12,
                      color: COLORS.PRIMARY_COLOR,
                      position: 'absolute',
                    }}
                  />
                </View>
              ) : null}
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
    height: height / 3,
    width: width,
    backgroundColor: '#202020',
  },
  historyPreview: {
    width: (width * 47) / 150,
    height: (width * 47) / 150,
    backgroundColor: 'black',
    margin: width / 100,
    borderRadius: width / 25,
  },
  floatBar: {
    position: 'absolute',
    bottom: width / 25,
    right: width / 25,
    opacity: 0.8,
    flexDirection: 'row-reverse',
    zIndex: 2,
  },
  floatButton: {
    backgroundColor: COLORS.GRAY_30,
    borderRadius: width / 3,
    marginHorizontal: width / 50,
    height: width / 8,
    width: width / 8,
  },
  selectionButtonIcon: {
    flex: 1,
    alignSelf: 'center',
    textAlignVertical: 'center',
    fontSize: 30,
    color: '#aaa',
  },
  deleteButton: {
    backgroundColor: COLORS.GRAY_30,
    opacity: 0.8,
    position: 'absolute',
    bottom: width / 25,
    right: width / 2.5,
    borderRadius: width / 3,
    height: width / 8,
    width: width / 8,
    zIndex: 2,
  },
});

export default BlabbedScreen;

// Alert.alert(
//   'Delete',
//   'Are you sure you want to remove this blab?',
//   [
//     {text: 'No', onPress: () => {}},
//     {
//       text: 'Yes',
//       onPress: () => {
//         removeElement(item);
//       },
//     },
//   ],
//   {cancelable: true},
// );
