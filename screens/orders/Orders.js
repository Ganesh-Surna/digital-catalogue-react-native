import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUser } from '../../util/auth';
import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '../../util/http';
import OrderItem from '../../components/orders/OrderItem';

const Orders = () => {
    const [data, setData] = useState([]);

    let content;

    useEffect(()=>{
        async function fetchOrdersData(){
            const user = await getUser();
            const response = await fetch(
                `http://192.168.31.161:8080/api/orders/user/${user.id}/orders`
            );
            
            if(!response.ok){
                console.error("Failed to fetch orders");
                content = <Text>Error Occured</Text>
            }else{
                const resData = await response.json();
                console.log("Orders data", resData);
                setData(resData.orderItems);
            }

            
        }

        fetchOrdersData();
    },[getUser]);

    // if(isPending){
    //     content = <Text>Loading...</Text>
    // }

    // if(isError){
    //     console.error("err is:", error)
    //     content = <Text>Error Occured</Text>
    // }

    if(data){
        console.log("orders data is: ", data);
        if(data.length > 0){
            content = <>
                <FlatList data={data} keyExtractor={(item)=>item.id} renderItem={(itemData)=><OrderItem item={itemData.item} />} />
            </>
        }else{
            content = <Text>You have no orders.</Text>
        }
    }
    
  return (
    <View>
      {content}
    </View>
  )
}

export default Orders