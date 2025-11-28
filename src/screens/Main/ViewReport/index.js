import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {scale, ScaledSheet, verticalScale} from 'react-native-size-matters';
import colors from '../../../util/colors';
import Header from '../../../common/components/Header';
import CustomButton from '../../../common/components/CustomButton';
import CustomText from '../../../common/components/CustomText';
import fonts from '../../../assets/fonts';
import WeeklyBtn from './molecules/WeeklyBtn';
import {deleteOrder, getAllOrder, updateOrder} from '../../../services/Api';
import Icons from '../../../common/components/Icons';

const ViewReport = ({navigation}) => {
  const [tab, setTab] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllOrder()
      .then(res => {
        const json = res.data;

        setData(json);
      })
      .catch(e => console.log('Error', e));
  }, []);
  const getOrder = () => {
    getAllOrder()
      .then(res => {
        const json = res.data;

        setData(json);
      })
      .catch(e => console.log('Error', e));
  };
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
        <Header icon title="View Report" onPress={() => navigation.goBack()} />
        <View style={{flexDirection: 'row', alignItems: 'center', margin: 20}}>
          <CustomText label="Note:" fontFamily={fonts.bold} />
          <CustomText
            label="Tab Current Status to Update order Status"
            textStyle={{marginLeft: 10}}
          />
        </View>
        <View style={{marginHorizontal: scale(20)}}>
          <CustomText
            label="Order Status"
            fontSize={verticalScale(13)}
            fontFamily={fonts.bold}
            container={{marginVertical: verticalScale(10)}}
          />
          {data?.length === 0 ? (
            <CustomText label="Order Empty" />
          ) : (
            data?.map((item, i) => {
              const {order} = item;
              const jsonOrder = JSON.parse(order);
              console.log('JSONORder', item.id);
              return (
                <View key={i} style={{}}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: 15,
                      borderTopWidth: 1,
                      width: '100%',
                      paddingTop: verticalScale(10),
                    }}>
                    <CustomText
                      label={`Order ${i + 1}`}
                      fontFamily={fonts.medium}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Delete',
                        'Do You want to delete this order',
                        [
                          {
                            text: 'No',
                            style: 'cancel',
                          },
                          {
                            text: 'Yes',
                            onPress: () => {
                              deleteOrder(item.id)
                                .then(res => {
                                  console.log(res.data);
                                  getOrder();
                                })
                                .catch(e => console.log('error', e));
                            },
                          },
                        ],
                      );
                    }}>
                    <Icons
                      family="AntDesign"
                      name="delete"
                      size={20}
                      color="red"
                    />
                  </TouchableOpacity>
                  <View style={{marginBottom: verticalScale(15)}}>
                    {jsonOrder.slice(0, 1).map(i => {
                      console.log('000000000000', i.id);
                      return (
                        <View key={i} style={{}}>
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
                        </View>
                      );
                    })}
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

export default ViewReport;
