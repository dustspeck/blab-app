import React, {Component, useEffect} from 'react';
import {Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import ShareScreen from './components/pages/ShareScreen';
import HomeScreen from './components/pages/HomeScreen';
import LoginScreen from './components/pages/LoginScreen';

const Stack = createStackNavigator();

const App: () => React$Node = ({navigation}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{title: 'IG Send', headerShown: false}}
        />
        <Stack.Screen
          name="ShareScreen"
          component={ShareScreen}
          options={{
            title: 'Share',
            // headerShown: false
          }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{title: 'Instagram', headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
