import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchCart } from '../../util/http'
import { getAccountLoader, getUser } from '../../util/auth'
import { FlatList } from 'react-native-gesture-handler'
import CartItem from '../../components/cart/CartItem'

const Cart = () => {
    // const [user, setUser] = useState(null);

    // useEffect(()=>{
    //     getUser()
    //     .then((response)=>{
    //     //   console.log("resonse:", response);
    //     //   console.log("parsed response:", typeof response)
    //     setUser(response);
    //     })
    //     .catch((error)=>{
    //       console.log("error:", error);
    //     });
    // },[getUser]);
 
    // const {data, isPending, isError, error} = useQuery({
    //     queryKey: ["cart", {userId: user ? user.id : null}],
    //     queryFn : async({signal})=>{
    //         // const user = await getUser();
    //         fetchCart({signal, userId: user.id})
    //     },
    // })
    let content;
    const [data, setData] = useState([]);

    useEffect(()=>{
        async function fetchCartData(){
            const user = await getUser();
            // const account = await getAccountLoader();
            const response = await fetch(
                `http://192.168.31.161:8080/api/carts/user/${user.id}/cart`
            );

            if(!response.ok){
                content = <Text>Error Occured</Text>
            }else{
                const resData = await response.json();
                setData(resData.cartItems);
            }
        }

        fetchCartData();
    },[getUser])

        if(data.length > 0){
            content = <>
                <FlatList data={data} keyExtractor={(item)=>item.id} renderItem={(itemData)=><CartItem item={itemData.item} />} />
            </>
        }
    
  return (
    <View>
      {content}
    </View>
  )
}

export default Cart