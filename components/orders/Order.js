import {
  View,
  FlatList,
  StyleSheet,
  Button,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import OrderItem from "./OrderItem";
import { useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import { fetchOrders } from "../../util/http";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../util/auth";

const Order = ({ order, setViewOrder }) => {
  const { width, height } = useWindowDimensions();

  const [user, setUser] = useState(null);

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

  const [refresh, setRefresh] = useState(0);

  const {data: ordersData, isPending, isError, error,} = useQuery({
    queryKey: ["orders", {userId: user ? user.id : null}],
    queryFn : ({signal})=> user ? fetchOrders({signal, userId: user ? user.id : null}) : {},
  })

  useEffect(()=>{
    if(ordersData){
      if(ordersData.length > 0){
        const refreshOrder = ordersData.find(eachOrder => eachOrder.id === order.id);
        if(refreshOrder){
          setViewOrder(refreshOrder);
        }
        else{
          setViewOrder();
        }
      }
    }
  },[refresh,ordersData])

  const dispatch = useDispatch();

  function handleGoBack() {
    setViewOrder();
    dispatch(uiActions.closeViewOrderItems());
  }

  return (
    <View style={styles.screen}>
      <View style={styles.backBtn}>
        <Button title="Back" onPress={handleGoBack} />
      </View>
      <View style={{ alignItems: "center", width: "100%", flex: 1 }}>
        <FlatList
          key={width > height}
          numColumns={width > height ? 2 : 1}
          data={order.orderItems}
          keyExtractor={(item) => item.id}
          renderItem={(itemData) => (
            <OrderItem
              ordersData={ordersData}
              item={itemData.item}
              orderId={order.id}
              order={order}
              setRefresh={setRefresh}
              setViewOrder={setViewOrder}
            />
          )}
        />
      </View>
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    padding: 10,
  },
  cartItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#a8edd4",
    padding: 10,
    marginBottom: 10,
  },
  backBtn: {
    width: 100,
    margin: 8,
    marginLeft: 15,
  },
});
