import React, {Component, useEffect, useState, useCallback} from 'react';
import {Linking, AppRegistry, Dimensions} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import * as COLORS from './src/constants/colors';

import HomeScreen from './src/pages/HomeScreen';
import BlabbedScreen from './src/pages/BlabbedScreen';
import ShareScreen from './src/pages/ShareScreen';
import LoginScreen from './src/pages/LoginScreen';
import ViewScreen from './src/pages/ViewScreen';
import BlabScreen from './src/pages/BlabScreen';
import ProfileScreen from './src/pages/ProfileScreen';
import WelcomeScreen from './src/pages/WelcomeScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const {width, height} = Dimensions.get('window');
const HomeStackScreen = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{title: 'Blab for IG', headerShown: false}}
        initialParams={{load: true}}
      />
    </Stack.Navigator>
  );
};

const MainScreen = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home-sharp';
          } else if (route.name === 'Posts') {
            iconName = 'grid';
          } else if (route.name === 'Account') {
            iconName = 'person-sharp';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: COLORS.PRIMARY_COLOR,
        inactiveTintColor: 'gray',
        keyboardHidesTabBar: true,
        showLabel: false,
        style: {
          backgroundColor: 'rgba(30, 30, 30, 1)',
          height: height / 12,
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Posts" component={BlabbedScreen} />
      <Tab.Screen name="Account" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const App: () => React$Node = ({navigation}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainScreen">
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{headerShown: false}}
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
