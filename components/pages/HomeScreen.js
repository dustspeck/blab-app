import React, {useState, useEffect} from 'react';
import {View, Text, Button, TextInput, Linking, Alert} from 'react-native';
import ShareMenu from 'react-native-share-menu';

const HomeScreen = ({navigation, shared_data}) => {
  const [post_url, setpost_url] = useState('');

  useEffect(() => {
    ShareMenu.getSharedText((post_url) => {
      if (post_url && validateURL(post_url))
        navigation.navigate('ShareScreen', {post_url});
      else {
        dsiplayError();
      }
    });
  }, []);

  useEffect(() => {
    const post_url = Linking.getInitialURL().then((post_url) => {
      post_url = validateURL(post_url);
      if (post_url) {
        navigation.navigate('ShareScreen', {post_url});
      }
    });

    return () => {};
  });

  const validateURL = (url) => {
    if (url) {
      if (!url.startsWith('https://')) {
        url = 'https://'.concat(url);
      }
      if (!url.startsWith('https://www.instagram.com/p/')) return false;
      try {
        let validate_url = new URL(url);
        return url;
      } catch (_) {
        return false;
      }
    }
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
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(post_url) => setpost_url(post_url)}
        value={post_url}
      />

      <Button
        title="Share"
        onPress={() => {
          if (post_url && validateURL(post_url))
            navigation.navigate('ShareScreen', {post_url});
          else {
            dsiplayError();
          }
        }}
      />
    </View>
  );
};

export default HomeScreen;
