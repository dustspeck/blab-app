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
import LinearGradient from 'react-native-linear-gradient';

import {removeElements} from '../sharedMethods/DBManager';

import TopbarBranding from '../components/Misc/TopbarBranding';
import * as COLORS from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import SelectorTick from '../components/Blabbed/SelectorTick';
import BlabbedPreview from '../components/Blabbed/BlabbedPreview';
import SearchBox from '../components/Blabbed/SearchBox';

const {width, height} = Dimensions.get('window');

const BlabbedScreen = ({navigation}) => {
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
      if (data) {
        let history = await AsyncStorage.getItem('db_blabbed_history');
        history = JSON.parse(history);
        setData(history.data);
      } else {
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

  const handleFilter = (filter) => {
    setFilterText(filter);
    if (filter) {
      setIsFilter(true);
      setFilterData(data.filter((v) => v.username.includes(filter)));
    } else setIsFilter(false);
  };

  const handleDelete = async () => {
    setData(await removeElements(selected));
    setSelected([]);
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
              handleDelete();
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

      <SearchBox handleFilter={handleFilter} />

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
            <BlabbedPreview
              navigation={navigation}
              item={item}
              selected={selected}
              setSelected={setSelected}
              isSelection={isSelection}
              setIsSelection={setIsSelection}
            />
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
