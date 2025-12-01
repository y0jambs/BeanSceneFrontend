// src/screens/Main/PlaceOrder/index.js
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
// if your project was using AsyncStorage from 'react-native' instead, change the line above to:
// import { AsyncStorage } from "react-native";

import {
  moderateScale,
  scale,
  ScaledSheet,
  verticalScale,
} from "react-native-size-matters";

import colors from "../../../util/colors";
import fonts from "../../../assets/fonts";

import Header from "../../../common/components/Header";
import CustomText from "../../../common/components/CustomText";
import CustomButton from "../../../common/components/CustomButton";

import DropDownPicker from "react-native-dropdown-picker";
import { api } from "../../../util/config";

import { getAllCategory, getDish } from "../../../services/Api";

// ---------- STATIC AREA + TABLE DATA ----------
const AREA_ITEMS = [
  { label: "Main", value: "Main" },
  { label: "Outside", value: "Outside" },
  { label: "Balcony", value: "Balcony" },
];

const TABLES_BY_AREA = {
  Main: [
    { label: "M1", value: "M1" },
    { label: "M2", value: "M2" },
    { label: "M3", value: "M3" },
  ],
  Outside: [
    { label: "O1", value: "O1" },
    { label: "O2", value: "O2" },
  ],
  Balcony: [
    { label: "B1", value: "B1" },
    { label: "B2", value: "B2" },
  ],
};

const PlaceOrder = ({ navigation }) => {
  // area / table
  const [area, setArea] = useState("Main");
  const [table, setTable] = useState(null);
  const [areaOpen, setAreaOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);

  // customer
  const [customerName, setCustomerName] = useState("");

  // menu
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [restaurant, setRestaurant] = useState([]);

  // cart (local only – backend is hit from Cart.js)
  const [order, setOrder] = useState([]);

  // -------- LOAD MENU DATA --------
  useEffect(() => {
    getAllCategory()
      .then((res) => setCategories(res.data ?? []))
      .catch(console.log);

    getDish()
      .then((res) => setRestaurant(res.data ?? []))
      .catch(console.log);
  }, []);

  // -------- LOAD CUSTOMER NAME FROM ASYNC STORAGE --------
  useEffect(() => {
    AsyncStorage.getItem("user_name").then((name) => {
      if (name) setCustomerName(name);
    });
  }, []);

  // -------- ADD ITEM TO ORDER (shape matches Cart.js) --------
  const TakeOrder = (item) => {
    if (!table) {
      Alert.alert("Table Required", "Please select a table first.");
      return;
    }

    const entry = {
      item: {
        id: item.id,
        name: item.name,
        price: Number(item.price),
        description: item.description,
        dietary_flags: item.dietary_flags ?? "None",
        file: item.file ?? null,
        image: item.file ? `${api}/static/${item.file}` : null,
      },
      table,
      area,
      customerName,
      status: "inprogress",
      quantity: 1,
    };

    setOrder((prev) => [...prev, entry]);
    Alert.alert("Added", `${item.name} added to cart`);
  };

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* HEADER WITH CART ICON */}
        <Header
          icon
          title="Place Order"
          onPress={() => navigation.goBack()}
          rightIcon
          cart={order.length}
          onCart={() => {
            if (!table || !area) {
              Alert.alert("Missing Info", "Please select area & table first.");
              return;
            }

            navigation.navigate("cart", {
              order,
              table,
              area,
              customerName,
              // this lets Cart send an updated cart back
              onReturn: (updatedCart) => setOrder(updatedCart),
            });
          }}
        />

                {/* AREA + TABLE PICKERS */}
        <View style={{ marginHorizontal: scale(20), marginTop: 20 }}>
          <CustomText
            label="Table / Sitting"
            fontFamily={fonts.bold}
            fontSize={moderateScale(18)}
          />

          {/* AREA PICKER (on top) */}
          <View style={{ zIndex: 2, marginTop: 10 }}>
            <DropDownPicker
              open={areaOpen}
              value={area}
              items={AREA_ITEMS}
              setOpen={setAreaOpen}
              setValue={setArea}
              placeholder="Select Area"
              style={styles.dropdown}
              dropDownContainerStyle={{ borderWidth: 1 }}
              onChangeValue={() => setTable(null)}
            />
          </View>

          {/* TABLE PICKER (underneath) */}
          <View style={{ zIndex: 1, marginTop: 12 }}>
            <DropDownPicker
              open={tableOpen}
              value={table}
              items={TABLES_BY_AREA[area]}
              setOpen={setTableOpen}
              setValue={setTable}
              placeholder="Select Table"
              style={styles.dropdown}
              dropDownContainerStyle={{ borderWidth: 1 }}
            />
          </View>
        </View>


        {/* CATEGORY CHIPS */}
        <View style={{ marginTop: verticalScale(25) }}>
          <CustomText
            label="Categories"
            fontFamily={fonts.bold}
            fontSize={moderateScale(18)}
            container={{ marginHorizontal: scale(20) }}
          />

          <FlatList
            data={categories}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  selectedCategory === item.category &&
                    styles.categoryChipActive,
                ]}
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === item.category
                      ? ""
                      : item.category
                  )
                }
              >
                <CustomText
                  label={item.category}
                  color={
                    selectedCategory === item.category
                      ? colors.white
                      : colors.black
                  }
                />
              </TouchableOpacity>
            )}
          />
        </View>

        {/* DISH CARDS */}
        <View style={styles.dishContainer}>
          {(selectedCategory
            ? restaurant.filter((i) => i.category === selectedCategory)
            : restaurant
          ).map((item, index) => (
            <TouchableOpacity key={index} style={styles.card}>
              {/* IMAGE */}
              {item.file ? (
                <Image
                  source={{ uri: `${api}/static/${item.file}` }}
                  style={styles.image}
                />
              ) : (
                <View style={styles.noImageBox}>
                  <CustomText label="No Image" />
                </View>
              )}

              {/* BODY */}
              <View style={styles.cardBody}>
                <CustomText label={`Name: ${item.name}`} />
                <CustomText label={`Description: ${item.description}`} />
                <CustomText
                  label={`Dietary: ${item.dietary_flags ?? "None"}`}
                />
                <CustomText label={`Price: $${item.price}`} />

                <CustomButton
                  title="Add to Cart"
                  onPress={() => TakeOrder(item)}
                  containerStyle={{ marginTop: 10 }}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- STYLES ----------
const styles = ScaledSheet.create({
  container: { flex: 1, backgroundColor: colors.white },

  dropdown: {
    marginTop: 10,
    height: 45,
  },

  categoryChip: {
    paddingHorizontal: scale(15),
    paddingVertical: scale(8),
    backgroundColor: colors.white,
    borderRadius: 20,
    marginHorizontal: scale(10),
    marginTop: scale(10),
    elevation: 2,
  },

  categoryChipActive: {
    backgroundColor: colors.lightBlue,
  },

  dishContainer: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(10),
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: verticalScale(20),
    elevation: 4,
  },

  image: {
    width: "100%",
    height: verticalScale(150),
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  noImageBox: {
    height: verticalScale(150),
    backgroundColor: "#eee",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  cardBody: {
    padding: 12,
  },
});

export default PlaceOrder;
