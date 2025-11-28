import {
  Alert,
  AsyncStorage,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {verticalScale, ScaledSheet} from 'react-native-size-matters';
import colors from '../../../util/colors';
import Header from '../../../common/components/Header';
import Card from './items/Card';

const Home = ({navigation}) => {
  const [userType, setUserType] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('user_type').then(res => {
      setUserType(res);
      console.log('USER TYPE:', res);
    });
  }, []); 

  const onLogout = () => {
    AsyncStorage.removeItem('user_type').then(() => {
      AsyncStorage.removeItem('user_id').then(() =>
        navigation.navigate('AuthStack'),
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header title="Home" />
        <View style={styles.card}>
          {/* PLACE ORDER: Manager + Staff + Admin (everyone) */}
          <Card
            text="Place Order"
            family="AntDesign"
            name="search1"
            onPress={() => {
              if (
                userType === 'manager' ||
                userType === 'staff' ||
                userType === 'admin'
              ) {
                navigation.navigate('placeOrder');
              } else {
                Alert.alert('Alert', "You don't have access");
              }
            }}
          />

          {/* VIEW REPORT: Manager + Admin */}
          <Card
            text="View Report"
            family="Octicons"
            name="report"
            onPress={() => {
              if (userType === 'manager' || userType === 'admin') {
                navigation.navigate('viewReport');
              } else {
                Alert.alert('Alert', "You don't have access");
              }
            }}
          />

          {/* MANAGE STAFF: Admin only */}
          <Card
            text="Manage Staff"
            family="Ionicons"
            name="person-outline"
            onPress={() => {
              if (userType === 'admin') {
                navigation.navigate('manageStaff');
              } else {
                Alert.alert('Alert', "You don't have access");
              }
            }}
          />

          {/* VIEW ORDER: everyone can view */}
          <Card
            text="View Order"
            family="Fontisto"
            name="preview"
            onPress={() => navigation.navigate('viewOrder')}
          />

          {/* MANAGE MENU: Manager + Admin */}
          <Card
            text="Manage Menu"
            family="Fontisto"
            name="preview"
            onPress={() => {
              if (userType === 'manager' || userType === 'admin') {
                navigation.navigate('manageMenu');
              } else {
                Alert.alert('Alert', "You don't have access");
              }
            }}
          />

          {/* LOG OUT */}
          <Card
            text="Log Out"
            family="Fontisto"
            name="preview"
            onPress={onLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  card: {
    marginHorizontal: '20@s',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '20@vs',
    justifyContent: 'space-between',
  },
});

export default Home;