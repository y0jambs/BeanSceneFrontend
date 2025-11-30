import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  moderateScale,
  scale,
  ScaledSheet,
  verticalScale,
} from 'react-native-size-matters';

import colors from '../../../util/colors';
import Header from '../../../common/components/Header';
import CustomText from '../../../common/components/CustomText';
import fonts from '../../../assets/fonts';
import CustomButton from '../../../common/components/CustomButton';
import {getOrders, updateOrder} from '../../../services/Api';

// Safely parse the "order" field from Firestore
const parseOrderItems = orderField => {
  try {
    if (!orderField) return [];
    if (Array.isArray(orderField)) return orderField; // already parsed
    if (typeof orderField === 'string') {
      const parsed = JSON.parse(orderField);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (e) {
    console.log('Failed to parse order JSON:', e);
    return [];
  }
};

const ViewOrder = ({navigation}) => {
  const [data, setData] = useState([]);

  // -----------------------------
  // LOAD ORDERS
  // -----------------------------
  const loadOrders = () => {
    getOrders()
      .then(res => {
        setData(res.data || []);
      })
      .catch(e => {
        console.log('Error loading orders', e);
      });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // -----------------------------
  // TOGGLE STATUS
  // -----------------------------
  const toggleStatus = orderDoc => {
    const currentStatus = orderDoc.status || 'inprogress';
    const nextStatus = currentStatus === 'completed' ? 'inprogress' : 'completed';

    updateOrder(orderDoc.id, {status: nextStatus})
      .then(() => {
        setData(prev =>
          prev.map(o =>
            o.id === orderDoc.id ? {...o, status: nextStatus} : o,
          ),
        );
        alert('Order status updated');
      })
      .catch(err => {
        console.log('Update status error', err);
        alert('Could not update order status');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header icon title="View Order" onPress={() => navigation.goBack()} />

        <View style={{flexDirection: 'row', alignItems: 'center', margin: 20}}>
          <CustomText label="Note:" fontFamily={fonts.bold} />
          <CustomText
            label="Tap Current Status to update order status"
            textStyle={{marginLeft: 10}}
          />
        </View>

        <View style={{marginHorizontal: 20}}>
          {data.length === 0 ? (
            <CustomText label="No orders yet" />
          ) : (
            data.map((orderDoc, index) => {
              const items = parseOrderItems(orderDoc.order);
              const status = orderDoc.status || 'inprogress';
              const createdAt =
                orderDoc.orderDateTime ||
                orderDoc.createdAt ||
                'Not available';

              const total = items.reduce((sum, line) => {
                const price = Number(line?.item?.price || 0);
                const qty = Number(line?.quantity || 1);
                return sum + price * qty;
              }, 0);

              return (
                <View
                  key={orderDoc.id || index}
                  style={{
                    borderTopWidth: 1,
                    borderColor: '#ddd',
                    paddingTop: verticalScale(10),
                    marginBottom: verticalScale(15),
                  }}>
                  {/* ORDER HEADER */}
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: 15,
                    }}>
                    <CustomText
                      label={`Order ${index + 1}`}
                      fontFamily={fonts.medium}
                    />
                  </View>

                  {/* BASIC INFO */}
                  <View style={{marginTop: verticalScale(10)}}>
                    <CustomText
                      label={`Customer: ${orderDoc.customerName || 'N/A'}`}
                    />
                    <CustomText
                      label={`Table: ${orderDoc.tableRef || 'N/A'}`}
                    />
                    <CustomText label={`Area: ${orderDoc.area || 'N/A'}`} />
                    <CustomText
                      label={`Date/Time: ${createdAt}`}
                      container={{marginBottom: verticalScale(10)}}
                    />
                  </View>

                  {/* STATUS BUTTON */}
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      alignItems: 'center',
                    }}>
                    <CustomButton
                      title="Current Status"
                      fontFamily={fonts.bold}
                      onPress={() => toggleStatus(orderDoc)}
                    />
                    <CustomText
                      label={status}
                      textStyle={{marginLeft: scale(20)}}
                    />
                  </View>

                  {/* LINE ITEMS */}
                  <View style={{marginTop: verticalScale(15)}}>
                    {items.length === 0 ? (
                      <CustomText label="No items found for this order." />
                    ) : (
                      items.map((line, idx) => {
                        const dish = line.item || {};
                        return (
                          <View key={dish.id || idx} style={{marginBottom: 10}}>
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
                                label={dish.name || 'Unknown'}
                                textStyle={{marginLeft: scale(20)}}
                              />
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                marginTop: 5,
                                alignItems: 'center',
                              }}>
                              <CustomText
                                label="Dish Price:"
                                fontFamily={fonts.bold}
                              />
                              <CustomText
                                label={`$${dish.price || 0}`}
                                textStyle={{marginLeft: scale(20)}}
                              />
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                marginTop: 5,
                                alignItems: 'center',
                                width: '80%',
                              }}>
                              <CustomText
                                label="Dish Details:"
                                fontFamily={fonts.bold}
                              />
                              <CustomText
                                width="80%"
                                label={dish.description || ''}
                                textStyle={{marginLeft: scale(20)}}
                              />
                            </View>
                          </View>
                        );
                      })
                    )}
                  </View>

                  {/* TOTAL */}
                  <View
                    style={{
                      paddingTop: verticalScale(20),
                      marginTop: verticalScale(10),
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderTopWidth: 1,
                      borderColor: '#ddd',
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
                      ${total}
                    </Text>
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
});

export default ViewOrder;
