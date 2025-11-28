import React, {Component, useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import Route from './src/routes';
import NetInfo from '@react-native-community/netinfo';
import {Alert, LogBox, StyleSheet} from 'react-native';
import OfflineScreen from './src/screens/OfflineScreen';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality ',
]);
LogBox.ignoreAllLogs();
class App extends Component {
  NetInfoSubscribtion = null;

  constructor(props) {
    super(props);
    this.state = {
      connection_status: true,
      connection_type: null,
      connection_net_reachable: false,
      connection_wifi_enabled: false,
      connection_details: null,
    };
  }

  componentDidMount() {
    this.NetInfoSubscribtion = NetInfo.addEventListener(
      this._handleConnectivityChange,
    );
    SplashScreen.hide();
    this.setState({...this.state, connection_status: false});
  }

  componentWillUnmount() {
    this.NetInfoSubscribtion && this.NetInfoSubscribtion();
  }

  _handleConnectivityChange = state => {
    this.setState({
      connection_status: state.isConnected,
      connection_type: state.type,
      connection_net_reachable: state.isInternetReachable,
      connection_wifi_enabled: state.isWifiEnabled,
      connection_details: state.details,
    });
  };

  render() {
    return <>{this.state.connection_status ? <Route /> : <OfflineScreen />}</>;
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#2193b0',
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
  },
});

export default App;
