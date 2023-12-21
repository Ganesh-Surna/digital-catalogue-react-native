import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { queryClientObj } from './util/http';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Catalogue from './screens/catalogue/Catalogue';
import { NavigationContainer } from '@react-navigation/native';
import AuthForm from './screens/auth/AuthForm';
import {FontAwesome} from "@expo/vector-icons"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-redux';
import store from './store';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigatorFn = ()=>{
  function handleLogout(navigation){
    AsyncStorage.removeItem("ACCOUNT");
    AsyncStorage.removeItem("USER_ID");
    AsyncStorage.removeItem("TOKEN");
    AsyncStorage.removeItem("FULL_NAME");
    AsyncStorage.removeItem("USER_NAME");
    navigation.navigate("auth");
  }
  return <>
    <Drawer.Navigator screenOptions={({navigation, route})=>({
      headerRight: ()=>(<View style={{marginRight: 20}}>
        <Button title='Log out' onPress={()=>handleLogout(navigation)} />
      </View>),
      headerTitleAlign: "left",
      headerStyle: {backgroundColor: "#eccaca"},
    })}>
      <Drawer.Screen name="catalogue" component={Catalogue} options={{
        title: "Catalogue",
        drawerLabel: "Catalogue",
        drawerIcon: ({size, color,focused})=><FontAwesome name="diamond" color={color} size={size}/>,
      }} />
    </Drawer.Navigator>
  </>
}

export default function App() {
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
