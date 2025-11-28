import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  ScaledSheet,
  verticalScale,
  moderateScale,
  scale,
} from 'react-native-size-matters';
import colors from '../../../../util/colors';
import CustomText from '../../../../common/components/CustomText';
import Icons from '../../../../common/components/Icons';
import fonts from '../../../../assets/fonts';
const Card = ({text, family, name, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={{
        height: verticalScale(120),
        width: '45%',
        elevation: 5,
        borderRadius: moderateScale(5),
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(10),
        marginBottom: verticalScale(20),
      }}
      onPress={onPress}>
      <Icons family={family} name={name} color={colors.lightBlue} size={45} />
      <CustomText
        label={text}
        color={colors.darkBlue}
        container={{marginTop: verticalScale(10)}}
      />
    </TouchableOpacity>
  );
};

export default Card;
