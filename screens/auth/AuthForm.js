import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../util/http";
import IonIcons from "@expo/vector-icons/Ionicons";
import axios from "axios";

const AuthForm = ({ navigation, route }) => {
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
    onSuccess: (data) => {
      console.log("data is:",data);
      setErrorMsg();
      navigation.navigate("catalogue-drawer");
    },
    onError: (err) => {
      console.log("err is:",err);
      setErrorMsg(err.info?.message || "Enter valid credentials!");
    },
    onSettled: ()=>{
      setUserName("");
      setPassword("");
      navigation.navigate("catalogue-drawer");
    }
  });

  if(data){
    console.log("data is:",data);
  }

  function handleLogin() {
    const formData = {
      userName: userName,
      password: password,
    };
    // console.log({...formData});

    mutate(formData);

    // fetch('http://localhost:8080/api/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData),
    //   })

//     axios.post('http://192.168.31.161/api/login', formData)
//     .then(async response => {
//       if (!response.ok) {
//         return response.json().then(errorData => {
//         if (response.status === 404) {
//         //   const errorMessage = errorData.message;
//           Alert.alert("User not found", "Enter valid username!", [{text: "ok", style: "cancel"}])
//           //console.log('Username does not exist');
//         } else if (response.status === 401) {
//           //console.log('Invalid password');
//         //   const errorMessage = errorData.message;
//           Alert.alert("Invalid password", "Enter valid password!", [{text: "ok", style: "cancel"}])
//         }
//     });
//     //console.log(response.json());
//   }
//   return response.json();
//   })
//   .then(data => {
//     //if(data.message){console.log(data.message)};
//     console.log("Login Successful!")
//     if(data && data.userName && data.password)
//     {
//         console.log("Login Successful!")
//     //   localStorage.setItem("TOKEN", "loggedIn");
//     //   localStorage.setItem("fullName", data.userName);
//     //   console.log("Logged in data is:", data);
//     //   console.log("Logged in user id is:", data.id);
//     //   console.log("Logged in account is:", data.account);
//     //   localStorage.setItem("ACCOUNT", JSON.stringify(data.account));
//     //   localStorage.setItem("USER_ID", data.id);
//     //   navigation.navigate("catalogue-drawer");
//     }
//   })
//   .catch(error => {
//     console.error('Error occurred:', error.message);
//   })
//   .finally(()=>{
//     navigation.navigate("catalogue-drawer");
//   });
// navigation.navigate("catalogue-drawer");
}

  return (
    <View style={styles.form}>
      {errorMsg && <Text style={styles.err}>{`( ${errorMsg} )`}</Text>}
      <View style={styles.inputGrp}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={handleChangeUserName}
          placeholder="Enter username"
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
        />
      </View>
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
    // justifyContent: 'center',
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
