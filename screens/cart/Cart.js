import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchCart } from '../../util/http'
import { getAccountLoader, getUser } from '../../util/auth'
import { FlatList } from 'react-native-gesture-handler'
import CartItem from '../../components/cart/CartItem'

const Cart = () => {
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
    //             `http://192.168.31.161:8080/api/carts/user/${user.id}/cart`
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

    console.log(data)

        if( data && data.cartItems?.length > 0){
            const cartId = data.id;
            console.log("cartId: ", cartId)
            content = <>
                <FlatList data={data.cartItems} keyExtractor={(item)=>item.id} renderItem={(itemData)=><CartItem item={itemData.item} cartId={data.id} />} />
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
    },
});