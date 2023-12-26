import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { queryClientObj } from './util/http';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import Catalogue from './screens/catalogue/Catalogue';
import { NavigationContainer } from '@react-navigation/native';
import AuthForm from './screens/auth/AuthForm';
import {FontAwesome} from "@expo/vector-icons"
import {FontAwesome5} from "@expo/vector-icons"
import {Feather} from "@expo/vector-icons"
import {AntDesign} from "@expo/vector-icons"
import {Ionicons} from "@expo/vector-icons"
import {Entypo} from "@expo/vector-icons"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider, useDispatch } from 'react-redux';
import store from './store';
import { useEffect, useState } from 'react';
import { getAccountLoader } from './util/auth';
import { uiActions } from './store/ui-slice';
import UserInfo from './screens/user/UserInfo';
import Cart from './screens/cart/Cart';
import Orders from './screens/orders/Orders';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const dispatch = useDispatch();

  function handleLogout(){
    dispatch(uiActions.closeCatalogueDesignDetails());
    AsyncStorage.removeItem("ACCOUNT");
    AsyncStorage.removeItem("USER");
    AsyncStorage.removeItem("TOKEN");
    AsyncStorage.removeItem("FULL_NAME");
    AsyncStorage.removeItem("USER_NAME");
    props.navigation.navigate("auth");
  }
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
        icon={({size, color,focused})=><AntDesign name="logout" color={color} size={size}/>}
        // inactiveTintColor='white'
        // inactiveBackgroundColor='#fa5050'
      />
    </DrawerContentScrollView>
  );
}

const DrawerNavigatorFn = ()=>{
  function handleLogout(navigation){
    dispatch(uiActions.closeCatalogueDesignDetails());
    AsyncStorage.removeItem("ACCOUNT");
    AsyncStorage.removeItem("USER");
    AsyncStorage.removeItem("TOKEN");
    AsyncStorage.removeItem("FULL_NAME");
    AsyncStorage.removeItem("USER_NAME");
    navigation.navigate("auth");
  }
  return <>
    <Drawer.Navigator drawerContent={CustomDrawerContent} screenOptions={({navigation, route})=>({
      headerRight: ()=>(<View style={{marginRight: 20, gap: 12, flexDirection: "row", alignItems: "center"}}>
        <Pressable android_ripple={{color: "rgb(168, 165, 165)"}} onPress={()=>navigation.navigate("cart")}>
          <Feather name="shopping-cart" size={25} color="rgb(143, 5, 5)" />
        </Pressable>
        <Pressable android_ripple={{color: "rgb(168, 165, 165)"}} onPress={()=>navigation.navigate("user-info")}>
          <FontAwesome5 name="user-circle" size={25} color="rgb(143, 5, 5)" />
        </Pressable>
      </View>),
      headerTitleAlign: "left",
      headerStyle: {backgroundColor: "#eccaca"},
    })}>
      <Drawer.Screen name="catalogue" component={Catalogue} options={{
        title: "Catalogue",
        drawerLabel: "Catalogue",
        unmountOnBlur: true,
        drawerIcon: ({size, color,focused})=><FontAwesome name="diamond" color={color} size={size}/>,
      }} />
      <Drawer.Screen name="user-info" component={UserInfo} options={{
        title: "User Info",
        drawerLabel: "User Info",
        drawerIcon: ({size, color,focused})=><FontAwesome5 name="user-circle" size={size} color={color} />,
      }} />
      <Drawer.Screen name="cart" component={Cart} options={{
        title: "Cart",
        drawerLabel: "Cart",
        drawerIcon: ({size, color,focused})=><Feather name="shopping-cart" size={size} color={color} />,
      }} />
      <Drawer.Screen name="orders" component={Orders} options={{
        title: "Orders",
        drawerLabel: "Orders",
        drawerIcon: ({size, color,focused})=><Entypo name="shopping-bag" size={size} color={color} />,
      }} />
    </Drawer.Navigator>
  </>
}

export default function App() {

  const [account, setAccount] = useState(null);


  return (
    <>
      <StatusBar style="auto" />
      <Provider store={store}>
        <QueryClientProvider client={queryClientObj}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{
              headerTitleAlign: "center",
              headerStyle: {backgroundColor: "#eccaca"}
            }}>
              <Stack.Screen name="auth" component={AuthForm} options={{
                title: "Login",
              }} />
              <Stack.Screen name="catalogue-drawer" component={DrawerNavigatorFn} options={{
                headerShown: false,
              }} />
            </Stack.Navigator>
          </NavigationContainer>
        </QueryClientProvider>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
