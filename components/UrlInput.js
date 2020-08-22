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
import Icon from 'react-native-vector-icons/Ionicons';

const UrlInput = ({navigation}) => {
  const TextBoxURL = createRef();

  const [post_url, setpost_url] = useState('');
  const [border_color, setBorderColor] = useState('#eeeeee');
  const [button_color, setButtonColor] = useState('#a0a0a0');
  const [input_valid, setInputValid] = useState(false);

  const handleChange = (text) => {
    setpost_url(text);
    var valid_url = validateURL(text);
    if (valid_url === false) {
      setBorderColor('#aa0000');
      setButtonColor('#a0a0a0');
      setInputValid(false);
    } else {
      setBorderColor('#00aa00');
      setButtonColor('#2196F3');
      setInputValid(true);
    }
  };

  const validateURL = (url) => {
    if (url) {
      if (!url.startsWith('https://')) {
        url = 'https://'.concat(url);
      }
      if (!url.startsWith('https://www.instagram.com/p/')) {
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'stretch',
        }}>
        <TextInput
          ref={TextBoxURL}
          style={{
            ...Styles.textBox,
            borderColor: border_color,
          }}
          onChangeText={(post_url) => handleChange(post_url)}
          onFocus={() => handleChange(post_url.toString())}
          onBlur={() => {
            setBorderColor('#eeeeee');
          }}
          placeholder="Enter the Instagram post URL"
          placeholderTextColor="#aaaaaa"
          spellCheck={false}
          autoCorrect={false}
          autoCapitalize={'none'}
          returnKeyType="done"
          // autoFocus={true}
          // selectTextOnFocus={true}
        />
        <TouchableOpacity
          disabled={!input_valid}
          style={{...Styles.touchButton, backgroundColor: button_color}}
          activeOpacity={0.8}
          onPress={() => {
            if (input_valid) {
              var valid_url = validateURL(post_url);
              if (valid_url !== false) {
                navigation.navigate('ShareScreen', {valid_url});
              } else {
                dsiplayError();
              }
            }
          }}>
          <Icon
            name="arrow-forward-outline"
            solid
            color="white"
            size={24}
            style={{flex: 1, alignSelf: 'center', textAlignVertical: 'center'}}
          />
        </TouchableOpacity>
      </View>
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
    paddingVertical: 5,
    paddingHorizontal: 12.5,
    backgroundColor: '#2196F3',
    margin: 16,
    marginLeft: 0,
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
