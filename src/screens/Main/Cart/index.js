import {View, Text, SafeAreaView, ScrollView, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../../util/colors';
import Header from '../../../common/components/Header';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import CustomText from '../../../common/components/CustomText';
import fonts from '../../../assets/fonts';
import CustomButton from '../../../common/components/CustomButton';
import {orderCheckout} from '../../../services/Api';

const Cart = ({navigation, route}) => {
  const order = route.params;
  const [laoder, setLoader] = useState(false);
  useEffect(() => {
    // console.log('OOOOOOOOOOOOOO', order);
  }, []);
  const placeOrder = () => {
    if (order?.order.length === 0) {
      alert('Cart is empty');
    } else {
      const orders = JSON.stringify(order.order);
      console.log('order', order);
      const payload = {order: orders, status: 'inprogress'};
      console.log('payload', payload);
      setLoader(true);

      orderCheckout(payload)
        .then(res => Alert.alert('Order', 'Order added successfully'))
        .catch(e => console.log('Error', e))
        .finally(() => setLoader(false));
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView>
        <Header title="Cart" icon onPress={() => navigation.goBack()} />

        {order.order.slice(0, 1).map(item => {
          return (
            <>
              <View
                style={{
                  marginHorizontal: scale(20),
                  marginTop: verticalScale(20),
                }}>
                <CustomText label="Sitting Place" fontFamily={fonts.bold} />
              </View>
              {item.Balcony.length == 0 ? null : (
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: scale(20),
                    alignItems: 'center',
                    marginTop: verticalScale(15),
                  }}>
                  <CustomText label="Balcony" fontFamily={fonts.bold} />
                  <Text
                    style={{
                      marginLeft: scale(20),
                      fontFamily: fonts.regular,
                      color: colors.lightBlue,
                      fontSize: moderateScale(12),
                    }}>
                    {item?.Balcony}
                  </Text>
                </View>
              )}
              {item.Main.length == 0 ? null : (
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: scale(20),
                    alignItems: 'center',
                    marginTop: verticalScale(15),
                  }}>
                  <CustomText label="Main" fontFamily={fonts.bold} />
                  <Text
                    style={{
                      marginLeft: scale(20),
                      fontFamily: fonts.regular,
                      color: colors.lightBlue,
                      fontSize: moderateScale(12),
                    }}>
                    {item?.Main}
                  </Text>
                </View>
              )}
              {item.Outside.length == 0 ? null : (
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: scale(20),
                    alignItems: 'center',
                    marginTop: verticalScale(15),
                  }}>
                  <CustomText label="Outside" fontFamily={fonts.bold} />
                  <Text
                    style={{
                      marginLeft: scale(20),
                      fontFamily: fonts.regular,
                      color: colors.lightBlue,
                      fontSize: moderateScale(12),
                    }}>
                    {item?.Outside}
                  </Text>
                </View>
              )}
            </>
          );
        })}
        {order?.order.length == 0 ? (
          <View
            style={{
              flex: 1,
              marginTop: verticalScale(40),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CustomText label="Your Cart is Empty" />
          </View>
        ) : (
          order?.order.map(item => {
            const add = Number(item.item.price[0]);
            const add2 = Number(item.item.price[1]);
            const total = add + add2;

            console.log('Cart Itemsss', item.item);
            return (
              <>
                <View
                  style={{
                    marginHorizontal: scale(20),
                    marginTop: verticalScale(15),
                    borderBottomWidth: 1,
                    paddingBottom: verticalScale(10),
                    borderColor: colors.bocColor,
                  }}>
                  <View>
                    <CustomText label="Dish Name" fontFamily={fonts.bold} />
                    <CustomText label={item.item.name} />

                    <View style={{marginTop: verticalScale(10)}} />

                    <View style={{marginTop: verticalScale(10)}} />

                    <CustomText label="Dish Price" fontFamily={fonts.bold} />
                    <CustomText label={`$${item.item.price}`} />
                  </View>
                </View>
              </>
            );
          })
        )}
        <View
          style={{
            marginHorizontal: scale(20),
            marginTop: verticalScale(20),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <CustomText
            label="Total Price"
            fontFamily={fonts.bold}
            fontSize={moderateScale(15)}
          />
          <Text
            style={{
              fontFamily: fonts.medium,
              color: colors.lightBlue,
              marginLeft: 20,
              fontSize: moderateScale(15),
            }}>
            $
            {order?.order?.reduce((total, cartItem) => {
              console.log('total', cartItem.item.price);
              return parseInt(total) + parseInt(cartItem.item.price);
            }, 0)}
          </Text>
        </View>
        <CustomButton
          width="90%"
          alignSelf="center"
          title="Place Order"
          onPress={placeOrder}
          loading={laoder}
          containerStyle={{
            marginTop: verticalScale(30),
            marginBottom: verticalScale(30),
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cart;
