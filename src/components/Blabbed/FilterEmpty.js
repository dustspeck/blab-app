import React from 'react';
import {View, Text, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
const FilterEmoty = () => (
  <View
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      height: null,
      width: width,
    }}>
    <Text style={{color: 'white'}}>No items to show here.</Text>
  </View>
);

export default FilterEmoty;
