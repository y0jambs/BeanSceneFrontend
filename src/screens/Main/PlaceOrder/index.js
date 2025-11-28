import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import images from '../../../assets/images';
import CustomButton from '../../../common/components/CustomButton';
import {getAllCategory, getDish, orderCheckout} from '../../../services/Api';
import DropDownPicker from 'react-native-dropdown-picker';
import {api} from '../../../util/config';
const PlaceOrder = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([
    {label: 'M1', value: 'M1'},
    {label: 'M2', value: 'M2'},
    {label: 'M3', value: 'M3'},
    {label: 'M4', value: 'M4'},
    {label: 'M5', value: 'M5'},
    {label: 'M6', value: 'M6'},
    {label: 'M7', value: 'M7'},
    {label: 'M8', value: 'M8'},
    {label: 'M9', value: 'M9'},
    {label: 'M10', value: 'M10'},
  ]);
  const [open2, setOpen2] = useState(false);
  const [value2, setValue2] = useState('');
  const [items2, setItems2] = useState([
    {label: 'O1', value: 'O1'},
    {label: 'O2', value: 'O2'},
    {label: 'O3', value: 'O3'},
    {label: 'O4', value: 'O4'},
    {label: 'O5', value: 'O5'},
    {label: 'O6', value: 'O6'},
    {label: 'O7', value: 'O7'},
    {label: 'O8', value: 'O8'},
    {label: 'O9', value: 'O9'},
    {label: 'O10', value: 'O10'},
  ]);
  const [open3, setOpen3] = useState(false);
  const [value3, setValue3] = useState('');
  const [items3, setItems3] = useState([
    {label: 'B1', value: 'B1'},
    {label: 'B2', value: 'B2'},
    {label: 'B3', value: 'B3'},
    {label: 'B4', value: 'B4'},
    {label: 'B5', value: 'B5'},
    {label: 'B6', value: 'B6'},
    {label: 'B7', value: 'B7'},
    {label: 'B8', value: 'B8'},
    {label: 'B9', value: 'B9'},
    {label: 'B10', value: 'B10'},
  ]);
  useEffect(() => {
    getAllCategory()
      .then(res => {
        setCategories(res.data);
        console.log('resss', res.data);
      })
      .catch(e => console.log(e));
    getDish()
      .then(res => {
        setRestaurant(res.data);
        console.log('res', res.data);
      })
      .catch(e => console.log(e));
  }, []);

  const [categories, setCategories] = useState([]);

  const [slectedCategory, setSelectedCategory] = useState('');
  const [restaurant, setRestaurant] = useState([]);
  const [order, setOrder] = useState([]);
  const onSelectCategory = category => {
    console.log('category', category);
    setSelectedCategory(category.name);
    console.log('category Name', slectedCategory);
    // console.log(restaurantList);
    // console.log(category);
  };
  const getCatgeoryNameById = id => {
    let category = categories.filter(a => a.id == id);
    // console.log(id);
    // console.log(category);
    if (category.length > 0) {
      return category[0].name;
    }
    return '';
  };
  function buildFormData(formData, data, parentKey) {
    if (
      data &&
      typeof data === 'object' &&
      !(data instanceof Date) &&
      !(data instanceof File)
    ) {
      Object.keys(data).forEach(key => {
        buildFormData(
          formData,
          data[key],
          parentKey ? `${parentKey}[${key}]` : key,
        );
      });
    } else {
      const value = data == null ? '' : data;
      formData.append(parentKey, value);
    }
  }
  const TakeOrder = item => {
    console.log('item', item);
    const data = {
      item,
      Main: value,
      Outside: value2,
      Balcony: value3,
      status: 'inprogress',
    };
    setOrder([...order, data]);
    console.log('order', order);
    Alert.alert('Cart', 'Item Added to Cart');
    // const payload = {
    //   order: orders,
    // };
    // Alert.alert('Place Order', 'Do you confirm his Order', [
    //   {
    //     text: 'No',
    //     onPress: () => console.log('Cancel Pressed'),
    //     style: 'cancel',
    //   },
    //   {
    //     text: 'Yes',
    //     onPress: () => {
    //       placeOrder(payload)
    //         .then(res => Alert.alert('Order', 'Order added successfully'))
    //         .catch(e => console.log('Error', e));
    //     },
    //     // navigation.navigate('viewOrder', {
    //     //   data: item,
    //     // }),
    //   },
    // ]);
  };
  const placeOrder = () => {
    if (order.length == 0) {
      alert('Please Select Order');
    } else {
      const orders = JSON.stringify(order);
      console.log('order', order);

      const payload = {
        order: orders,
      };
      console.log('payload', payload);
      Alert.alert('Place Order', 'Do you Confirm This Order', [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            orderCheckout(payload)
              .then(res => Alert.alert('Order', 'Order added successfully'))
              .catch(e => console.log('Error', e));
          },

          // navigation.navigate('viewOrder', {
          //   data: item,
          // }),
        },
      ]);
    }
  };
  const renderCategory = () => {
    const renderItem = ({item}) => {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: colors.white,
            elevation: 5,
            alignItems: 'center',
            justifyContent: 'center',
            padding: moderateScale(10),
            marginHorizontal: scale(20),
            marginTop: verticalScale(20),
            borderRadius: moderateScale(20),
            marginBottom: verticalScale(15),
          }}
          onPress={() => onSelectCategory(item)}>
          <CustomText label={item.name} fontSize={moderateScale(13)} />
        </TouchableOpacity>
      );
    };
    return (
      <View style={{marginTop: verticalScale(15)}}>
        {console.log('item-------------', order)}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <CustomText
            label="Categories"
            fontFamily={fonts.bold}
            fontSize={moderateScale(18)}
            container={{marginHorizontal: scale(20)}}
          />
        </View>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header
          icon
          title="Place Order"
          onPress={() => navigation.goBack()}
          rightIcon
          cart={order?.length}
          onCart={() =>
            navigation.navigate('cart', {
              order,
            })
          }
        />
        <View style={{marginHorizontal: scale(20)}}>
          <CustomText
            label="Table/Sitting"
            fontSize={moderateScale(18)}
            marginTop={20}
            fontFamily={fonts.bold}
          />
          <View style={{marginTop: 15}}>
            <CustomText
              label="Main"
              color={colors.midBlue}
              fontSize={15}
              container={{marginBottom: verticalScale(15)}}
              fontFamily={fonts.medium}
            />
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              listMode="SCROLLVIEW"
              style={{
                marginBottom: open ? verticalScale(140) : verticalScale(15),
                height: verticalScale(41),
                borderRadius: 5,
              }}
              containerStyle={{}}
              dropDownDirection="BOTTOM"
              placeholder={<CustomText label="Main" color="#c8c8c8" />}
              labelStyle={styles.textStyle}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
            />
          </View>
          <View style={{marginTop: 15}}>
            <CustomText
              label="Outside"
              color={colors.midBlue}
              fontSize={15}
              container={{marginBottom: verticalScale(15)}}
              fontFamily={fonts.medium}
            />
            <DropDownPicker
              open={open2}
              value={value2}
              items={items2}
              listMode="SCROLLVIEW"
              style={{
                marginBottom: open ? verticalScale(35) : verticalScale(15),
                height: verticalScale(41),
                borderRadius: 5,
              }}
              containerStyle={{}}
              dropDownDirection="TOP"
              placeholder={<CustomText label="Outside" color="#c8c8c8" />}
              labelStyle={styles.textStyle}
              setOpen={setOpen2}
              setValue={setValue2}
              setItems={setItems2}
            />
          </View>
          <View style={{marginTop: 15}}>
            <CustomText
              label="Balcony"
              color={colors.midBlue}
              fontSize={15}
              container={{marginBottom: verticalScale(15)}}
              fontFamily={fonts.medium}
            />
            <DropDownPicker
              open={open3}
              value={value3}
              items={items3}
              listMode="SCROLLVIEW"
              style={{
                marginBottom: open ? verticalScale(35) : verticalScale(15),
                height: verticalScale(41),
                borderRadius: 5,
              }}
              containerStyle={{}}
              dropDownDirection="BOTTOM"
              placeholder={<CustomText label="Balcony" color="#c8c8c8" />}
              labelStyle={styles.textStyle}
              setOpen={setOpen3}
              setValue={setValue3}
              setItems={setItems3}
            />
          </View>
        </View>
        {renderCategory()}
        <View style={{marginTop: verticalScale(15)}}>
          <CustomText
            label={restaurant.length > 3 ? `All Dishes` : `Dishes`}
            fontFamily={fonts.bold}
            fontSize={moderateScale(18)}
            container={{marginHorizontal: scale(20)}}
          />
        </View>
        <ScrollView>
          <View style={{marginHorizontal: scale(20)}}>
            {restaurant.length == 0 ? (
              <CustomText
                label="Not Found Dishes"
                container={{marginTop: verticalScale(20)}}
              />
            ) : slectedCategory.length === 0 ? (
              restaurant.map((item, i) => (
                <TouchableOpacity
                  style={{
                    height: verticalScale(300),
                    backgroundColor: colors.white,
                    elevation: 5,
                    marginTop: verticalScale(10),
                  }}
                  key={i}>
                  <Image
                    source={{
                      uri: item.file
                        ? `${api}:5000/static/${item.file}`
                        : 'hello',
                    }}
                    style={{
                      height: '50%',
                      width: '100%',
                      resizeMode: 'cover',
                    }}
                  />
                  <View
                    style={{
                      paddingHorizontal: scale(10),
                      paddingVertical: verticalScale(10),
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <CustomText label="Name:" fontFamily={fonts.medium} />
                      <CustomText label={`   ${item.name}`} />
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <CustomText
                        label="Description:"
                        fontFamily={fonts.medium}
                      />
                      <CustomText
                        label={`   ${item.description}`}
                        container={{width: '70%'}}
                      />
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <CustomText label="Dietary:" fontFamily={fonts.medium} />
                      <CustomText label={`   ${item.detary_flags}`} />
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <CustomText label="Price:" fontFamily={fonts.medium} />
                      <CustomText label={`   $${item.price}`} />
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <CustomText
                        label="Available:"
                        fontFamily={fonts.medium}
                      />
                      <CustomText
                        label={`   ${
                          item.availability
                            ? 'Available'
                            : 'Unavailable due to ingredients'
                        }`}
                      />
                    </View>
                    <CustomButton
                      alignSelf="flex-end"
                      title="Add to Cart"
                      onPress={() => TakeOrder(item)}
                    />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              restaurant.map((item, i) => {
                return slectedCategory == item.category ? (
                  <TouchableOpacity
                    style={{
                      height: verticalScale(300),
                      backgroundColor: colors.white,
                      elevation: 5,
                      marginTop: verticalScale(10),
                    }}
                    key={i}>
                    <Image
                      source={{
                        uri: item.file
                          ? `${api}:5000/static/${item.file}`
                          : 'hello',
                      }}
                      style={{
                        height: '50%',
                        width: '100%',
                        resizeMode: 'cover',
                      }}
                    />
                    <View
                      style={{
                        paddingHorizontal: scale(10),
                        paddingVertical: verticalScale(10),
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <CustomText label="Name:" fontFamily={fonts.medium} />
                        <CustomText label={`   ${item.name}`} />
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <CustomText
                          label="Description:"
                          fontFamily={fonts.medium}
                        />
                        <CustomText
                          label={`   ${item.description}`}
                          container={{width: '70%'}}
                        />
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <CustomText
                          label="Dietary:"
                          fontFamily={fonts.medium}
                        />
                        <CustomText label={`   ${item.detary_flags}`} />
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <CustomText label="Price:" fontFamily={fonts.medium} />
                        <CustomText label={`   $${item.price}`} />
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <CustomText
                          label="Available:"
                          fontFamily={fonts.medium}
                        />
                        <CustomText
                          label={`   ${
                            item.availability
                              ? 'Available'
                              : 'Unavailable due to ingredients'
                          }`}
                        />
                      </View>
                      <CustomButton
                        alignSelf="flex-end"
                        title="Add"
                        onPress={() => TakeOrder(item)}
                      />
                    </View>
                  </TouchableOpacity>
                ) : null;
              })
            )}
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  textStyle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.lightBlue,
  },
});
export default PlaceOrder;
