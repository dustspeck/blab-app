import React, {Component, useEffect, useState, useCallback} from 'react';
import {Linking, AppRegistry} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import ShareScreen from './components/pages/ShareScreen';
import HomeScreen from './components/pages/HomeScreen';
import LoginScreen from './components/pages/LoginScreen';
import ViewScreen from './components/pages/ViewScreen';
import BlabScreen from './components/pages/BlabScreen';

const Stack = createStackNavigator();

const App: () => React$Node = ({navigation}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{title: 'Blab for IG', headerShown: false}}
        />
        <Stack.Screen
          name="ViewScreen"
          component={ViewScreen}
          options={{title: 'Blab for IG'}}
        />
        <Stack.Screen
          name="ShareScreen"
          component={ShareScreen}
          options={{
            title: 'Share',
          }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{title: 'Instagram', headerShown: false}}
        />
        <Stack.Screen
          name="BlabScreen"
          component={BlabScreen}
          options={{title: 'Blab for IG'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
AppRegistry.registerComponent('App', () => App);
