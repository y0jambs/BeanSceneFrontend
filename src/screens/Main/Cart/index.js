import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import colors from "../../../util/colors";
import Header from "../../../common/components/Header";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CustomText from "../../../common/components/CustomText";
import fonts from "../../../assets/fonts";
import CustomButton from "../../../common/components/CustomButton";
import { orderCheckout } from "../../../services/Api";

const Cart = ({ navigation, route }) => {
  const { order, onReturn } = route.params;

  const [cartItems, setCartItems] = useState(order);
  const [loader, setLoader] = useState(false);

  // REMOVE ONE ITEM
  const removeItem = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
    onReturn(updated);
  };

  // CLEAR ENTIRE CART
  const clearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            setCartItems([]);
            onReturn([]);   // 🔥 IMPORTANT FIX
          },
        },
      ],
      { cancelable: true }
    );
  };

  const placeOrder = () => {
    if (cartItems.length === 0) return alert("Cart is empty");

    const first = cartItems[0];
    const payload = {
      order: cartItems,
      customerName: first.customerName || "Guest",
      orderDateTime: new Date().toISOString(),
      tableRef: first.table,
      area: first.area,
      status: "inprogress",
    };

    setLoader(true);

    orderCheckout(payload)
      .then(() => {
        Alert.alert("Success", "Order placed!");
        setCartItems([]);
        onReturn([]);
        setTimeout(() => navigation.goBack(), 500);
      })
      .catch(() => Alert.alert("Error", "Could not place order"))
      .finally(() => setLoader(false));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.item.price),
    0
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView>
        <Header title="Cart" icon onPress={() => navigation.goBack()} />

        {cartItems.length > 0 && (
          <View style={{ marginHorizontal: scale(20), marginTop: 20 }}>
            <CustomText label="Sitting" fontFamily={fonts.bold} />
            <CustomText label={`Area: ${cartItems[0].area}`} />
            <CustomText label={`Table: ${cartItems[0].table}`} />
          </View>
        )}

        {cartItems.length === 0 ? (
          <View
            style={{
              marginTop: verticalScale(40),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CustomText label="Your Cart is Empty" />
          </View>
        ) : (
          cartItems.map((cart, index) => (
            <View
              key={index}
              style={{
                marginHorizontal: scale(20),
                marginTop: 15,
                borderBottomWidth: 1,
                paddingBottom: 10,
                borderColor: colors.bocColor,
              }}
            >
              <CustomText label="Dish Name" fontFamily={fonts.bold} />
              <CustomText label={cart.item.name} />

              <CustomText
                style={{ marginTop: 10 }}
                label="Price"
                fontFamily={fonts.bold}
              />
              <CustomText label={`$${cart.item.price}`} />

              <TouchableOpacity
                onPress={() => removeItem(index)}
                style={{
                  marginTop: 8,
                  alignSelf: "flex-end",
                  backgroundColor: "red",
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "#fff" }}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {cartItems.length > 0 && (
          <>
            <View
              style={{
                marginHorizontal: scale(20),
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <CustomText label="Total:" fontFamily={fonts.bold} />
              <Text style={{ marginLeft: 8, color: colors.midBlue }}>
                ${total}
              </Text>
            </View>

            <CustomButton
              title="Clear Cart"
              onPress={clearCart}
              containerStyle={{
                marginTop: 10,
                backgroundColor: "red",
                width: "60%",
                alignSelf: "center",
              }}
            />

            <CustomButton
              title="Place Order"
              loading={loader}
              onPress={placeOrder}
              containerStyle={{
                marginTop: 20,
                marginBottom: 30,
                width: "90%",
                alignSelf: "center",
              }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cart;
