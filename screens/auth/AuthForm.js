import { View, Text, Button, TextInput, StyleSheet, Alert, useWindowDimensions, Pressable } from "react-native";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../util/http";
import IonIcons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const AuthForm = ({ navigation, route }) => {

  const {width, height} = useWindowDimensions();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState();

  let formIsValid = false;

  if (userName.trim() !== "" && password.trim() !== "") {
    formIsValid = true;
  }

  function handleChangeUserName(inputText) {
    setUserName(inputText);
  }
  function handleChangePassword(inputText) {
    setPassword(inputText);
  }

  const { mutate, data, isPending, error, isError } = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      console.log("before syncstorage")
      // console.log("data is:",data);
      AsyncStorage.setItem("ACCOUNT", JSON.stringify(data.account));
      AsyncStorage.setItem("USER", JSON.stringify(data));
      AsyncStorage.setItem("TOKEN", data.token);
      AsyncStorage.setItem("FULL_NAME", data.firstName + " " + data.lastName);
      AsyncStorage.setItem("USER_NAME", data.userName);
      console.log("after syncstorage")
      setErrorMsg();
      navigation.navigate("catalogue-drawer");
    },
    onError: (err) => {
      // console.log("err is:",err);
      setErrorMsg(err.info ? err.info.errorMessage : "Enter valid credentials!");
    },
    onSettled: ()=>{
      setUserName("");
      setPassword("");
    }
  });

  if(data){
    console.log("data loaded:",data);
  }

  function handleLogin() {
    const formData = {
      userName: userName,
      password: password,
    };

    mutate(formData);
}

  return (
    <View style={[styles.form, {width: width > height ? "50%" : "100%",}]}>
      {errorMsg && <Text style={styles.err}>{`( ${errorMsg} )`}</Text>}
      <View style={styles.inputGrp}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={handleChangeUserName}
          placeholder="Enter username"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={styles.inputGrp}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={handleChangePassword}
          placeholder="Enter password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {/* <Pressable></Pressable> */}
      {/* <Button title="Login" onPress={handleLogin} disabled={!formIsValid} /> */}
      <Button title={`${isPending ? "Loging..." : "Login"}`} onPress={handleLogin} disabled={!formIsValid || isPending} />
    </View>
  );
};

export default AuthForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 30,
    gap: 18,
    alignSelf: 'center',
  },
  inputGrp: {
    width: "100%",
    gap: 6,
  },
  label: {
    textTransform: "uppercase",
    fontSize: 14,
    color: "#8d8a8a",
    fontWeight: "bold",
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#b8b4b4",
  },
  err: {
    color: "red",
    fontSize: 13,
    textAlign: "center",
  },
});
