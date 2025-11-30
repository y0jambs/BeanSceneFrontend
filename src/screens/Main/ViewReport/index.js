import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { scale, ScaledSheet, verticalScale } from 'react-native-size-matters';

import colors from '../../../util/colors';
import Header from '../../../common/components/Header';
import CustomButton from '../../../common/components/CustomButton';
import CustomText from '../../../common/components/CustomText';
import fonts from '../../../assets/fonts';
import Icons from '../../../common/components/Icons';

import { getOrders, updateOrder, deleteOrder } from '../../../services/Api';

const ViewReport = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Load orders from backend ---
  const fetchOrders = () => {
    setLoading(true);
    getOrders()
      .then(res => {
        // API returns an array of order objects
        setOrders(res.data || []);
      })
      .catch(err => {
        console.log('Error fetching orders:', err);
        Alert.alert('Error', 'Could not load orders.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- Summary counts for the top of the screen ---
  const { totalOrders, inProgressCount, completedCount } = useMemo(() => {
    const total = orders.length;
    const inProg = orders.filter(o => o.status === 'inprogress').length;
    const completed = orders.filter(o => o.status === 'completed').length;

    return {
      totalOrders: total,
      inProgressCount: inProg,
      completedCount: completed,
    };
  }, [orders]);

  // --- Toggle order status between inprogress / completed ---
  const toggleStatus = order => {
    const current = order.status || 'inprogress';
    const newStatus = current === 'inprogress' ? 'completed' : 'inprogress';

    // Optimistic UI update
    setOrders(prev =>
      prev.map(o =>
        o.id === order.id ? { ...o, status: newStatus } : o,
      ),
    );

    updateOrder(order.id, { status: newStatus })
      .then(() => {
        console.log('Order status updated');
      })
      .catch(err => {
        console.log('Error updating order:', err);
        Alert.alert('Error', 'Could not update order status.');
        // revert if backend fails
        setOrders(prev =>
          prev.map(o =>
            o.id === order.id ? { ...o, status: current } : o,
          ),
        );
      });
  };

  const confirmDelete = orderId => {
    Alert.alert('Delete', 'Do you want to delete this order?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => {
          deleteOrder(orderId)
            .then(() => {
              setOrders(prev => prev.filter(o => o.id !== orderId));
            })
            .catch(err => {
              console.log('Error deleting order:', err);
              Alert.alert('Error', 'Could not delete order.');
            });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header icon title="View Report" onPress={() => navigation.goBack()} />

        {/* Note */}
        <View style={styles.noteRow}>
          <CustomText label="Note:" fontFamily={fonts.bold} />
          <CustomText
            label=" Tap Current Status to update order status"
            textStyle={{ marginLeft: 4 }}
          />
        </View>

        {/* Summary row */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <CustomText
              label="Total Orders"
              fontFamily={fonts.bold}
              fontSize={verticalScale(11)}
            />
            <CustomText
              label={String(totalOrders)}
              fontFamily={fonts.bold}
              fontSize={verticalScale(16)}
              color={colors.lightBlue}
            />
          </View>

          <View style={styles.summaryBox}>
            <CustomText
              label="In Progress"
              fontFamily={fonts.bold}
              fontSize={verticalScale(11)}
            />
            <CustomText
              label={String(inProgressCount)}
              fontFamily={fonts.bold}
              fontSize={verticalScale(16)}
              color={colors.lightBlue}
            />
          </View>

          <View style={styles.summaryBox}>
            <CustomText
              label="Completed"
              fontFamily={fonts.bold}
              fontSize={verticalScale(11)}
            />
            <CustomText
              label={String(completedCount)}
              fontFamily={fonts.bold}
              fontSize={verticalScale(16)}
              color={colors.lightBlue}
            />
          </View>
        </View>

        <View style={styles.content}>
          <CustomText
            label="Order Status"
            fontSize={verticalScale(13)}
            fontFamily={fonts.bold}
            container={{ marginVertical: verticalScale(10) }}
          />

          {loading ? (
            <CustomText label="Loading orders..." />
          ) : orders.length === 0 ? (
            <CustomText label="No orders found." />
          ) : (
            orders.map((item, index) => (
              <View key={item.id || index} style={styles.orderBlock}>
                <View style={styles.orderHeader}>
                  <CustomText
                    label={`Order ${index + 1}`}
                    fontFamily={fonts.medium}
                  />
                  <View style={styles.deleteIconWrapper}>
                    <Icons
                      family="AntDesign"
                      name="delete"
                      size={20}
                      color="red"
                      onPress={() => confirmDelete(item.id)}
                    />
                  </View>
                </View>

                <CustomText
                  label={`Customer: ${item.customerName || 'N/A'}`}
                  color={colors.lightBlue}
                />
                <CustomText
                  label={`Table: ${item.tableRef || 'N/A'}`}
                  color={colors.lightBlue}
                />
                <CustomText
                  label={`Area: ${item.area || 'N/A'}`}
                  color={colors.lightBlue}
                />
                <CustomText
                  label={`Date/Time: ${item.orderDateTime || 'N/A'}`}
                  color={colors.lightBlue}
                />

                <View style={styles.statusRow}>
                  <CustomButton
                    title="Current Status"
                    fontFamily={fonts.bold}
                    onPress={() => toggleStatus(item)}
                  />
                  <CustomText
                    label={item.status || 'inprogress'}
                    textStyle={{ marginLeft: scale(20) }}
                  />
                </View>
              </View>
            ))
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
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: scale(20),
    marginTop: verticalScale(10),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scale(20),
    marginTop: verticalScale(15),
  },
  summaryBox: {
    flex: 1,
    marginHorizontal: scale(4),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(8),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightBlue,
    backgroundColor: '#F5FAFB',
    alignItems: 'center',
  },
  content: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(10),
  },
  orderBlock: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: verticalScale(10),
    marginBottom: verticalScale(15),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  deleteIconWrapper: {
    padding: 4,
  },
  statusRow: {
    flexDirection: 'row',
    marginTop: verticalScale(15),
    alignItems: 'center',
  },
});

export default ViewReport;
