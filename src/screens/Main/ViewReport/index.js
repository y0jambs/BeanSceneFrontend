// src/screens/Reports/ViewReport/index.js

import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import {scale, ScaledSheet, verticalScale} from 'react-native-size-matters';

import colors from '../../../util/colors';
import Header from '../../../common/components/Header';
import CustomText from '../../../common/components/CustomText';
import fonts from '../../../assets/fonts';
import Icons from '../../../common/components/Icons';

import {getOrders, updateOrder, deleteOrder} from '../../../services/Api';

const STATUS_OPTIONS = [
  {label: 'In Progress', value: 'inprogress'},
  {label: 'Confirmed', value: 'completed'}, // uses same backend value as "completed"
  {label: 'Cancelled', value: 'cancelled'},
];

// Safely parse the "order" field
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

const shortId = id => (id ? id.slice(0, 6).toUpperCase() : '—');

const formatDateTime = value => {
  if (!value) return 'N/A';
  const d = new Date(value);
  if (isNaN(d)) return value;
  return d.toLocaleString(); // device locale
};

const ViewReport = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Load orders from backend ---
  const fetchOrders = () => {
    setLoading(true);
    getOrders()
      .then(res => {
        console.log('Orders fetched:', res.data);
        setOrders(res.data || []);
      })
      .catch(err => {
        console.log('Error fetching orders:', err?.response?.data || err.message);
        Alert.alert('Error', 'Could not load orders.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- Summary counts for the top of the screen ---
  const {
    totalOrders,
    inProgressCount,
    completedCount,
    cancelledCount,
  } = useMemo(() => {
    const total = orders.length;
    const inProg = orders.filter(o => o.status === 'inprogress').length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;

    return {
      totalOrders: total,
      inProgressCount: inProg,
      completedCount: completed,
      cancelledCount: cancelled,
    };
  }, [orders]);

  // --- Change order status (inprogress / completed / cancelled) ---
  const changeStatus = (order, newStatus) => {
    const current = order.status || 'inprogress';
    if (current === newStatus) {
      return; // nothing to do if unchanged
    }

    // Ensure the "order" field is a JSON string as the backend expects
    let orderField = order.order;
    if (Array.isArray(orderField)) {
      orderField = JSON.stringify(orderField);
    }

    // Optimistic local update for fast UI response
    setOrders(prev =>
      prev.map(o =>
        o.id === order.id ? {...o, status: newStatus} : o,
      ),
    );

    // Send update to backend
    updateOrder(order.id, {
      status: newStatus,
      order: orderField, // many backends require this to be included
    })
      .then(res => {
        console.log('Order status updated:', res.data);
      })
      .catch(err => {
        console.log(
          'Error updating order:',
          err?.response?.data || err.message,
        );
        Alert.alert('Error', 'Could not update order status.');

        // Revert UI if backend fails
        setOrders(prev =>
          prev.map(o =>
            o.id === order.id ? {...o, status: current} : o,
          ),
        );
      });
  };

  const confirmDelete = orderId => {
    Alert.alert('Delete', 'Do you want to delete this order?', [
      {text: 'No', style: 'cancel'},
      {
        text: 'Yes',
        onPress: () => {
          deleteOrder(orderId)
            .then(() => {
              setOrders(prev => prev.filter(o => o.id !== orderId));
            })
            .catch(err => {
              console.log(
                'Error deleting order:',
                err?.response?.data || err.message,
              );
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
            label=" Tap a status chip to update the order."
            textStyle={{marginLeft: 4}}
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
              label="Confirmed"
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

          <View style={styles.summaryBox}>
            <CustomText
              label="Cancelled"
              fontFamily={fonts.bold}
              fontSize={verticalScale(11)}
            />
            <CustomText
              label={String(cancelledCount)}
              fontFamily={fonts.bold}
              fontSize={verticalScale(16)}
              color={colors.red || '#d9534f'}
            />
          </View>
        </View>

        <View style={styles.content}>
          <CustomText
            label="Order Status"
            fontSize={verticalScale(13)}
            fontFamily={fonts.bold}
            container={{marginVertical: verticalScale(10)}}
          />

          {loading ? (
            <CustomText label="Loading orders..." />
          ) : orders.length === 0 ? (
            <CustomText label="No orders found." />
          ) : (
            orders.map((item, index) => {
              const status = item.status || 'inprogress';
              const items = parseOrderItems(item.order);
              const itemNames = items
                .map(line => line?.item?.name)
                .filter(Boolean);
              const itemsSummary =
                itemNames.length > 0 ? itemNames.join(', ') : 'No items';

              const total = items.reduce((sum, line) => {
                const price = Number(line?.item?.price || 0);
                const qty = Number(line?.quantity || 1);
                return sum + price * qty;
              }, 0);

              const tableAreaLabel = `${item.area || 'N/A'} – ${
                item.tableRef || 'N/A'
              }`;

              return (
                <View key={item.id || index} style={styles.orderCard}>
                  {/* Header: Order code + delete */}
                  <View style={styles.orderHeader}>
                    <View>
                      <CustomText
                        label={`Order #${shortId(item.id)}`}
                        fontFamily={fonts.bold}
                        fontSize={verticalScale(14)}
                      />
                      <CustomText
                        label={formatDateTime(item.orderDateTime)}
                        fontSize={verticalScale(11)}
                        color="#777"
                      />
                    </View>
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

                  {/* Customer / location */}
                  <View style={{marginTop: verticalScale(6)}}>
                    <CustomText
                      label={`Customer: ${item.customerName || 'N/A'}`}
                      color={colors.lightBlue}
                    />
                    <CustomText
                      label={`Table: ${tableAreaLabel}`}
                      color={colors.lightBlue}
                    />
                  </View>

                  {/* Items summary */}
                  <View style={{marginTop: verticalScale(8)}}>
                    <CustomText
                      label="Items:"
                      fontFamily={fonts.bold}
                      fontSize={verticalScale(12)}
                    />
                    <CustomText
                      label={itemsSummary}
                      fontSize={verticalScale(12)}
                      color="#555"
                      container={{marginTop: 2}}
                    />
                  </View>

                  {/* Total */}
                  <View style={styles.totalRow}>
                    <CustomText
                      label="Total:"
                      fontFamily={fonts.bold}
                      fontSize={verticalScale(13)}
                    />
                    <Text style={styles.totalValue}>${total}</Text>
                  </View>

                  {/* STATUS CHIPS */}
                  <View style={styles.statusRow}>
                    <CustomText
                      label="Status:"
                      fontFamily={fonts.bold}
                      container={{marginRight: scale(10)}}
                    />
                    <View style={styles.statusChipsContainer}>
                      {STATUS_OPTIONS.map(option => {
                        const isActive = status === option.value;
                        const isCancelled = option.value === 'cancelled';
                        return (
                          <TouchableOpacity
                            key={option.value}
                            style={[
                              styles.statusChip,
                              isActive && styles.statusChipActive,
                              isCancelled && styles.statusChipCancelled,
                              isActive &&
                                isCancelled &&
                                styles.statusChipCancelledActive,
                            ]}
                            onPress={() => changeStatus(item, option.value)}>
                            <Text
                              style={[
                                styles.statusChipText,
                                isActive && styles.statusChipTextActive,
                                isCancelled && styles.statusChipCancelledText,
                                isActive &&
                                  isCancelled &&
                                  styles.statusChipCancelledTextActive,
                              ]}>
                              {option.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
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
    backgroundColor: '#f3f5f8',
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
    marginBottom: verticalScale(20),
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: verticalScale(12),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteIconWrapper: {
    padding: 4,
  },
  totalRow: {
    marginTop: verticalScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalValue: {
    fontFamily: fonts.medium,
    color: colors.lightBlue,
    fontSize: verticalScale(14),
  },
  statusRow: {
    flexDirection: 'row',
    marginTop: verticalScale(12),
    alignItems: 'center',
  },
  statusChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  statusChip: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightBlue,
    marginRight: scale(8),
    marginBottom: verticalScale(4),
    backgroundColor: colors.white,
  },
  statusChipActive: {
    backgroundColor: colors.lightBlue,
  },
  statusChipCancelled: {
    borderColor: colors.red || '#d9534f',
  },
  statusChipCancelledActive: {
    backgroundColor: colors.red || '#d9534f',
  },
  statusChipText: {
    fontFamily: fonts.medium,
    color: colors.lightBlue,
    fontSize: verticalScale(11),
  },
  statusChipTextActive: {
    color: colors.white,
  },
  statusChipCancelledText: {
    color: colors.red || '#d9534f',
  },
  statusChipCancelledTextActive: {
    color: colors.white,
  },
});

export default ViewReport;
