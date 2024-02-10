import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { getUser } from "../../util/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteOrder,
  fetchOrders,
  queryClientObj,
  updateOrder,
} from "../../util/http";
import OrderItem from "../../components/orders/OrderItem";
import Order from "../../components/orders/Order";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import { AntDesign} from '@expo/vector-icons';

const Orders = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  // const [data, setData] = useState([]);
  const [user, setUser] = useState(null);

  const [viewOrder, setViewOrder] = useState();

  // const navigation= useNavigation();
  const dispatch = useDispatch();
  const isViewOrderItemsOpen = useSelector(
    (state) => state.ui.isViewOrderItemsOpen
  );

  useEffect(() => {
    getUser()
      .then((response) => {
        //   console.log("resonse:", response);
        //   console.log("parsed response:", typeof response)
        setUser(response);
      })
      .catch((error) => {
        console.log("error:", error);
      });
  }, [getUser]);

  let content;

  const [data, setData] = useState();

  const {
    data: ordersData,
    isPending,
    isError,
    error,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["orders", { userId: user ? user.id : null }],
    queryFn: ({ signal }) =>
      user ? fetchOrders({ signal, userId: user ? user.id : null }) : {},
  });

  useEffect(() => {
    if (ordersData) {
      setData(ordersData);
    }
  }, [ordersData]);

  // useEffect(()=>{
  //     async function fetchOrdersData(){
  //         const user = await getUser();
  //         const response = await fetch(
  //             `http://192.168.31.161:8080/api/orders/user/${user.id}/orders`
  //         );

  //         if(!response.ok){
  //             console.error("Failed to fetch orders");
  //             content = <Text>Error Occured</Text>
  //         }else{
  //             const resData = await response.json();
  //             console.log("Orders data", resData);
  //             setData(resData);
  //         }
  //     }
  //     fetchOrdersData();
  // },[getUser]);

  function handleOrders(item) {
    setViewOrder(item);
    dispatch(uiActions.openViewOrderItems());
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: viewOrder ? `Designs of OrderId : ${viewOrder.id}` : "Orders",
    });
  }, [navigation, viewOrder]);

  function renderItemFn(item) {
    //console.log("test-----",item.orderItems)
    return (
      <Pressable
        android_ripple={{ color: "#f3f3f3" }}
        style={({ pressed }) => [
          styles.container,
          pressed && styles.pressDesign,
          { width: width > height ? "22.35%" : "44.5%" },
        ]}
        onPress={() => handleOrders(item)}
      >
        <Text
          style={{
            textAlign: 'left',
            fontSize: 20,
            color: "rgb(163, 4, 137)",
            fontWeight: 600,
          }}
        >
          Order {item.id}
        </Text>
        <View style={styles.attendeesContainer}>
          {item.orderItems.map((order) => (
            <Image key={order.id} source={{ uri: order.design.designImages[0]?.preSignedURL }} style={styles.attendeeImage} />
          ))}
          {/*  order.design.designImages? item.design.designImages[0].preSignedURL : null
          'https://cdn.pixabay.com/photo/2017/06/02/12/04/chain-2366132_1280.jpg'*/ }
        </View>
        
        <AntDesign name="arrowright" style={[styles.arrow]} size={25} />
      </Pressable>
    );
  }

  if (viewOrder && isViewOrderItemsOpen) {
    return (
      <Order
        setViewOrder={setViewOrder}
        order={viewOrder}
      />
    );
  }

  if (isPending) {
    content = <Text>Loading...</Text>;
  }

  if (isError) {
    console.error("err is:", error);
    content = <Text>Error Occured</Text>;
  }

  if (data) {
    console.log("orders data is: ", data);
    if (data.length > 0) {
      content = (
        <>
          <FlatList
            key={width > height}
            numColumns={width > height ? 4 : 2}
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => renderItemFn(itemData.item)}
          />
        </>
      );
    } else {
      content = <Text style={{textAlign: "center"}}>You have no orders.</Text>;
    }
  }

  return (
    <View key={data} style={styles.screen}>
      {content}
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    // alignItems: "center",
    width: "100%",
  },
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#a8edd4",
    padding: 10,
    borderLeftWidth: 5,
    borderLeftColor: 'rgb(163, 4, 137)',
    // marginBottom: 10,
    // flex: 1,
    width: "44.5%",
    // minWidth: "90%",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 150,
    elevation: 4,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 4,
    shadowOpacity: 0.25,
    borderRadius: 8,
  },
  pressDesign: {
    opacity: 0.75,
  },
  attendeesContainer: {
    flexWrap:'wrap',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 10
  },
  attendeeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: -10,
    borderWidth:0.5,
    marginTop:3,
  },
  arrow:{
    height: 40,
    width: 40,
    marginTop:10,
    color:'rgb(163, 4, 137)'
  }
});
