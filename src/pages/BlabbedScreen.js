import React, {useState, useEffect, useRef} from 'react';
import {FlatList, Alert} from 'react-native';
import {StyleSheet, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {removeElements} from '../sharedMethods/DBManager';

import * as COLORS from '../constants/colors';
import TopbarBranding from '../components/Misc/TopbarBranding';
import BlabbedPreview from '../components/Blabbed/BlabbedPreview';
import FloatingOptions from '../components/Blabbed/FloatingOptions';
import SelectorTick from '../components/Blabbed/SelectorTick';
import SearchBox from '../components/Blabbed/SearchBox';
import NoBlabs from '../components/Blabbed/NoBlabs';
import FilterEmpty from '../components/Blabbed/FilterEmpty';
import {ListHeader, ListFooter} from '../components/Blabbed/ListHeaderFooter';

const {width, height} = Dimensions.get('window');

const BlabbedScreen = ({navigation}) => {
  const [data, setData] = useState([]);
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
    filter = filter.toString().toLowerCase();
    setFilterText(filter);
    if (filter) {
      setIsFilter(true);
      setFilterData(data.filter((v) => v.username.includes(filter)));
    } else setIsFilter(false);
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete the selected items?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            setData(await removeElements(selected));
            setSelected([]);
          },
        },
        {text: 'No'},
      ],
    );
  };

  const handleToTop = () => {
    FlatListRef.current.scrollToOffset({animated: true, offset: 0});
  };

  useEffect(() => {
    connectData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', connectData);
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <TopbarBranding navigation={navigation} />
      <FloatingOptions
        data={data}
        isSelection={isSelection}
        setIsSelection={setIsSelection}
        selected={selected}
        setSelected={setSelected}
        allSelected={allSelected}
        setAllSelected={setAllSelected}
        handleDelete={handleDelete}
        handleToTop={handleToTop}
      />
      <SearchBox handleFilter={handleFilter} filterText={filterText} />
      <FlatList
        ref={FlatListRef}
        style={Styles.blabbedGrid}
        numColumns={3}
        keyExtractor={(item) => item.id}
        data={isFilter ? filterData : data}
        ListEmptyComponent={isFilter ? <FilterEmpty /> : <NoBlabs />}
        ListHeaderComponent={<ListHeader />}
        ListFooterComponent={<ListFooter />}
        renderItem={({item}) => (
          <BlabbedPreview
            navigation={navigation}
            item={item}
            selected={selected}
            setSelected={setSelected}
            isSelection={isSelection}
            setIsSelection={setIsSelection}
          />
        )}
      />
    </>
  );
};

const Styles = StyleSheet.create({
  blabbedGrid: {
    backgroundColor: COLORS.GRAY_15,
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
});

export default BlabbedScreen;
