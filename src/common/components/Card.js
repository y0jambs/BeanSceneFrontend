import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import fonts from '../../assets/fonts';
import colors from '../../util/colors';
import CustomText from './CustomText';
import {scale, verticalScale} from 'react-native-size-matters';
import CustomButton from './CustomButton';
import Icons from './Icons';

const Card = ({
  photo,
  name,
  dietary_flags,
  price,
  description,
  onDelete,
  availability,
  button,
  onEdit,
  onPress,
  totalPrice,
  uri,
  icons,
}) => {
  return (
    <TouchableOpacity
      style={{
        height: verticalScale(300),
        backgroundColor: colors.white,
        width: 500,
        marginRight: scale(10),
        elevation: 5,
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
      }}>
      {icons && (
        <View
          style={{
            alignSelf: 'flex-end',
            flexDirection: 'row',
            width: scale(60),
            marginTop: verticalScale(10),
            marginHorizontal: scale(10),
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity onPress={onEdit}>
            <Icons
              family="AntDesign"
              name="edit"
              color={colors.red}
              size={22}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Icons
              family="EvilIcons"
              name="trash"
              color={colors.red}
              size={22}
            />
          </TouchableOpacity>
        </View>
      )}

      {photo && (
        <Image
          source={photo}
          style={{height: '50%', width: '100%', resizeMode: 'cover'}}
        />
      )}
      {uri && (
        <Image
          source={{uri: uri}}
          style={{height: '50%', width: '100%', resizeMode: 'cover'}}
        />
      )}
      <View
        style={{
          paddingHorizontal: scale(10),
          paddingVertical: verticalScale(10),
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CustomText label="Name:" fontFamily={fonts.medium} />
          <CustomText label={`${name}`} textStyle={{marginLeft: 10}} />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CustomText label="Description:" fontFamily={fonts.medium} />
          <CustomText
            label={`${description}`}
            container={{width: '75%', marginLeft: scale(10)}}
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CustomText label="Dietary:" fontFamily={fonts.medium} />
          <CustomText
            label={`${dietary_flags}`}
            textStyle={{marginLeft: scale(10), width: '90%'}}
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CustomText label="Price:" fontFamily={fonts.medium} />
          <CustomText label={`$${price}`} textStyle={{marginLeft: scale(10)}} />
        </View>
        {availability && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText label="Available:" fontFamily={fonts.medium} />
            <CustomText
              label={`   ${
                availability ? 'Available' : 'Unavailable due to ingredients'
              }`}
            />
          </View>
        )}
        {totalPrice && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText label="Total Price:" fontFamily={fonts.medium} />
            <CustomText label={`$${price}`} />
          </View>
        )}
        {button && (
          <CustomButton
            alignSelf="flex-end"
            title="Place Order"
            onPress={onPress}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Card;
