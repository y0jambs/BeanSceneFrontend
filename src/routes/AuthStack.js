import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Auth/Login';
const AuthStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="login" component={Login} />
    </Stack.Navigator>
  );
};

export default AuthStack;
