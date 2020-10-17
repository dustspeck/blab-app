import React from 'react';
import {View, Text, TextInput, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import * as COLORS from '../../constants/colors';

const SearchBox = ({handleFilter}) => {
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
    </LinearGradient>
  );
};

export default SearchBox;
