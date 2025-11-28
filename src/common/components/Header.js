import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import colors from '../../util/colors';
import CustomText from './CustomText';
import Icons from './Icons';
import fonts from '../../assets/fonts';
const Header = ({title, icon, onPress, rightIcon, cart, onCart}) => {
  return (
    <View
      style={{
        height: verticalScale(50),
        backgroundColor: colors.darkBlue,
        borderBottomLeftRadius: 30,
        elevation: 5,
        borderBottomRightRadius: 30,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',

        paddingHorizontal: scale(10),
      }}>
      {icon ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
          <Icons
            family="Feather"
            name="chevron-left"
            size={25}
            color={colors.white}
          />
        </TouchableOpacity>
      ) : (
        <View style={{height: 25, width: 25}} />
      )}
      <CustomText
        label={title}
        fontSize={15}
        fontFamily={fonts.medium}
        color={colors.white}
      />
      <View>
        {rightIcon ? (
          <TouchableOpacity
            onPress={onCart}
            activeOpacity={0.6}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              width: 40,
              backgroundColor: colors.white,
              justifyContent: 'center',
              borderRadius: 20,
            }}>
            <Icons
              family="AntDesign"
              name="shoppingcart"
              size={30}
              color={colors.darkBlue}
            />
            <View
              style={{
                position: 'absolute',
                right: 7,
                top: 5,
                zIndex: 500,
                overflow: 'hidden',
              }}>
              <Text
                style={{fontSize: 14, color: 'red', fontFamily: fonts.medium}}>
                {cart}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{height: 28, width: 28}} />
        )}
      </View>
    </View>
  );
};

export default Header;
