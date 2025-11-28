import React from 'react';
import {TouchableOpacity, ActivityIndicator} from 'react-native';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import CustomText from './CustomText';
// import colors from 'util/colors';
import colors from '../../util/colors';

const CustomButton = ({
  title,
  onPress,
  fontSize,
  color,
  textStyle,
  containerStyle,
  width,
  height,
  borderRadius,
  backgroundColor,
  alignSelf,
  justifyContent,
  alignItems,
  marginBottom,
  marginTop,
  fontFamily,
  disabled,
  loading,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.6}
      style={[
        {
          backgroundColor: backgroundColor || colors.darkBlue,
          width: width || '35%',
          height: height || verticalScale(41),
          borderRadius: borderRadius || moderateScale(10),
          marginBottom: marginBottom || 0,
          marginTop: marginTop || 0,
          justifyContent: justifyContent || 'center',
          alignItems: alignItems || 'center',
          alignSelf: alignSelf || 'flex-start',
        },
        containerStyle,
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <CustomText
          fontSize={fontSize || verticalScale(12)}
          textStyle={textStyle}
          color={color || colors.white}
          label={title}
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
