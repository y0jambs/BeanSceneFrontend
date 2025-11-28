import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../common/components/Header';
import colors from '../../../util/colors';
import CustomText from '../../../common/components/CustomText';
import {
  moderateScale,
  scale,
  ScaledSheet,
  verticalScale,
} from 'react-native-size-matters';
import Icons from '../../../common/components/Icons';
import fonts from '../../../assets/fonts';
import CustomButton from '../../../common/components/CustomButton';
import CustomInput from '../../../common/components/CustomInput';
import DropDownPicker from 'react-native-dropdown-picker';
import {isValidEmail} from '../../../util/validation';
import {addUser, allUser, deleteUser, editUser} from '../../../services/Api';

const ManageStaff = ({navigation}) => {
  const [updateData, setUpdateData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [editData, setEditData] = useState('');
  const [staffData, setStaffData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([
    {label: 'manager', value: 'manager'},
    {label: 'waiter staff', value: 'waiter staff'},
    {label: 'kitchen staff', value: 'kitchen staff'},
  ]);
  const [error, setError] = useState('');
  const [adduserloader, setAdduserLoader] = useState(false);
  const [getUserLoader, setGetUserLoader] = useState(false);
  const allUsers = () => {
    setGetUserLoader(true);
    allUser()
      .then(res => setStaffData(res.data))
      .finally(() => setGetUserLoader(false));
  };
  const onAddUser = () => {
    setAdduserLoader(true);
    const payload = {
      user_id: 'VCDlagAoY2asljwIDVmn',
      firstname: updateData.firstname,
      lastname: updateData.lastname,
      email: updateData.email,
      password: updateData.password,
      user_type: value,
    };
    console.log('payload', payload);
    addUser(payload)
      .then(res => {
        console.log('res', res.data.msg);
        Alert.alert('Create', res.data.msg);
        allUsers();
      })
      .catch(e => console.log('error', e))
      .finally(() => {
        setUpdateData({
          firstname: '',
          lastname: '',
          email: '',
          password: '',
        });
        setValue('');
        setAdduserLoader(false);
        setError('');
      });
  };
  const onDeleteUser = id => {
    deleteUser(id)
      .then(res => {
        Alert.alert('Deleted', res.data.msg);
        allUsers();
      })
      .catch(e => console.log('e', e));
  };
  const onEditUser = id => {
    const payload = {
      firstname: updateData.firstname,
      lastname: updateData.lastname,
      email: updateData.email,
      password: updateData.password,
      user_type: value,
    };
    editUser(id, payload)
      .then(res => {
        Alert.alert('Edited', res.data.msg);
        allUsers();
      })
      .catch(e => console.log('e', e))
      .finally(() => {
        setUpdateData({
          firstname: '',
          lastname: '',
          email: '',
          password: '',
        });
        setValue('');
        setEditData('');
      });
  };
  useEffect(() => {
    allUsers();
  }, []);
  const validate = () => {
    const errors = [];
    if (updateData.firstname?.length == 0) {
      errors.push('First name *');
      setError('First name *');
    } else if (updateData.lastname?.length == 0) {
      errors.push('Last name *');
      setError('Last name *');
    } else if (updateData.email?.length == 0) {
      errors.push('Email address *');
      setError('Email address *');
    } else if (!isValidEmail(updateData.email)) {
      errors.push('Invalid email address');
      setError('Invalid email address');
    } else if (updateData.password?.length == 0) {
      errors.push('Password *');
      setError('Password *');
    } else if (updateData.password.length <= 7) {
      errors.push('Password must be upto 8 Charachters');
      setError('Password must be upto 8 Charachters');
    }
    if (errors.length > 0) {
      let errorMessage = '';
      errors.forEach(error => {
        errorMessage += '\n' + error;
      });
      // Alert.alert('Missing or invalid information', errorMessage);
    } else {
      onAddUser();
    }
  };
  const onSubmit = () => {
    setStaffData([...staffData, updateData]);
    Alert.alert('Staff', 'Staff Added');
    setUpdateData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header icon title="Manage Staff" onPress={() => navigation.goBack()} />
        <CustomText
          label="All Staff"
          fontSize={14}
          fontFamily={fonts.bold}
          container={{
            marginVertical: verticalScale(20),
            marginHorizontal: scale(20),
          }}
        />
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {staffData.length === 0 ? (
            <CustomText
              label="No Staff"
              container={{marginHorizontal: scale(20)}}
            />
          ) : getUserLoader ? (
            <View style={{marginHorizontal: scale(20)}}>
              <ActivityIndicator color={colors.lightBlue} />
            </View>
          ) : (
            staffData?.map((item, i) => {
              return (
                <View style={styles.card} key={i}>
                  <CustomText
                    label={`${item.firstname + ' ' + item.lastname}`}
                    color={colors.white}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setEditData(item);
                      setUpdateData({
                        id: item.id,
                        firstname: item.firstname,
                        lastname: item.lastname,
                        email: item.email,
                        password: item.password,
                      });
                      setValue(item.user_type);
                    }}>
                    <Icons
                      family="AntDesign"
                      name="edit"
                      color={colors.white}
                      size={moderateScale(17)}
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
                          onPress: () => onDeleteUser(item.id),

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
                      size={moderateScale(17)}
                    />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </ScrollView>
        <View style={{marginHorizontal: scale(20)}}>
          <View style={{marginVertical: verticalScale(20)}}>
            <CustomInput
              withLabel={'First Name'}
              placeholder="Staff First Name"
              value={updateData.firstname}
              onChangeText={e => setUpdateData({...updateData, firstname: e})}
            />
            <CustomInput
              withLabel={'Last Name'}
              placeholder="Staff Last Name"
              value={updateData.lastname}
              onChangeText={e => setUpdateData({...updateData, lastname: e})}
            />
            <CustomInput
              withLabel={'Email'}
              placeholder="Staff Email"
              value={updateData.email}
              onChangeText={e => setUpdateData({...updateData, email: e})}
            />
            <View>
              <CustomText
                label="User Type"
                color={colors.midBlue}
                fontSize={15}
                container={{marginBottom: verticalScale(15)}}
                fontFamily={fonts.medium}
              />
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                style={{
                  marginBottom: open ? verticalScale(35) : verticalScale(15),
                  height: verticalScale(41),
                  borderRadius: 5,
                }}
                containerStyle={{}}
                dropDownDirection="TOP"
                placeholder={
                  <CustomText label="Select User Type" color="#c8c8c8" />
                }
                labelStyle={styles.textStyle}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
              />
            </View>
            <CustomInput
              withLabel={'Password'}
              placeholder="Password"
              value={updateData.password}
              secureTextEntry={visible ? false : true}
              onIconPress={() => setVisible(!visible)}
              rightIcon
              family="Entypo"
              name={visible ? 'eye' : 'eye-with-line'}
              onChangeText={e => setUpdateData({...updateData, password: e})}
            />
            {error.length ? (
              <CustomText
                label={error}
                color={colors.red}
                fontFamily={fonts.medium}
                container={{marginBottom: verticalScale(10)}}
              />
            ) : null}
            {editData?.length == 0 ? (
              <CustomButton
                alignSelf={'center'}
                title="Add Staff"
                onPress={validate}
                loading={adduserloader}
              />
            ) : (
              <CustomButton
                alignSelf={'center'}
                title="Update Staff"
                onPress={() => onEditUser(editData.id)}
              />
            )}
          </View>
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
  card: {
    backgroundColor: colors.lightBlue,
    height: verticalScale(40),
    width: scale(130),
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 5,
    marginHorizontal: scale(20),
    marginBottom: verticalScale(20),
    flexDirection: 'row',
  },
  textStyle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.lightBlue,
  },
});
export default ManageStaff;
