import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../../common/components/Header";
import colors from "../../../util/colors";
import CustomText from "../../../common/components/CustomText";
import {
  scale,
  ScaledSheet,
  verticalScale,
} from "react-native-size-matters";
import Icons from "../../../common/components/Icons";
import fonts from "../../../assets/fonts";
import CustomButton from "../../../common/components/CustomButton";
import CustomInput from "../../../common/components/CustomInput";
import DropDownPicker from "react-native-dropdown-picker";
import { api } from "../../../util/config"; // ✅ same as PlaceOrder

// API
import {
  getAllCategory,
  AddCategory,
  deleteCategory,
  editCategory,
  getDish,
  addDish,
  editDish,
  deleteDish,
} from "../../../services/Api";

const ManageMenu = ({ navigation }) => {
  // ---------------------
  // CATEGORY STATE
  // ---------------------
  const [categoryList, setCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editCategoryMode, setEditCategoryMode] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // ---------------------
  // DISH STATE
  // ---------------------
  const [dishList, setDishList] = useState([]);

  // align field names with backend / PlaceOrder
  const [dishData, setDishData] = useState({
    name: "",
    description: "",
    price: "",
    dietary_flags: "",
    availability: "",
    file: null, // filename from backend
  });

  // use category NAME (string) for consistency with PlaceOrder
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openCatDropdown, setOpenCatDropdown] = useState(false);

  const [catLoader, setCatLoader] = useState(false);
  const [dishLoader, setDishLoader] = useState(false);

  // ---------------------
  // LOAD CATEGORIES
  // ---------------------
  const loadCategories = () => {
    setCatLoader(true);
    getAllCategory()
      .then((res) => setCategoryList(res.data ?? []))
      .finally(() => setCatLoader(false));
  };

  // ---------------------
  // LOAD DISHES
  // ---------------------
  const loadDishes = () => {
    setDishLoader(true);
    getDish()
      .then((res) => setDishList(res.data ?? []))
      .finally(() => setDishLoader(false));
  };

  useEffect(() => {
    loadCategories();
    loadDishes();
  }, []);

  // ---------------------
  // ADD CATEGORY
  // ---------------------
  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "Category name required");
      return;
    }

    AddCategory({ category: categoryName })
      .then(() => {
        Alert.alert("Success", "Category added");
        loadCategories();
        setCategoryName("");
      })
      .catch(() => Alert.alert("Error", "Failed to add category"));
  };

  // ---------------------
  // EDIT CATEGORY
  // ---------------------
  const handleEditCategory = () => {
    if (!editingCategoryId) return;

    editCategory(editingCategoryId, { category: categoryName })
      .then(() => {
        Alert.alert("Success", "Updated!");
        setEditCategoryMode(false);
        setEditingCategoryId(null);
        setCategoryName("");
        loadCategories();
      })
      .catch(() => Alert.alert("Error", "Update failed"));
  };

  // ---------------------
  // DELETE CATEGORY
  // ---------------------
  const handleDeleteCategory = (id) => {
    Alert.alert("Delete Category", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: () =>
          deleteCategory(id)
            .then(() => {
              loadCategories();
            })
            .catch(() => Alert.alert("Error", "Delete failed")),
      },
    ]);
  };

  // ---------------------
  // ADD DISH
  // ---------------------
  const handleAddDish = () => {
    if (!dishData.name || !dishData.price || !selectedCategory) {
      Alert.alert("Error", "Fill required fields");
      return;
    }

    const payload = {
      ...dishData,
      category: selectedCategory, // category NAME
    };

    addDish(payload)
      .then(() => {
        Alert.alert("Success", "Dish added!");
        setDishData({
          name: "",
          description: "",
          price: "",
          dietary_flags: "",
          availability: "",
          file: null,
        });
        setSelectedCategory(null);
        loadDishes();
      })
      .catch(() => Alert.alert("Error", "Could not add dish"));
  };

  // ---------------------
  // EDIT DISH
  // ---------------------
  const [editingDishId, setEditingDishId] = useState(null);
  const [editDishMode, setEditDishMode] = useState(false);

  const handleEditDish = () => {
    if (!editingDishId) return;

    const payload = {
      ...dishData,
      category: selectedCategory,
    };

    editDish(editingDishId, payload)
      .then(() => {
        Alert.alert("Updated", "Dish updated");
        setEditDishMode(false);
        setEditingDishId(null);
        setDishData({
          name: "",
          description: "",
          price: "",
          dietary_flags: "",
          availability: "",
          file: null,
        });
        setSelectedCategory(null);
        loadDishes();
      })
      .catch(() => Alert.alert("Error", "Update failed"));
  };

  // ---------------------
  // DELETE DISH
  // ---------------------
  const handleDeleteDish = (id) => {
    Alert.alert("Delete Dish", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: () =>
          deleteDish(id)
            .then(() => {
              loadDishes();
            })
            .catch(() => Alert.alert("Error", "Delete failed")),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header title="Manage Menu" icon onPress={() => navigation.goBack()} />

        {/* ---------------- CATEGORY SECTION ---------------- */}
        <CustomText
          label="All Categories"
          fontSize={16}
          fontFamily={fonts.bold}
          container={{ marginLeft: scale(20), marginVertical: 20 }}
        />

        <CustomInput
          placeholder="Search Categories"
          containerStyle={{ marginHorizontal: scale(20) }}
        />

        {catLoader ? (
          <ActivityIndicator color={colors.midBlue} />
        ) : categoryList.length === 0 ? (
          <CustomText
            label="Category Not Found"
            color={colors.red}
            container={{ marginLeft: scale(20), marginTop: 10 }}
          />
        ) : (
          categoryList.map((cat) => (
            <View key={cat.id} style={styles.categoryCard}>
              <CustomText label={cat.category} color={colors.white} />

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => {
                    setCategoryName(cat.category);
                    setEditingCategoryId(cat.id);
                    setEditCategoryMode(true);
                  }}
                  style={{ marginRight: 12 }}
                >
                  <Icons
                    family="AntDesign"
                    name="edit"
                    size={18}
                    color="white"
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDeleteCategory(cat.id)}>
                  <Icons
                    family="EvilIcons"
                    name="trash"
                    size={22}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* ADD CATEGORY */}
        <View style={{ marginTop: 20 }}>
          <CustomButton
            title={editCategoryMode ? "Update Category" : "Add New Category"}
            onPress={editCategoryMode ? handleEditCategory : handleAddCategory}
            containerStyle={{
              width: "60%",
              alignSelf: "center",
              marginBottom: 20,
            }}
          />
        </View>

        {/* ---------------- DISH LIST ---------------- */}
        <CustomText
          label="All Dishes"
          fontSize={16}
          fontFamily={fonts.bold}
          container={{ marginLeft: scale(20), marginVertical: 20 }}
        />

        <CustomInput
          placeholder="Search Dishes"
          containerStyle={{ marginHorizontal: scale(20) }}
        />

        {dishLoader ? (
          <ActivityIndicator color={colors.midBlue} />
        ) : dishList.length === 0 ? (
          <CustomText
            label="No dishes found"
            color={colors.red}
            container={{ marginLeft: scale(20), marginTop: 10 }}
          />
        ) : (
          dishList.map((dish) => (
            <View key={dish.id} style={styles.dishCard}>
              {/* IMAGE - now consistent with PlaceOrder */}
              {dish.file ? (
                <Image
                  source={{ uri: `${api}/static/${dish.file}` }}
                  style={{ width: "100%", height: 140, borderRadius: 8 }}
                />
              ) : (
                <View style={styles.noImageBox}>
                  <CustomText label="No Image" />
                </View>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setEditDishMode(true);
                    setEditingDishId(dish.id);
                    setDishData({
                      name: dish.name,
                      description: dish.description,
                      price: dish.price?.toString?.() ?? `${dish.price}`,
                      dietary_flags: dish.dietary_flags ?? "",
                      availability: dish.availability ?? "",
                      file: dish.file ?? null,
                    });
                    // category stored as name string
                    setSelectedCategory(dish.category ?? null);
                  }}
                  style={{ marginRight: 12 }}
                >
                  <Icons family="AntDesign" name="edit" size={18} color="red" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDeleteDish(dish.id)}>
                  <Icons
                    family="EvilIcons"
                    name="trash"
                    size={22}
                    color="red"
                  />
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 10 }}>
                <CustomText label={`Name:  ${dish.name}`} />
                <CustomText label={`Description:  ${dish.description}`} />
                <CustomText
                  label={`Dietary:  ${dish.dietary_flags ?? "None"}`}
                />
                <CustomText label={`Price:  $${dish.price}`} />
                <CustomText
                  label={`Available:  ${dish.availability ?? "Unknown"}`}
                />
                <CustomText
                  label={`Category:  ${dish.category ?? "Unassigned"}`}
                />
              </View>
            </View>
          ))
        )}

        {/* ---------------- ADD / EDIT DISH FORM ---------------- */}
        <View style={{ marginTop: 20, paddingHorizontal: scale(20) }}>
          <CustomInput
            withLabel="Name"
            placeholder="Name"
            value={dishData.name}
            onChangeText={(e) => setDishData({ ...dishData, name: e })}
          />

          <CustomInput
            withLabel="Description"
            placeholder="Description"
            value={dishData.description}
            onChangeText={(e) => setDishData({ ...dishData, description: e })}
          />

          <CustomInput
            withLabel="Price"
            placeholder="Price"
            value={dishData.price}
            onChangeText={(e) => setDishData({ ...dishData, price: e })}
            keyboardType="numeric"
          />

          {/* UPLOAD IMAGE BUTTON (still to be wired up to picker / uploader) */}
          <CustomButton
            title="Upload Image"
            containerStyle={{ width: "60%", alignSelf: "center" }}
            onPress={() => {
              Alert.alert(
                "Not Implemented",
                "Image upload not wired up yet in this screen."
              );
            }}
          />

          <CustomInput
            withLabel="Dietary Flags"
            placeholder="Vegan, Gluten Free, etc."
            value={dishData.dietary_flags}
            onChangeText={(e) =>
              setDishData({ ...dishData, dietary_flags: e })
            }
          />

          <CustomText
            label="Category"
            fontFamily={fonts.medium}
            fontSize={15}
            color={colors.midBlue}
            container={{ marginTop: 15 }}
          />

          <DropDownPicker
            open={openCatDropdown}
            value={selectedCategory}
            items={categoryList.map((cat) => ({
              label: cat.category,
              value: cat.category, // ✅ use name so it matches PlaceOrder filtering
            }))}
            setOpen={setOpenCatDropdown}
            setValue={setSelectedCategory}
            placeholder="Select Category"
            style={{ marginBottom: 10 }}
          />

          <CustomInput
            withLabel="Availability"
            placeholder="Available / Not Available"
            value={dishData.availability}
            onChangeText={(e) =>
              setDishData({ ...dishData, availability: e })
            }
          />

          <CustomButton
            title={editDishMode ? "Update Dish" : "Add Dish"}
            onPress={editDishMode ? handleEditDish : handleAddDish}
            containerStyle={{ marginTop: 20, marginBottom: 40 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = ScaledSheet.create({
  container: { flex: 1, backgroundColor: colors.white },

  categoryCard: {
    backgroundColor: colors.lightBlue,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dishCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 15,
    elevation: 3,
  },

  noImageBox: {
    backgroundColor: "#f2f2f2",
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default ManageMenu;
