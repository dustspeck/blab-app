import React, {useState, useEffect} from 'react';
import {View, Text, Button, TextInput, Linking} from 'react-native';

const HomeScreen = ({navigation}) => {
  const [post_url, setpost_url] = useState('');

  const validateURL = (url) => {
    if (url) {
      if (!url.startsWith('https://')) {
        url = 'https://'.concat(_url);
      }
      try {
        let validate_url = new URL(url);
        return url;
      } catch (_) {
        return false;
      }
    }
  };

  useEffect(() => {
    const post_url = Linking.getInitialURL().then((post_url) => {
      post_url = validateURL(post_url);
      if (post_url) {
        navigation.navigate('ShareScreen', {post_url});
      }
    });

    return () => {};
  });

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
          if (post_url) navigation.navigate('ShareScreen', {post_url});
        }}
      />
    </View>
  );
};

export default HomeScreen;
