import { View, Text , FlatList, StyleSheet} from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUser } from '../../util/auth';
import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '../../util/http';
import OrderItem from '../../components/orders/OrderItem';
import Order from '../../components/orders/Order';

const Orders = () => {
    // const [data, setData] = useState([]);
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

    let content;

    const {data, isPending, isError, error} = useQuery({
        queryKey: ["orders", {userId: user ? user.id : null}],
        queryFn : ({signal})=> user ? fetchOrders({signal, userId: user ? user.id : null}) : {},
    })

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





    if(isPending){
        content = <Text>Loading...</Text>
    }

    if(isError){
        console.error("err is:", error)
        content = <Text>Error Occured</Text>
    }

    if(data){
        console.log("orders data is: ", data);
        if(data.length > 0){
            content = <>
                <FlatList data={data} keyExtractor={(item)=>item.id} renderItem={(itemData)=><Order order={itemData.item} />} />
            </>
        }else{
            content = <Text>You have no orders.</Text>
        }
    }
    
  return (
    <View style={styles.screen}>
      {content}
    </View>
  )
}

export default Orders

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      padding: 6,
      alignItems: 'center',
    },
});