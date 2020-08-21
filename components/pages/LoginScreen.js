import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Clipboard,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import WebView from 'react-native-webview';
import ShareMenu from 'react-native-share-menu';

const LoginScreen = ({route, navigation}) => {
  const {width, height} = Dimensions.get('window');

  // IDR what this is
  useEffect(() => {
    ShareMenu.getSharedText((text) => {
      console.log(text);
    });
  });

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: '#212121',
          minHeight: height - 50,
        }}>
        <View
          style={{
            flex: 10,
            // backgroundColor: 'green'
          }}>
          <View
            style={{
              flex: 1,
              // backgroundColor: 'white',
              // margin: 10,
            }}>
            {/* WebView */}
            <WebView source={{uri: 'https://www.instagram.com'}} />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            // backgroundColor: 'yellow'
          }}>
          <View
            style={{
              flex: 1,
              // backgroundColor: 'white',
              margin: 10,
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <View
                style={{
                  flex: 1,
                  // backgroundColor: 'blue'
                }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={Styles.touchButton}
                  onPress={() => {
                    navigation.navigate('HomeScreen', {load: true});
                  }}>
                  <Text style={Styles.buttonText}>
                    <Icon name="arrow-left" style={Styles.buttonText} /> {'  '}
                    Back to Blab
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const Styles = StyleSheet.create({
  touchButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});

export default LoginScreen;
