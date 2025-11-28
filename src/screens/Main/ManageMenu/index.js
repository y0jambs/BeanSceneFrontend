import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  AsyncStorage,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../common/components/Header';
import CustomText from '../../../common/components/CustomText';
import {
  moderateScale,
  scale,
  ScaledSheet,
  verticalScale,
} from 'react-native-size-matters';
import fonts from '../../../assets/fonts';
import images from '../../../assets/images';
import colors from '../../../util/colors';
import Icons from '../../../common/components/Icons';
import CustomInput from '../../../common/components/CustomInput';
import CustomButton from '../../../common/components/CustomButton';
import Card from '../../../common/components/Card';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  AddCategory,
  addDish,
  deleteCategory,
  deleteDish,
  editCategory,
  editDish,
  getAllCategory,
  getDish,
} from '../../../services/Api';
import UploadPhoto from '../../../common/components/UploadPhoto';
import {api} from '../../../util/config';
const ManageMenu = ({navigation}) => {
  const [categories, setCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState();
  const [masterdata, setMasterData] = useState([]);
  const [addNewCategory, setAddNewCategory] = useState(false);
  const [addCateLoader, setAddCateLoader] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [addCategoryLoading, setAddCategoryLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [editData, setEditData] = useState('');
  const [onLoadDish, setOnLoadDish] = useState(false);
  const [editDishData, setEditdishData] = useState('');
  const [error, setError] = useState('');
  const [user_id, setUser_id] = useState('');
  const [masterdataRes, setMasterDataRes] = useState([]);
  const [dish, setDish] = useState({
    user_id: user_id,
    name: '',
    description: '',
    price: '',
    detary_flags: '',

    availability: '',
  });
  const [file, setFile] = useState('');
  const [dishData, setDishData] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);
  const [dishSearch, setDishSearch] = useState('');
  const searchData = text => {
    if (text) {
      const newData = masterdata.filter(item => {
        const mapData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        console.log('Map Data     ', textData);
        return mapData.indexOf(textData) > -1;
      });
      setCategories(newData);
      setSearchCategory(text);
      console.log('Tailor Data', newData);
    } else {
      setCategories(masterdata);
      setSearchCategory(text);
    }
  };
  const searchDish = text => {
    if (text) {
      const newData = masterdataRes.filter(item => {
        const mapData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        console.log('Map Data     ', textData);
        return mapData.indexOf(textData) > -1;
      });
      setDishData(newData);
      setDishSearch(text);
      console.log('Tailor Data', newData);
    } else {
      setDishData(masterdataRes);
      setDishSearch(text);
    }
  };
  const onGetCategory = () => {
    setAddCateLoader(true);
    getAllCategory()
      .then(res => {
        console.log('Response', res.data);
        setCategories(res.data);
        setMasterData(res.data);
        setItems(res.data);
      })
      .catch(e => console.log('error', e))
      .finally(() => setAddCateLoader(false));
  };
  const onSubmit = () => {
    const errors = [];
    if (categoryName.length == 0) {
      setErrMsg('Category Name*');
    } else {
      addCategory();
      onGetCategory();
    }
  };
  const addCategory = () => {
    setAddCategoryLoading(true);
    const payload = {
      user_id: '5bySN36aWXulmyzwt0Fi',
      name: categoryName,
    };

    AddCategory(payload)
      .then(res => {
        console.log('resssssssss', res);
        Alert.alert('Category', res.data.msg);
      })
      .catch(e => console.log('eeeeeeeee', e))
      .finally(() => {
        setAddCategoryLoading(false);
        setCategoryName('');
        setErrMsg('');
      });
  };
  const deleteCate = id => {
    deleteCategory(id)
      .then(res => {
        console.log('resposnessss', res);
        Alert.alert('Deleted', res.data.msg);
        onGetCategory();
      })
      .catch(e => console.log('error', e));
  };
  const onEditCategory = id => {
    const payload = {
      user_id: user_id,
      name: categoryName,
    };
    editCategory(id, payload)
      .then(res => {
        console.log('Edit', res.data.msg);
        Alert.alert(res.data.msg);
        onGetCategory();
      })
      .catch(e => console.log('Error', e))
      .finally(() => {
        setEditData('');
        setCategoryName('');
        setAddNewCategory(false);
      });
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

  // for (let i = 0; i < postData.profile; i++) {
  //   formData.append(`file`, postData.file, postData.file.filename);
  // }
  const onAddDish = () => {
    const postData = dish;
    // postData['file'] = dish.file;
    const formData = new FormData();
    buildFormData(formData, postData);
    // formData.append(`file`, dish.file, dish.file.filename);
    console.log('post adata', dish);
    formData.append('category', value);
    formData.append('file', {
      uri: file.uri,
      name: file.fileName,
      type: file.type,
    });
    console.log('FormData----', formData);
    const payload = {};
    addDish(formData)
      .then(res => {
        console.log('THank God', res.data);
        Alert.alert('Added', res.data.msg);
        onGetDish();
      })
      .catch(e => console.log('eeeeeee', e))
      .finally(() => {
        setDish({
          user_id: '',
          name: '',
          description: '',
          price: '',
          detary_flags: '',
          category: '',
          availability: '',
        });
        setFile('');
      });
  };
  const onGetDish = () => {
    setOnLoadDish(true);
    getDish()
      .then(res => {
        console.log('Dishesss', res);
        setDishData(res.data);
        setMasterDataRes(res.data);
      })
      .catch(e => console.log(e))
      .finally(() => setOnLoadDish(false));
  };
  // const validate = () => {
  //   const errors = [];
  //   if (dish.name?.length == 0) {
  //     setError('Name *');
  //   } else if (dish.description?.length == 0) {
  //     setError('Description *');
  //   } else if (dish.price?.length == 0) {
  //     setError('Price *');
  //   } else if (dish.detary_flags?.length == 0) {
  //     setError('Detary Flags *');
  //   } else if (dish.category?.length == 0) {
  //     setError('Category *');
  //   } else if (dish.availability?.length == 0) {
  //     setError('Availability');
  //   }
  //   if (errors.length > 0) {
  //     let errorMessage = '';
  //     errors.forEach(error => {
  //       errorMessage += '\n' + error;
  //     });
  //     // Alert.alert('Missing or invalid information', errorMessage);
  //   } else {
  //     // onAddDish();
  //     console.log('Fucl upy');
  //   }
  // };
  const onDeteteDish = id => {
    deleteDish(id)
      .then(res => {
        Alert.alert('Deleted', res.data.msg);
        onGetDish();
      })
      .catch(e => console.log('e', e));
  };
  const onEditDish = id => {
    const postData = dish;
    // postData['file'] = dish.file;
    const formData = new FormData();
    buildFormData(formData, postData);

    formData.append('file', {
      uri: file.uri,
      name: file.fileName,
      type: file.type,
    });
    console.log('FormData----', postData);
    editDish(id, postData)
      .then(res => {
        Alert.alert('Added', res.data.msg);
        onGetDish();
      })
      .catch(e => console.log('err', e))
      .finally(() => {
        setDish({
          user_id: '',
          name: '',
          description: '',
          price: '',
          detary_flags: '',
          category: '',
          availability: '',
        });
        setFile('');
      });
  };
  useEffect(() => {
    onGetCategory();
    onGetDish();
    AsyncStorage.getItem('user_id').then(res => {
      setUser_id(res);
      console.log('Response', res);
    });
    setItems(categories);
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView>
        <Header icon title="Manage Menu" onPress={() => navigation.goBack()} />
        {console.log('edit Data', editData)}
        <CustomText
          label="All Categories"
          fontFamily={fonts.bold}
          fontSize={verticalScale(12)}
          container={{
            marginHorizontal: scale(20),
            marginVertical: verticalScale(20),
          }}
        />
        <View style={{marginHorizontal: scale(20)}}>
          <CustomInput
            placeholder="Search Categories"
            value={searchCategory}
            onChangeText={text => {
              searchData(text);
            }}
          />
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {addCateLoader ? (
            <View
              style={{
                width: scale(350),
                alignSelf: 'center',
                marginVertical: verticalScale(20),
              }}>
              <ActivityIndicator color={colors.lightBlue} />
            </View>
          ) : categories.length === 0 ? (
            <View
              style={{
                marginHorizontal: scale(20),
                marginBottom: verticalScale(20),
              }}>
              <CustomText label="Category Not Found" color={colors.red} />
            </View>
          ) : (
            categories.map((item, i) => {
              return (
                <View
                  style={{
                    backgroundColor: colors.lightBlue,
                    height: verticalScale(40),
                    width: scale(130),
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    borderRadius: 5,
                    marginHorizontal: scale(20),
                    marginBottom: verticalScale(20),
                    flexDirection: 'row',
                  }}
                  key={item.id}>
                  <CustomText
                    label={item.name ? item.name : null}
                    color={colors.white}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setEditData(item);
                      setAddNewCategory(true);
                      setCategoryName(item.name);
                    }}>
                    <Icons
                      family="AntDesign"
                      name="edit"
                      color={colors.white}
                      size={17}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert('Delete', 'Do you Delete This Category?', [
                        {
                          text: 'No',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Yes',
                          onPress: () => deleteCate(item.id),

                          // navigation.navigate('viewOrder', {
                          //   data: item,
                          // }),
                        },
                      ]);
                    }}>
                    <Icons
                      family="EvilIcons"
                      name="trash"
                      color={colors.white}
                      size={17}
                    />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </ScrollView>
        <CustomButton
          containerStyle={{marginHorizontal: scale(20)}}
          title={addNewCategory ? 'Cancel' : 'Add New Category'}
          onPress={() => setAddNewCategory(!addNewCategory)}
        />
        {addNewCategory && (
          <View
            style={{
              marginHorizontal: scale(20),
              marginTop: verticalScale(20),
            }}>
            <CustomInput
              placeholder="Category Name"
              value={categoryName}
              onChangeText={setCategoryName}
            />
            {errMsg.length ? (
              <CustomText
                label={errMsg}
                color={colors.red}
                fontFamily={fonts.medium}
                container={{marginBottom: verticalScale(10)}}
              />
            ) : null}
            {editData?.length == 0 ? (
              <CustomButton
                title="Add"
                alignSelf="center"
                onPress={onSubmit}
                loading={addCategoryLoading}
              />
            ) : (
              <CustomButton
                title="Update"
                alignSelf="center"
                onPress={() => onEditCategory(editData.id)}
              />
            )}
          </View>
        )}

        <CustomText
          label="All Dishes"
          fontFamily={fonts.bold}
          fontSize={verticalScale(12)}
          container={{
            marginHorizontal: scale(20),
            marginTop: addNewCategory ? 0 : verticalScale(20),
            marginBottom: verticalScale(20),
          }}
        />
        <View style={{marginHorizontal: scale(20)}}>
          <CustomInput
            placeholder="Search Dishes"
            value={dishSearch}
            onChangeText={text => {
              searchDish(text);
            }}
          />

          <ScrollView horizontal={true}>
            {onLoadDish ? (
              <View
                style={{
                  width: scale(350),
                  alignSelf: 'center',
                  marginVertical: verticalScale(20),
                }}>
                <ActivityIndicator color={colors.lightBlue} />
              </View>
            ) : dishData.length == 0 ? (
              <CustomText
                label="No Dish Found"
                color={colors.red}
                container={{marginVertical: verticalScale(20)}}
              />
            ) : (
              dishData.map(item => {
                console.log('img---', `${api}:5000/static/${item.file}`);
                return (
                  <Card
                    key={item.id}
                    availability={item.availability ? item.availability : null}
                    dietary_flags={item.detary_flags ? item.detary_flags : null}
                    name={item.name ? item.name : null}
                    price={item.price ? item.price : null}
                    icons
                    onEdit={() => {
                      setEditdishData(item);
                      setDish({
                        name: item.name,
                        price: item.price,
                        detary_flags: item.detary_flags,
                        description: item.description,
                        category: item.category,
                        availability: item.availability,
                      });
                      setFile(`http://192.168.10.3:5000/static/${item.file}`);
                    }}
                    onDelete={() => {
                      Alert.alert('Delete', 'Do you Delete This dish?', [
                        {
                          text: 'No',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Yes',
                          onPress: () => onDeteteDish(item.id),

                          // navigation.navigate('viewOrder', {
                          //   data: item,
                          // }),
                        },
                      ]);
                    }}
                    description={item.description ? item.description : null}
                    uri={
                      item.file ? `${api}:5000/static/${item.file}` : 'hello'
                    }
                  />
                );
              })
            )}
          </ScrollView>

          <View>
            <CustomInput
              value={dish.name}
              placeholder="Name"
              withLabel="Name"
              onChangeText={e => setDish({...dish, name: e})}
            />
            <CustomInput
              value={dish.description}
              withLabel="Description"
              placeholder="Description"
              onChangeText={e => setDish({...dish, description: e})}
            />
            <CustomInput
              value={dish.price}
              withLabel="Price"
              placeholder="Price"
              onChangeText={e => setDish({...dish, price: e})}
            />
            <CustomText
              label={file.fileName}
              container={{marginBottom: verticalScale(10)}}
            />
            {console.log('Edit Dish Data', editDishData.id)}
            <UploadPhoto
              handleChange={res => {
                setFile(res);
                console.log('Files', file);
              }}
              renderButton={handleChange => (
                <CustomButton
                  title="upload Image"
                  onPress={handleChange}
                  containerStyle={{marginBottom: verticalScale(20)}}
                />
              )}
            />
            <CustomInput
              value={dish.detary_flags}
              withLabel="Detary Flags"
              placeholder="Detary Flags"
              onChangeText={e => setDish({...dish, detary_flags: e})}
            />
            <CustomText
              label="Category"
              fontSize={14}
              color={colors.midBlue}
              fontFamily={fonts.bold}
              container={{marginBottom: verticalScale(20)}}
            />
            {console.log('items', items)}
            <DropDownPicker
              open={open}
              value={value}
              items={items.map(item => ({
                label: item.name,
                value: item.name,
              }))}
              listMode="SCROLLVIEW"
              style={{
                marginBottom: open ? verticalScale(35) : verticalScale(15),
                height: verticalScale(41),
                borderRadius: 5,
              }}
              containerStyle={{}}
              dropDownDirection="TOP"
              placeholder={
                <CustomText label="Select Category" color="#c8c8c8" />
              }
              labelStyle={styles.textStyle}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
            />
            {/* <CustomInput
              value={dish.category}
              withLabel="Category Name"
              placeholder="Category Name"
              onChangeText={e => setDish({...dish, category: e})}
            /> */}
            <CustomInput
              value={dish.availability}
              withLabel="Availability"
              placeholder="Availability"
              onChangeText={e => setDish({...dish, availability: e})}
            />
            {error.length ? (
              <CustomText
                label={errMsg}
                color={colors.red}
                fontFamily={fonts.medium}
                container={{marginBottom: verticalScale(10)}}
              />
            ) : null}
            {editDishData?.length == 0 ? (
              <CustomButton title="Add Dish" onPress={onAddDish} />
            ) : (
              <CustomButton
                title="Update Dish"
                onPress={() => onEditDish(editDishData.id)}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = ScaledSheet.create({
  textStyle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.lightBlue,
  },
});
export default ManageMenu;
