import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
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
    if (Array.isArray(orderField)) return orderField;
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

const STATUS_OPTIONS = [
  {label: 'In Progress', value: 'inprogress'},
  {label: 'Completed', value: 'completed'},
  {label: 'Cancelled', value: 'cancelled'},
];

const ViewOrder = ({navigation}) => {
  const [data, setData] = useState([]);

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

  const sortedOrders = [...data].sort(
    (a, b) =>
      new Date(b.orderDateTime || b.createdAt) -
      new Date(a.orderDateTime || a.createdAt),
  );

  const handleStatusChange = (orderDoc, newStatus) => {
    const currentStatus = orderDoc.status || 'inprogress';
    if (currentStatus === newStatus) return;

    updateOrder(orderDoc.id, {status: newStatus})
      .then(() => {
        setData(prev =>
          prev.map(o =>
            o.id === orderDoc.id ? {...o, status: newStatus} : o,
          ),
        );
        alert(`Order status set to ${newStatus}`);
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

        <View style={styles.pageHeader}>
          <CustomText
            label="Order Management"
            fontFamily={fonts.bold}
            fontSize={moderateScale(18)}
          />
          <CustomText
            label="Update the status of each order as needed."
            textStyle={{marginTop: 5}}
          />
        </View>

        <View style={styles.listContainer}>
          {sortedOrders.length === 0 ? (
            <CustomText label="No orders yet" />
          ) : (
            sortedOrders.map((orderDoc, index) => {
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
                <View key={orderDoc.id || index} style={styles.orderCard}>
                  {/* HEADER ROW (No delete button now) */}
                  <View style={styles.orderHeaderRow}>
                    <CustomText
                      label={`Order ${index + 1}`}
                      fontFamily={fonts.bold}
                      fontSize={moderateScale(15)}
                    />
                    <CustomText
                      label={createdAt}
                      fontSize={moderateScale(11)}
                      color="#777"
                    />
                  </View>

                  <View style={styles.infoBlock}>
                    <InfoRow
                      label="Customer"
                      value={orderDoc.customerName || 'N/A'}
                    />
                    <InfoRow label="Table" value={orderDoc.tableRef || 'N/A'} />
                    <InfoRow label="Area" value={orderDoc.area || 'N/A'} />
                  </View>

                  <View style={styles.sectionDivider} />

                  <View style={{marginTop: verticalScale(8)}}>
                    {items.length === 0 ? (
                      <CustomText label="No items found for this order." />
                    ) : (
                      items.map((line, idx) => {
                        const dish = line.item || {};
                        return (
                          <View key={dish.id || idx} style={styles.itemBlock}>
                            <CustomText
                              label={dish.name || 'Unknown'}
                              fontFamily={fonts.bold}
                            />
                            <CustomText
                              label={`$${dish.price || 0}`}
                              fontFamily={fonts.medium}
                              color={colors.lightBlue}
                              container={{marginTop: 2}}
                            />
                          </View>
                        );
                      })
                    )}
                  </View>

                  <View style={styles.sectionDivider} />
                  <View style={styles.totalRow}>
                    <CustomText
                      label="Total Price"
                      fontFamily={fonts.bold}
                      fontSize={moderateScale(15)}
                    />
                    <Text style={styles.totalValue}>${total}</Text>
                  </View>

                  <View style={styles.statusRow}>
                    <CustomText
                      label="Status"
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
                            onPress={() =>
                              handleStatusChange(orderDoc, option.value)
                            }>
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

const InfoRow = ({label, value}) => (
  <View style={styles.infoRow}>
    <CustomText
      label={`${label}:`}
      fontFamily={fonts.medium}
      fontSize={moderateScale(12)}
      color="#555"
    />
    <CustomText
      label={value}
      fontSize={moderateScale(12)}
      textStyle={{marginLeft: scale(6)}}
    />
  </View>
);

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f5f8',
  },
  pageHeader: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 5,
  },
  listContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: verticalScale(12),
    elevation: 3,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoBlock: {
    marginTop: verticalScale(10),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  sectionDivider: {
    marginTop: verticalScale(10),
    borderTopWidth: 1,
    borderColor: '#e2e4ea',
  },
  itemBlock: {
    marginTop: verticalScale(8),
  },
  totalRow: {
    marginTop: verticalScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalValue: {
    fontFamily: fonts.medium,
    color: colors.lightBlue,
    fontSize: moderateScale(15),
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
    borderColor: colors.red,
  },
  statusChipCancelledActive: {
    backgroundColor: colors.red,
  },
  statusChipText: {
    fontFamily: fonts.medium,
    color: colors.lightBlue,
    fontSize: moderateScale(12),
  },
  statusChipTextActive: {
    color: colors.white,
  },
  statusChipCancelledText: {
    color: colors.red,
  },
  statusChipCancelledTextActive: {
    color: colors.white,
  },
});

export default ViewOrder;
