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
import {
  Linking,
  PermissionsAndroid,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import * as COLORS from '../../constants/colors';

const UrlInputCard = ({navigation, isKeyboardShown}) => {
  const {height, width} = Dimensions.get('window');
  const TextBoxURL = createRef();

  const [post_url, setpost_url] = useState('');
  const [input_valid, setInputValid] = useState(false);
  const [editable, setEditable] = useState(false);

  const handleChange = (text) => {
    setpost_url(text);
    var valid_url = validateURL(text);
    if (valid_url === false) {
      setInputValid(false);
    } else {
      setInputValid(true);
    }
  };

  const askPermissions = async () => {
    try {
      let check = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (!check) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log(true);
          return true;
        } else {
          console.log(false);
          return false;
        }
      } else {
        console.log(true);
        return true;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const handleSubmit = async () => {
    let perm = await askPermissions();
    if (input_valid && perm) {
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

  useEffect(() => {
    setTimeout(() => {
      setEditable(true);
    }, 10);
  }, []);

  return (
    <>
      <View
        style={{
          height: null,
          width,
          padding: 15,
          backgroundColor: COLORS.GRAY_15,
        }}>
        <LinearGradient
          colors={[COLORS.GRAY_25, COLORS.GRAY_20]}
          style={{
            padding: 15,
            paddingTop: 8,
            // backgroundColor: COLORS.GRAY_25,
            borderRadius: 20,
            overflow: 'hidden',
          }}>
          <Text
            style={{
              fontSize: 16,
              color: '#666',
              marginLeft: 16,
              marginBottom: 4,
            }}>
            <Icon name="link" style={{fontSize: 16}} />
            {'  Enter the Instagram post URL'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'stretch',
            }}>
            <TextInput
              editable={editable}
              ref={TextBoxURL}
              style={
                input_valid
                  ? {...Styles.textBox, borderColor: COLORS.PRIMARY_COLOR}
                  : Styles.textBox
              }
              onChangeText={(post_url) => handleChange(post_url)}
              onFocus={() => handleChange(post_url.toString())}
              onSubmitEditing={handleSubmit}
              placeholder="https://www.instagram.com/p/XXXXXX"
              placeholderTextColor="#aaaaaa"
              spellCheck={false}
              autoCorrect={false}
              autoCapitalize={'none'}
              returnKeyType="done"
              selectTextOnFocus={true}
              // autoFocus={true}
            />
            {input_valid && (
              <LinearGradient
                colors={
                  input_valid
                    ? [COLORS.PRIMARY_COLOR, COLORS.SECONDARY_COLOR]
                    : [COLORS.DIS_PRIMARY_COLOR, COLORS.DIS_SECONDARY_COLOR]
                }
                style={Styles.touchButton}>
                <TouchableOpacity
                  disabled={!input_valid}
                  style={{width: width / 8, height: width / 8}}
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
            )}
          </View>
        </LinearGradient>
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
    margin: 4,
    marginRight: 4,
    alignSelf: 'stretch',
    borderWidth: 1,
    backgroundColor: 'rgba(30, 30, 30, 1)',
  },
  touchButton: {
    elevation: 2,
    borderWidth: 1,
    borderRadius: Dimensions.get('window').width / 16,
    borderColor: '#2196F3',
    width: Dimensions.get('window').width / 8,
    height: Dimensions.get('window').width / 8,
    margin: 4,
    marginLeft: 2,
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

export default UrlInputCard;
