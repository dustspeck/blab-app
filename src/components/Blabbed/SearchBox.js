import React, {useRef} from 'react';
import {View, Text, TextInput, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import * as COLORS from '../../constants/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';

const SearchBox = ({handleFilter, filterText}) => {
  const Searchbox = useRef();
  const {width, height} = Dimensions.get('window');
  return (
    <LinearGradient
      colors={[COLORS.GRAY_15, 'transparent']}
      style={{
        height: height / 12 - 5,
        width,
        position: 'absolute',
        top: height / 12 - 5,
        zIndex: 20,
      }}>
      {filterText ? (
        <Icon
          name="close-circle"
          onPress={() => {
            handleFilter('');
            Searchbox.current.clear();
          }}
          style={{
            position: 'absolute',
            height: height / 12 - 5,
            marginLeft: width - 50,
            marginHorizontal: 15,
            left: 0,
            zIndex: 20,
            fontSize: 30,
            textAlignVertical: 'center',
            color: COLORS.DIS_PRIMARY_COLOR,
          }}
        />
      ) : null}

      <TextInput
        ref={Searchbox}
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
    </LinearGradient>
  );
};

export default SearchBox;
