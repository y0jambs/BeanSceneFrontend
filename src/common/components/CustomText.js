import React from 'react';
import {verticalScale, scale} from 'react-native-size-matters';
import {TouchableOpacity, Text} from 'react-native';
import colors from '../../util/colors';
import fonts from '../../assets/fonts';
const CustomText = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={props.onPress}
      disabled={!props.onPress}
      style={[props.container]}>
      {props.label && (
        <Text
          style={[
            {
              fontSize: props.fontSize || verticalScale(11),
              color: props.color || colors.lightBlue,
              marginTop: verticalScale(props.marginTop || 0),
              marginBottom: verticalScale(props.marginBottom || 0),
              marginLeft: scale(props.marginLeft || 0),
              marginRight: scale(props.marginRight || 0),
              alignSelf: props.alignSelf || 'flex-start',
              fontWeight: props.fontWeight,
              fontStyle: props.fontStyle,
              fontFamily: props.fontFamily || fonts.regular,
            },
            props.textStyle,
          ]}>
          {props.label}
          {props.children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomText;
