import React from 'react';
import {View, Text, Image, Button, Dimensions, Linking} from 'react-native';
import no_blabs from '../../../public/assets/img/no_blabs.png';
const {width, height} = Dimensions.get('window');
const NoBlabs = () => (
  <View
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      height: null,
      width: width,
    }}>
    <Image
      source={no_blabs}
      style={{height: width / 2, width: width / 2, opacity: 0.75}}
      resizeMode="center"
    />
    <Text
      style={{
        color: 'white',
        marginTop: width / 20,
        fontSize: width / 25,
        textAlign: 'center',
      }}>
      Head to Instagram and import posts. {'\n'} Tap on '?' to learn how.
    </Text>
  </View>
);

export default NoBlabs;
