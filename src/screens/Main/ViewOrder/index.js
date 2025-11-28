import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  moderateScale,
  scale,
  ScaledSheet,
  verticalScale,
} from 'react-native-size-matters';
import colors from '../../../util/colors';
import Card from '../../../common/components/Card';
import Header from '../../../common/components/Header';
import CustomText from '../../../common/components/CustomText';
import Icons from '../../../common/components/Icons';
import {getAllOrder, updateOrder} from '../../../services/Api';
import fonts from '../../../assets/fonts';
import CustomButton from '../../../common/components/CustomButton';

const ViewOrder = ({route, navigation}) => {
  const [details, setDetails] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    getAllOrder()
      .then(res => {
        const json = res.data;
        setData(json);
      })
      .catch(e => console.log('Error', e));
  }, []);

  const updateStatsu = (ID, id) => {
    const objData = [];
    data.map(x => {
      const parsedData = JSON.parse(x.order);
      let new_data = {};
      new_data.id = x.id;
      if (x.id == id && x.status == 'inprogress') {
        new_data.status = 'completed';
        parsedData.filter(i => (i.status = 'completed'));
      } else if (x.id == id && x.status == 'completed') {
        new_data.status = 'inprogress';
        parsedData.filter(i => (i.status = 'inprogress'));
      } else {
        new_data.status = x.status;
      }
      new_data.order = JSON.stringify(parsedData);
      objData.push(new_data);
    });

    setData(objData);
    updateOrder(ID, objData)
      .then(res => {
        console.log('Your order status is updated', res);
      })
      .catch(e => console.log('errr', e));
    alert('Your order status is updated');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header icon title="View Order" onPress={() => navigation.goBack()} />
        <View style={{flexDirection: 'row', alignItems: 'center', margin: 20}}>
          <CustomText label="Note:" fontFamily={fonts.bold} />
          <CustomText
            label="Tab Current Status to Update order Status"
            textStyle={{marginLeft: 10}}
          />
        </View>

        <View style={{marginHorizontal: 20}}>
          {data?.length === 0 ? (
            <CustomText label="Order Empty" />
          ) : (
            data?.map((item, i) => {
              const {order} = item;
              const jsonOrder = JSON.parse(order);
              console.log('JSONORder', order.id);
              return (
                <View key={i} style={{}}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: 15,
                      borderTopWidth: 1,
                      paddingTop: verticalScale(10),
                    }}>
                    <CustomText
                      label={`Order ${i + 1}`}
                      fontFamily={fonts.medium}
                    />
                  </View>
                  {jsonOrder.slice(0, 1).map(i => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 20,
                          alignItems: 'center',
                        }}>
                        <CustomButton
                          title="Current Status"
                          fontFamily={fonts.bold}
                          onPress={() => updateStatsu(order.id, item.id)}
                        />
                        <CustomText
                          label={`${i.status}`}
                          textStyle={{marginLeft: scale(20)}}
                        />
                      </View>
                    );
                  })}
                  {jsonOrder.slice(0, 1).map(i => {
                    return (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: verticalScale(20),
                          }}>
                          <CustomText
                            label="Sitting Place: "
                            fontFamily={fonts.bold}
                            textStyle={{marginRight: scale(15)}}
                          />
                          {i.Balcony.length == 0 ? null : (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <CustomText
                                label="Balcony"
                                fontFamily={fonts.bold}
                              />
                              <Text
                                style={{
                                  marginLeft: scale(20),
                                  fontFamily: fonts.regular,
                                  color: colors.lightBlue,
                                  fontSize: moderateScale(11),
                                }}>
                                {i?.Balcony}
                              </Text>
                            </View>
                          )}
                          {i.Main.length == 0 ? null : (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <CustomText
                                label="Main"
                                fontFamily={fonts.bold}
                              />
                              <Text
                                style={{
                                  marginLeft: scale(20),
                                  fontFamily: fonts.regular,
                                  color: colors.lightBlue,
                                  fontSize: moderateScale(13),
                                }}>
                                {i?.Main}
                              </Text>
                            </View>
                          )}
                          {i.Outside.length == 0 ? null : (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <CustomText
                                label="Outside"
                                fontFamily={fonts.bold}
                              />
                              <Text
                                style={{
                                  marginLeft: scale(20),
                                  fontFamily: fonts.regular,
                                  color: colors.lightBlue,
                                  fontSize: moderateScale(13),
                                }}>
                                {i?.Outside}
                              </Text>
                            </View>
                          )}
                        </View>
                      </>
                    );
                  })}

                  <View style={{marginBottom: verticalScale(15)}}>
                    {jsonOrder?.map(i => {
                      console.log('id----', i.item.id);
                      return (
                        <View key={i}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <CustomText
                              label="Dish name:"
                              fontFamily={fonts.bold}
                            />
                            <CustomText
                              label={i.item.name}
                              textStyle={{marginLeft: scale(20)}}
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 20,
                              alignItems: 'center',
                            }}>
                            <CustomText
                              label="Dish Price:"
                              fontFamily={fonts.bold}
                            />
                            <CustomText
                              label={`$${i.item.price}`}
                              textStyle={{marginLeft: scale(20)}}
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 20,
                              marginBottom: 20,
                              alignItems: 'center',
                              width: '80%',
                            }}>
                            <CustomText
                              label="Dish Details:"
                              fontFamily={fonts.bold}
                            />
                            <CustomText
                              width="80%"
                              label={`${i.item.description}`}
                              textStyle={{marginLeft: scale(20)}}
                            />
                          </View>
                        </View>
                      );
                    })}
                    <View
                      style={{
                        // marginHorizontal: scale(20),
                        paddingTop: verticalScale(20),
                        marginTop: verticalScale(20),
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderTopWidth: 1,
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
                        {jsonOrder?.reduce((total, cartItem) => {
                          console.log('total', cartItem.item.price);
                          return (
                            parseInt(total) + parseInt(cartItem.item.price)
                          );
                        }, 0)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
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
  boxContainer: {
    borderWidth: 1,
    marginTop: verticalScale(10),
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(15),
    borderColor: colors.lightBlue,
    borderRadius: 5,
  },
  insideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
export default ViewOrder;
