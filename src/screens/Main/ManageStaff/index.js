import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../../common/components/Header";
import colors from "../../../util/colors";
import CustomText from "../../../common/components/CustomText";
import { scale, ScaledSheet, verticalScale } from "react-native-size-matters";
import Icons from "../../../common/components/Icons";
import fonts from "../../../assets/fonts";
import CustomButton from "../../../common/components/CustomButton";
import CustomInput from "../../../common/components/CustomInput";
import DropDownPicker from "react-native-dropdown-picker";
import { isValidEmail } from "../../../util/validation";
import { addUser, allUser, deleteUser, editUser } from "../../../services/Api";

const ManageStaff = ({ navigation }) => {
  const [updateData, setUpdateData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const [staffData, setStaffData] = useState([]);
  const [visible, setVisible] = useState(false);

  // DROPDOWN
  const [open, setOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const [roles, setRoles] = useState([
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "Staff", value: "staff" },
  ]);

  const [error, setError] = useState("");
  const [addUserLoader, setAddUserLoader] = useState(false);
  const [getUserLoader, setGetUserLoader] = useState(false);

  // Normalize name
  const getFullName = (u) => {
    const first = u.firstname || u.firstName || u.fname || "";
    const last = u.lastname || u.lastName || u.lname || "";
    return `${first} ${last}`.trim() || "Unnamed";
  };

  // LOAD STAFF
  const loadUsers = () => {
    setGetUserLoader(true);
    allUser()
      .then((res) => setStaffData(res.data))
      .finally(() => setGetUserLoader(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ADD STAFF
  const handleAdd = () => {
    setAddUserLoader(true);

    const payload = {
      firstname: updateData.firstname,
      lastname: updateData.lastname,
      email: updateData.email,
      password: updateData.password,
      user_type: userType,
    };

    addUser(payload)
      .then((res) => {
        Alert.alert("Success", res.data.msg);
        loadUsers();
      })
      .finally(() => resetForm());
  };

  // EDIT STAFF
  const handleEdit = () => {
    const payload = {
      firstname: updateData.firstname,
      lastname: updateData.lastname,
      email: updateData.email,
      password: updateData.password,
      user_type: userType,
    };

    editUser(editUserId, payload)
      .then((res) => {
        Alert.alert("Updated", res.data.msg);
        loadUsers();
      })
      .finally(() => resetForm());
  };

  // DELETE STAFF
  const handleDelete = (id) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: () => {
          deleteUser(id).then((res) => {
            Alert.alert("Deleted", res.data.msg);
            loadUsers();
          });
        },
      },
    ]);
  };

  // VALIDATE FORM
  const validate = () => {
    if (!updateData.firstname) return setError("First name is required");
    if (!updateData.lastname) return setError("Last name is required");
    if (!updateData.email) return setError("Email is required");
    if (!isValidEmail(updateData.email)) return setError("Invalid email");
    if (!updateData.password || updateData.password.length < 8)
      return setError("Password must be at least 8 characters");
    if (!userType) return setError("Please select user type");

    setError("");

    editMode ? handleEdit() : handleAdd();
  };

  const resetForm = () => {
    setUpdateData({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    });
    setUserType(null);
    setEditMode(false);
    setEditUserId(null);
    setAddUserLoader(false);
    setError("");
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

        {/* STAFF LIST */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {getUserLoader ? (
            <ActivityIndicator color={colors.midBlue} />
          ) : staffData.length === 0 ? (
            <CustomText
              label="No Staff Found"
              container={{ marginHorizontal: scale(20) }}
            />
          ) : (
            staffData.map((item, index) => (
              <View key={index} style={styles.card}>
                <CustomText
                  label={getFullName(item)}
                  color={colors.white}
                  container={{ flexShrink: 1, marginRight: 8 }}
                />

                <TouchableOpacity
                  onPress={() => {
                    setEditMode(true);
                    setEditUserId(item.id);

                    setUpdateData({
                      firstname:
                        item.firstname ||
                        item.firstName ||
                        item.fname ||
                        "",
                      lastname:
                        item.lastname ||
                        item.lastName ||
                        item.lname ||
                        "",
                      email: item.email || "",
                      password: item.password || "",
                    });

                    setUserType(item.user_type);
                  }}
                >
                  <Icons
                    family="AntDesign"
                    name="edit"
                    color={colors.white}
                    size={17}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Icons
                    family="EvilIcons"
                    name="trash"
                    color={colors.white}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>

        {/* FORM */}
        <View style={{ marginHorizontal: scale(20), marginTop: 20 }}>
          <CustomInput
            withLabel="First Name"
            placeholder="Staff First Name"
            value={updateData.firstname}
            onChangeText={(e) =>
              setUpdateData({ ...updateData, firstname: e })
            }
          />

          <CustomInput
            withLabel="Last Name"
            placeholder="Staff Last Name"
            value={updateData.lastname}
            onChangeText={(e) =>
              setUpdateData({ ...updateData, lastname: e })
            }
          />

          <CustomInput
            withLabel="Email"
            placeholder="Staff Email"
            value={updateData.email}
            onChangeText={(e) =>
              setUpdateData({ ...updateData, email: e })
            }
          />

          <CustomText
            label="User Type"
            fontFamily={fonts.medium}
            fontSize={15}
            color={colors.midBlue}
          />

          <DropDownPicker
            open={open}
            value={userType}
            items={roles}
            setOpen={setOpen}
            setValue={setUserType}
            setItems={setRoles}
            placeholder="Select User Type"
            style={{ marginBottom: 10 }}
          />

          <CustomInput
            withLabel="Password"
            placeholder="Password"
            secureTextEntry={!visible}
            value={updateData.password}
            onChangeText={(e) =>
              setUpdateData({ ...updateData, password: e })
            }
            rightIcon
            family="Entypo"
            name={visible ? "eye" : "eye-with-line"}
            onIconPress={() => setVisible(!visible)}
          />

          {error !== "" && (
            <CustomText
              label={error}
              color={colors.red}
              container={{ marginVertical: 10 }}
            />
          )}

          <CustomButton
            alignSelf="center"
            title={editMode ? "Update Staff" : "Add Staff"}
            onPress={validate}
            loading={addUserLoader}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = ScaledSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  card: {
    backgroundColor: colors.lightBlue,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 45,
    minWidth: 180,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ManageStaff;
