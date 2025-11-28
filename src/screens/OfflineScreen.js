import {View, Text, SafeAreaView, Image} from 'react-native';
import React from 'react';
import CustomText from '../common/components/CustomText';
import images from '../assets/images';
import colors from '../util/colors';
import {verticalScale} from 'react-native-size-matters';

const OfflineScreen = () => {
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={images.networkDown}
        style={{
          height: '30%',
          resizeMode: 'contain',
          tintColor: colors.darkBlue,
        }}
      />
      <CustomText
        label="No Intenet Connection"
        fontSize={verticalScale(16)}
        marginTop={10}
      />
      <CustomText label="You are not connected to the internet" />
    </SafeAreaView>
  );
};

export default OfflineScreen;
