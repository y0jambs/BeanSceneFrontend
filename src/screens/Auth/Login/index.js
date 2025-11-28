import {
  Alert,
  AsyncStorage,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomInput from '../../../common/components/CustomInput';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import colors from '../../../util/colors';
import images from '../../../assets/images';
import CustomButton from '../../../common/components/CustomButton';
import {isValidEmail} from '../../../util/validation';
import {login} from '../../../services/Api';
import CustomText from '../../../common/components/CustomText';
import fonts from '../../../assets/fonts';
const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    AsyncStorage.getItem('user_id').then(res => {
      if (res == null) {
        return;
      } else {
        navigation.navigate('MainStack');
      }
    });
  });
  const [loader, setLoader] = useState(false);
  const validate = () => {
    const errors = [];

    if (email?.length == 0) {
      errors.push('Email address *');
      setError('Email address *');
    } else if (!isValidEmail(email)) {
      errors.push('Invalid email address');
      setError('Invalid email address');
    } else if (password?.length == 0) {
      errors.push('Password *');
      setError('Password *');
    }

    if (errors.length > 0) {
      let errorMessage = '';
      errors.forEach(error => {
        errorMessage += '\n' + error;
      });
      // Alert.alert('Missing or invalid information', errorMessage);
    } else {
      onSubmit();
    }
  };

  const onSubmit = () => {
    setLoader(true);
    const payload = {
      email: email,
      password: password,
    };

    login(payload)
      .then(res => {
        // make sure these match what your API returns
        AsyncStorage.setItem('user_id',   res?.data?.data.user_id);
        AsyncStorage.setItem('user_type', res?.data?.data.user_type);
        AsyncStorage.setItem('user_name', res?.data?.data.user_name); // added save username

        console.log(res);
        navigation.navigate('MainStack');
      })
      .catch(e => {
        Alert.alert('Error', 'Please Check your email and password');
        console.log('Error', e);
      })
      .finally(() => setLoader(false));
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imgContainer}>
          <Image
            source={images.logo}
            style={{width: '100%'}}
            resizeMode="contain"
          />
          <CustomInput
            placeholder="Email"
            withLabel="Email"
            borderWidth={0.5}
            value={email}
            onChangeText={setEmail}
          />
          <CustomInput
            placeholder="Password"
            withLabel="Password"
            value={password}
            secureTextEntry={true}
            borderWidth={0.5}
            onChangeText={setPassword}
          />
          {error.length ? (
            <CustomText
              label={error}
              color={colors.red}
              fontFamily={fonts.medium}
              container={{marginBottom: verticalScale(10)}}
            />
          ) : null}
          <CustomButton
            loading={loader}
            title="Login"
            width="100%"
            onPress={validate}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imgContainer: {
    flex: 1,
    marginHorizontal: '20@s',
  },
});
