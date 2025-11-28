import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Main/Home';
import PlaceOrder from '../screens/Main/PlaceOrder';
import ViewOrder from '../screens/Main/ViewOrder';
import ManageStaff from '../screens/Main/ManageStaff';
import ManageMenu from '../screens/Main/ManageMenu';
import ViewReport from '../screens/Main/ViewReport';
import Cart from '../screens/Main/Cart';
const MainStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="placeOrder" component={PlaceOrder} />
      <Stack.Screen name="viewOrder" component={ViewOrder} />
      <Stack.Screen name="manageStaff" component={ManageStaff} />
      <Stack.Screen name="manageMenu" component={ManageMenu} />
      <Stack.Screen name="viewReport" component={ViewReport} />
      <Stack.Screen name="cart" component={Cart} />
    </Stack.Navigator>
  );
};

export default MainStack;

const styles = StyleSheet.create({});
