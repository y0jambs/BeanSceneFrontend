import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScaledSheet, verticalScale } from "react-native-size-matters";

import CustomInput from "../../../common/components/CustomInput";
import CustomButton from "../../../common/components/CustomButton";
import CustomText from "../../../common/components/CustomText";

import colors from "../../../util/colors";
import images from "../../../assets/images";
import fonts from "../../../assets/fonts";

import { isValidEmail } from "../../../util/validation";
import { login } from "../../../services/Api";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  // ------------------------------------------------------------------
  // AUTO LOGIN IF USER ALREADY SAVED
  // ------------------------------------------------------------------
  useEffect(() => {
    const checkStoredUser = async () => {
      try {
        const storedId = await AsyncStorage.getItem("user_id");
        if (storedId) {
          navigation.navigate("MainStack");
        }
      } catch (e) {
        console.log("Error reading stored user", e);
      }
    };

    checkStoredUser();
  }, [navigation]);

  // ------------------------------------------------------------------
  // VALIDATION
  // ------------------------------------------------------------------
  const validate = () => {
    const errors = [];

    if (!email?.length) {
      errors.push("Email address *");
    } else if (!isValidEmail(email)) {
      errors.push("Invalid email address");
    }

    if (!password?.length) {
      errors.push("Password *");
    }

    if (errors.length > 0) {
      setError(errors.join("\n"));
      return;
    }

    setError("");
    onSubmit();
  };

  // ------------------------------------------------------------------
  // SUBMIT LOGIN
  // ------------------------------------------------------------------
  const onSubmit = () => {
    setLoader(true);

    const payload = {
      email: email.trim(),
      password,
    };

    login(payload)
      .then(async (res) => {
        console.log("LOGIN RESPONSE:", res.data);

        // if API says login failed
        if (!res?.data?.success || !res?.data?.data) {
          Alert.alert("Login failed", res?.data?.message || "Invalid details.");
          return;
        }

        const user = res.data.data;

        // save pieces we’ll need elsewhere
        await AsyncStorage.setItem("user_id", user.id);
        await AsyncStorage.setItem("user_type", user.user_type || "");
        await AsyncStorage.setItem(
          "user_name",
          `${user.firstName || ""} ${user.lastName || ""}`.trim()
        );
        await AsyncStorage.setItem("user_email", user.email || "");

        navigation.navigate("MainStack");
      })
      .catch((e) => {
        console.log("LOGIN ERROR:", e?.response?.data || e);
        Alert.alert("Error", "Please check your email and password.");
      })
      .finally(() => setLoader(false));
  };

  // ------------------------------------------------------------------
  // UI
  // ------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imgContainer}>
          <Image
            source={images.logo}
            style={{ width: "100%" }}
            resizeMode="contain"
          />

          <CustomInput
            placeholder="Email"
            withLabel="Email"
            borderWidth={0.5}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
          />

          <CustomInput
            placeholder="Password"
            withLabel="Password"
            value={password}
            secureTextEntry
            borderWidth={0.5}
            onChangeText={setPassword}
          />

          {error?.length ? (
            <CustomText
              label={error}
              color={colors.red}
              fontFamily={fonts.medium}
              container={{ marginBottom: verticalScale(10) }}
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
    marginHorizontal: "20@s",
  },
});
