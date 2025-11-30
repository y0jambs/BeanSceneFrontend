import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScaledSheet } from "react-native-size-matters";

import colors from "../../../util/colors";
import Header from "../../../common/components/Header";
import CustomText from "../../../common/components/CustomText";
import fonts from "../../../assets/fonts";
import Card from "./items/Card";

const Home = ({ navigation }) => {
  const [userType, setUserType] = useState("");
  const [userName, setUserName] = useState("");

  // ------------------------------------------------------
  // LOAD USER INFO FROM STORAGE
  // ------------------------------------------------------
  useEffect(() => {
    const loadUser = async () => {
      try {
        const [type, name] = await Promise.all([
          AsyncStorage.getItem("user_type"),
          AsyncStorage.getItem("user_name"),
        ]);

        if (type) setUserType(type);
        if (name) setUserName(name);

        console.log("USER TYPE:", type);
      } catch (e) {
        console.log("Error loading user from storage:", e);
      }
    };

    loadUser();
  }, []);

  // ------------------------------------------------------
  // LOGOUT
  // ------------------------------------------------------
  const onLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "user_type",
        "user_id",
        "user_name",
        "user_email",
      ]);
      navigation.navigate("AuthStack");
    } catch (e) {
      console.log("Error clearing storage on logout:", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header title="Home" />

        {/* WELCOME BANNER */}
        <View style={styles.welcomeContainer}>
          <CustomText
            label={
              userName
                ? `Welcome, ${userName}`
                : "Welcome to Bean Scene"
            }
            fontFamily={fonts.bold}
            fontSize={18}
          />
          {userType ? (
            <CustomText
              label={`Role: ${userType}`}
              fontFamily={fonts.medium}
              color={colors.grey}
              container={{ marginTop: 4 }}
            />
          ) : null}
        </View>

        {/* MENU CARDS */}
        <View style={styles.card}>
          {/* PLACE ORDER: Manager + Staff + Admin (everyone) */}
          <Card
            text="Place Order"
            family="AntDesign"
            name="search1"
            onPress={() => {
              if (
                userType === "manager" ||
                userType === "staff" ||
                userType === "admin"
              ) {
                navigation.navigate("placeOrder");
              } else {
                Alert.alert("Alert", "You don't have access");
              }
            }}
          />

          {/* VIEW REPORT: Manager + Admin */}
          <Card
            text="View Report"
            family="Octicons"
            name="report"
            onPress={() => {
              if (userType === "manager" || userType === "admin") {
                navigation.navigate("viewReport");
              } else {
                Alert.alert("Alert", "You don't have access");
              }
            }}
          />

          {/* MANAGE STAFF: Admin only */}
          <Card
            text="Manage Staff"
            family="Ionicons"
            name="person-outline"
            onPress={() => {
              if (userType === "admin") {
                navigation.navigate("manageStaff");
              } else {
                Alert.alert("Alert", "You don't have access");
              }
            }}
          />

          {/* VIEW ORDER: everyone can view */}
          <Card
            text="View Order"
            family="Fontisto"
            name="preview"
            onPress={() => navigation.navigate("viewOrder")}
          />

          {/* MANAGE MENU: Manager + Admin */}
          <Card
            text="Manage Menu"
            family="Fontisto"
            name="preview"
            onPress={() => {
              if (userType === "manager" || userType === "admin") {
                navigation.navigate("manageMenu");
              } else {
                Alert.alert("Alert", "You don't have access");
              }
            }}
          />

          {/* LOG OUT */}
          <Card
            text="Log Out"
            family="Fontisto"
            name="preview"
            onPress={onLogout}
          />
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
  welcomeContainer: {
    marginHorizontal: "20@s",
    marginTop: "15@vs",
  },
  card: {
    marginHorizontal: "20@s",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: "20@vs",
    justifyContent: "space-between",
  },
});

export default Home;
