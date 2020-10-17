import React, {useState, useEffect, createRef} from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import * as COLORS from '../../constants/colors';

const UrlInput = ({navigation}) => {
  const {height, width} = Dimensions.get('window');
  const TextBoxURL = createRef();

  const [post_url, setpost_url] = useState('');
  const [input_valid, setInputValid] = useState(false);

  const handleChange = (text) => {
    setpost_url(text);
    var valid_url = validateURL(text);
    if (valid_url === false) {
      setInputValid(false);
    } else {
      setInputValid(true);
    }
  };

  const handleSubmit = () => {
    if (input_valid) {
      var valid_url = validateURL(post_url);
      if (valid_url !== false) {
        navigation.navigate('ShareScreen', {valid_url});
      } else {
        dsiplayError();
      }
    }
  };

  const validateURL = (url) => {
    if (url) {
      if (!url.startsWith('https://')) {
        url = 'https://'.concat(url);
      }
      if (
        !url.startsWith('https://www.instagram.com/p/') &&
        !url.startsWith('https://www.instagram.com/reel/')
      ) {
        return false;
      }
      try {
        let validate_url = new URL(url);
        return url;
      } catch (_) {
        return false;
      }
    } else return false;
  };

  const dsiplayError = () => {
    Alert.alert(
      'Error Occured',
      'Invalid URL',
      [{text: 'OK', onPress: () => navigation.navigate('HomeScreen')}],
      {cancelable: false},
    );
  };

  return (
    <>
      {/* Card Style */}
      {/* <View
        style={{
          height: null,
          width,
          padding: 15,
          backgroundColor: COLORS.GRAY_15,
        }}>
        <View
          style={{
            padding: 15,
            backgroundColor: COLORS.GRAY_25,
            borderRadius: 20,
            overflow: 'hidden',
          }}> */}
      {/* Card Style ^ */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'stretch',
        }}>
        <TextInput
          ref={TextBoxURL}
          style={
            input_valid
              ? {...Styles.textBox, borderColor: COLORS.PRIMARY_COLOR}
              : Styles.textBox
          }
          onChangeText={(post_url) => handleChange(post_url)}
          onFocus={() => handleChange(post_url.toString())}
          onSubmitEditing={handleSubmit}
          placeholder="Enter Instagram post URL"
          placeholderTextColor="#aaaaaa"
          spellCheck={false}
          autoCorrect={false}
          autoCapitalize={'none'}
          returnKeyType="done"
          selectTextOnFocus={true}
          // autoFocus={true}
        />
        <LinearGradient
          colors={
            input_valid
              ? [COLORS.PRIMARY_COLOR, COLORS.SECONDARY_COLOR]
              : [COLORS.DIS_PRIMARY_COLOR, COLORS.DIS_SECONDARY_COLOR]
          }
          style={Styles.touchButton}>
          <TouchableOpacity
            disabled={!input_valid}
            style={{width: 50, height: 50}}
            activeOpacity={0.8}
            onPress={handleSubmit}>
            <Icon
              name="arrow-forward-outline"
              solid
              color="white"
              size={24}
              style={{
                flex: 1,
                alignSelf: 'center',
                textAlignVertical: 'center',
              }}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
      {/* Card Style */}
      {/* </View>
      </View> */}
      {/* Card Style ^*/}
    </>
  );
};

const Styles = StyleSheet.create({
  textBox: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    margin: 16,
    marginRight: 8,
    marginRight: 4,
    marginBottom: 26,
    alignSelf: 'stretch',
    borderWidth: 1,
    backgroundColor: '#181818',
  },
  touchButton: {
    elevation: 2,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#2196F3',
    width: 50,
    height: 50,
    margin: 16,
    marginLeft: 2,
    marginTop: 18,
    borderWidth: 0,
  },
  inputInfo: {
    color: 'white',
    marginTop: 30,
    marginBottom: 0,
    marginLeft: 40,
    marginRight: 'auto',
    color: 'grey',
  },
});

export default UrlInput;