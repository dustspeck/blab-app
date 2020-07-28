import React, {Fragment} from 'react';
import {View, Text, StyleSheet, Clipboard, Button} from 'react-native';
import WebView from 'react-native-webview';

const LoginScreen = ({route, navigation}) => {
  return (
    <Fragment>
      <View style={{flex: 1}}>
        <WebView
          source={{uri: 'https://www.instagram.com'}}
          style={{margin: 10, marginBottom: 10}}
        />
        <View style={{margin: 20, flexDirection: 'row', flexWrap: 'wrap'}}>
          <Text
            style={{
              marginHorizontal: 50,
              textAlignVertical: 'center',
            }}>
            Press Done after logging in:
          </Text>
          <Button
            title="Done"
            style={{position: 'absolute', bottom: 0, margin: 20}}
            onPress={() => {
              navigation.navigate('HomeScreen');
            }}
          />
        </View>
      </View>
    </Fragment>
  );
};

const Styles = StyleSheet.create({
  centerAlign: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
});

export default LoginScreen;
