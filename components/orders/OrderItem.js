import { View, Text, StyleSheet, Image, Pressable, useWindowDimensions, Alert } from 'react-native'
import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { deleteOrder, queryClientObj, updateOrder } from '../../util/http';
import { AntDesign, Ionicons, EvilIcons} from "@expo/vector-icons"
import { useNavigation } from '@react-navigation/native';

const OrderItem = ({item, orderId, order, setRefresh, ordersData, setViewOrder}) => {
  const {width, height} =useWindowDimensions();
  const navigation = useNavigation();

    const {mutate, isError, isPending, error} = useMutation({
        mutationFn: deleteOrder,
        onSuccess: ()=>{
          console.log("order delete started");
            queryClientObj.invalidateQueries({
                queryKey: ["orders"]
            });
            console.log("order delete ended");
            setRefresh(prev=>prev+1);
        },
        onError: (errData)=>{
          Alert.alert("Failed to delete order", `${errData.errorMessage}`, [{text: "Okay", style: "cancel"}]);
        }
    })

    const {mutate: updateMutate, isError: updateIsError, isPending: updateIsPending, error: updateError} = useMutation({
        mutationFn: updateOrder,
        onSuccess: ()=>{
          console.log("order update started");
          queryClientObj.invalidateQueries({
              queryKey: ["orders"]
          });
          console.log("order update ended");
        },
        onError: (errData)=>{
            Alert.alert("Failed to update order", `${errData.errorMessage}`, [{text: "Okay", style: "cancel"}]);
        }
    })

    function handleMinus(){
        const updatedQuantity = item.quantity - 1;
        updateMutate({orderId, orderItemId: item.id, data: {designId: item.design.id, quantity: updatedQuantity}})
        setRefresh(prev=>prev+1);
        // setViewOrder();
        // setViewOrder(order);
    }

    function handlePlus() {
        const updatedQuantity = item.quantity + 1;
        updateMutate({orderId, orderItemId: item.id, data: {designId: item.design.id, quantity: updatedQuantity}})
        setRefresh(prev=>prev+1);
        // setViewOrder();
        // setViewOrder(order);
    }

    function handleDeleteOrderItem(){
        mutate({orderId, orderItemId: item.id});
        setRefresh(prev=>!prev)
        if(ordersData.length ===1 && ordersData[0].orderItems.length === 1){
          setViewOrder();
        }
        // setViewOrder();
        // setViewOrder(order);
    }

    return (
      <View style={[styles.cartItem, {width: width > height ? "auto" : "98%", marginHorizontal: width > height ? 10 : 0,}]}>

        <Image source={{ uri: item.design.designImages[0] ? item.design.designImages[0].preSignedURL : null  }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>Design {item.design.id}</Text>
          <Text style={styles.price}>₹30,499.00</Text>
        </View>
        
        <View style={styles.actionsAndQty}>
          <View>
            <Pressable android_ripple={{color: "rgb(168, 165, 165)"}} onPress={item.quantity === 1 ? handleDeleteOrderItem : handleMinus}>
              <Ionicons name="ios-remove-circle-outline" size={24} color="black" />
            </Pressable>
          </View>
          <View>
            <Text style={styles.quantity}>x {item.quantity}</Text>
          </View>
          <View style={{marginRight: 50}}>
            <Pressable android_ripple={{color: "rgb(168, 165, 165)"}} onPress={handlePlus}>
              <Ionicons name="add-circle-outline" size={24} color="black" />
            </Pressable>
          </View>
        </View>

        <Pressable android_ripple={{color: "rgb(168, 165, 165)"}} onPress={handleDeleteOrderItem}>
          <EvilIcons name="trash" size={35} color="rgb(143, 5, 5)"/>
        </Pressable>
      </View>
    )
}

export default OrderItem

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        //padding: 10,
        width: '100%'
    },
    cartItem: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      borderRadius: 8,
      backgroundColor: '#bef1fd',
      padding: 10,
      marginBottom: 10,
      elevation: 4,
      shadowColor: "black",
      shadowOffset: {width: 1, height: 1},
      shadowRadius: 4,
      shadowOpacity: 0.25,
      borderRadius: 8,
      width: "98%",
      alignSelf: "center",
      marginHorizontal: 10,
      justifyContent: "space-between",
      },
      actionsAndQty: {
        flexDirection: 'row',
        gap: 5,
      },
      productImage: {
        width: 80,
        height: 80,
        //marginRight: 10,
      },
      productInfo: {
        marginRight: 36
      },
      productName: {
        fontSize: 18,
        fontWeight: '500',
        color: 'rgb(163, 4, 137)'
      },
      productDescription: {
        color: '#777',
      },
      quantity: {
        paddingVertical: 2,
        paddingHorizontal:4,
        fontSize: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ccc',
        backgroundColor: 'rgb(240, 238, 236)',
        fontWeight: '600'
      },
      price: {
        fontWeight: 'bold',
        color: 'green',
      },
      
});