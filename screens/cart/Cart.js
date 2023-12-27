import { View, Text, StyleSheet, useWindowDimensions, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchCart, postOrder, queryClientObj } from '../../util/http'
import { getAccountLoader, getUser } from '../../util/auth'
import { FlatList } from 'react-native-gesture-handler'
import CartItem from '../../components/cart/CartItem'

const Cart = ({navigation}) => {
  const {width, height} = useWindowDimensions();
    const [user, setUser] = useState(null);
    

    useEffect(()=>{
        getUser()
        .then((response)=>{
        //   console.log("resonse:", response);
        //   console.log("parsed response:", typeof response)
        setUser(response);
        })
        .catch((error)=>{
          console.log("error:", error);
        });
    },[getUser]);
 
    const {data, isPending, isError, error} = useQuery({
        queryKey: ["cart", {userId: user ? user.id : null}],
        queryFn : ({signal})=> user ? fetchCart({signal, userId: user.id}) : {},
    })
    let content;
    // const [data, setData] = useState([]);

    // useEffect(()=>{
    //     async function fetchCartData(){
    //         const user = await getUser();
    //         // const account = await getAccountLoader();
    //         const response = await fetch(
    //             http://192.168.31.161:8080/api/carts/user/${user.id}/cart
    //         );

    //         if(!response.ok){
    //             content = <Text>Error Occured</Text>
    //         }else{
    //             const resData = await response.json();
    //             setData(resData);
    //         }
    //     }

    //     fetchCartData();
    // },[getUser])

    const {mutate: orderMutate, isPending: orderIsPendign, isError: orderIsError, error: orderError} = useMutation({
        mutationFn: postOrder,
        onSuccess: ()=>{
            queryClientObj.invalidateQueries({
                queryKey: ["orders"],
            })
            queryClientObj.invalidateQueries({
                queryKey: ["cart"],
            })
            // navigation.navigate("orders");
        },
        onError: (errData)=>{
          Alert.alert("Failed to order", `${errData.errorMessage}`, [{text: "Okay", style: "cancel"}]);
      }
    })

    async function handleOrder(){
      const account = await getAccountLoader();
      const userObj = await getUser();
        const mappedList = data.cartItems.map(item => ({designId: item.design.id, quantity: item.quantity}));

        console.log("mappedList of ordering cart items", mappedList);
        orderMutate({ userId: userObj.id, accountId: account.id, orderItems: [...mappedList], cartId: data.id });
    }


    console.log(data)

        if( data && data.cartItems?.length > 0){
            const cartId = data.id;
            console.log("cartId: ", cartId)
            content = <>
                <View style={styles.backBtn}>
                  <Button title='Order Now' onPress={handleOrder}/>
                </View>
                <FlatList key={width>height} numColumns={width>height ? 2 : 1} data={data.cartItems} keyExtractor={(item)=>item.id} renderItem={(itemData)=><CartItem item={itemData.item} cartId={data.id} />} />
            </>
        }
        else{
            content = <Text style={{textAlign: "center"}}>Your cart is empty!</Text>
        }
    
  return (
    <View style={styles.screen}>
      {content}
    </View>
  )
}

export default Cart

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      padding: 10,
      alignItems: 'center',
      alignSelf: 'center',
    },
    backBtn: {
      width: 100,
      margin: 8,
      marginLeft: 15,
      alignSelf: 'flex-end'
    }
});