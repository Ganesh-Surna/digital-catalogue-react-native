import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { deleteOrder, queryClientObj, updateOrder } from '../../util/http';
import { AntDesign, Ionicons} from "@expo/vector-icons"

const OrderItem = ({item, orderId}) => {

    const {mutate, isError, isPending, error} = useMutation({
        mutationFn: deleteOrder,
        onSuccess: ()=>{
            queryClientObj.invalidateQueries({
                queryKey: ["orders"]
            })
        },
        onError: (errData)=>{
            setIsErrModalOpen(true);
            setErr(errData);
        }
    })

    const {mutate: updateMutate, isError: updateIsError, isPending: updateIsPending, error: updateError} = useMutation({
        mutationFn: updateOrder,
        onSuccess: ()=>{
            queryClientObj.invalidateQueries({
                queryKey: ["orders"]
            })
        },
        onError: (errData)=>{
            setIsErrModalOpen(true);
            setErr(errData);
        }
    })

    function handleMinus(){
        const updatedQuantity = item.quantity - 1;
        updateMutate({orderId, orderItemId: item.id, data: {designId: item.design.id, quantity: updatedQuantity}})
    }

    function handlePlus() {
        const updatedQuantity = item.quantity + 1;
        updateMutate({orderId, orderItemId: item.id, data: {designId: item.design.id, quantity: updatedQuantity}})
    }

    function handleDeleteOrderItem(){
        mutate({orderId, orderItemId: item.id});
    }

    return (
        <View style={styles.screen}>
      <View style={styles.cartItem}>

      <Image source={{ uri: item.design.designImages[0] ? item.design.designImages[0].preSignedURL : null  }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>Design {item.design.id}</Text>
        <Text style={styles.price}>₹30,499.00</Text>
      </View>
      
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

      <Pressable android_ripple={{color: "rgb(168, 165, 165)"}} onPress={handleDeleteOrderItem}>
        <AntDesign name="delete" size={25} color="rgb(143, 5, 5)"/>
      </Pressable>
      </View>
    </View>
    )
}

export default OrderItem

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#a8edd4',
        padding: 10,
        marginBottom: 10,
      },
      productImage: {
        width: 80,
        height: 80,
        marginRight: 10,
      },
      productInfo: {
        marginRight: 50
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