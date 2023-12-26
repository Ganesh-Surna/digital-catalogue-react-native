import { View, Text, StyleSheet, Image, Pressable, useWindowDimensions} from 'react-native'
import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { deleteCart, queryClientObj, updateCart } from '../../util/http'
import { EvilIcons, Ionicons} from "@expo/vector-icons"

const CartItem = ({item, cartId}) => {
  const {width, height} = useWindowDimensions();

  const {mutate, isError, isPending, error} = useMutation({
    mutationFn: deleteCart,
    onSuccess: ()=>{
        queryClientObj.invalidateQueries({
            queryKey: ["cart"]
        })
    },
    onError: (errData)=>{
        console.error("deleteCart error: ", errData.message);
    }
})

const {mutate: updateMutate, isError: updateIsError, isPending: updateIsPending, error: updateError} = useMutation({
    mutationFn: updateCart,
    onSuccess: ()=>{
        queryClientObj.invalidateQueries({
            queryKey: ["cart"]
        })
    },
    onError: (errData)=>{
        console.error("update cart error: ", errData.message)
    }
})

function handleMinus(){
  const updatedQuantity = item.quantity - 1;
  // console.log(item.quantity)
  // console.log(typeof item.quantity);
  // console.log(updatedQuantity)
  // console.log(typeof updatedQuantity);
  // console.log({cartId, cartItemId: item.id, data: {designId: item.design.id, quantity: updatedQuantity}});
  updateMutate({cartId, cartItemId: item.id, data: {designId: item.design.id, quantity: updatedQuantity}})
}

function handlePlus() {
  const updatedQuantity = item.quantity + 1;
  // console.log(item.quantity)
  // console.log(typeof item.quantity);
  // console.log(updatedQuantity)
  // console.log(typeof updatedQuantity);
  // console.log({cartId, cartItemId: item.id, data: {designId: item.design.id, quantity: updatedQuantity}});
  updateMutate({cartId, cartItemId: item.id, data: {designId: item.design.id, quantity: updatedQuantity}})
}

function handleRemoveWholeItemFromCart(){
  mutate({cartId, cartItemId: item.id})
}

  return (
    // <View style={styles.screen}>
    <View style={[styles.cartItem,{width: width > height ? "auto" : "100%", marginHorizontal: width > height ? 10 : 0,}]}>

      <Image source={{ uri: item.design.designImages[0] ? item.design.designImages[0].preSignedURL : null }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>Design {item.design.id}</Text>
        <Text style={styles.price}>₹30,499.00</Text>
      </View>
      
      <View style={styles.actionsAndQty}>
        <View>
          <Pressable android_ripple={{color: "rgb(168, 165, 165)"}} onPress={item.quantity === 1 ? handleRemoveWholeItemFromCart : handleMinus}>
            <Ionicons name="ios-remove-circle-outline" size={24} color="black" />
          </Pressable>
        </View>
        <View>
          <Text style={styles.quantity}>x {item.quantity}</Text>
        </View>
        <View style={{marginRight: 20}}>
          <Pressable android_ripple={{color: "rgb(168, 165, 165)"}} onPress={handlePlus}>
            <Ionicons name="add-circle-outline" size={24} color="black" />
          </Pressable>
        </View>
      </View>

      <Pressable android_ripple={{color: "rgb(168, 165, 165)"}} onPress={handleRemoveWholeItemFromCart}>
        <EvilIcons name="trash" size={35} color="rgb(143, 5, 5)"/>
      </Pressable>
    </View>
    // </View>
  )
}

export default CartItem

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        // padding: 10,
        width: "100%",
    },
    cartItem: {
      // flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      borderRadius: 8,
      backgroundColor: '#bef1fd',
      padding: 10,
      marginBottom: 10,
      elevation: 4,
      width: "100%",
      justifyContent: "space-between",
    },
    actionsAndQty: {
      flexDirection: 'row',
      gap: 5,
    },
    productImage: {
      width: 80,
      height: 80,
      // marginRight: 10,
    },
    productInfo: {
      marginRight: 50,
    },
    productName: {
      fontSize: 20,
      fontWeight: '600',
      color: 'rgb(163, 4, 137)'
    },
    productDescription: {
      color: '#777',
    },
    quantity: {
      paddingVertical: 4,
      paddingHorizontal:8,
      fontSize: 18,
      borderRadius: 4,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#dd0000',
      backgroundColor: 'rgb(57, 242, 255)',
      fontWeight: '600'
    },
    price: {
      fontWeight: 'bold',
      color: 'green',
    },
    removeButton: {
      // marginLeft: 'auto',
      // padding: 5,
    },
    removeButtonText: {
      color: '#e62e00',
    },
});