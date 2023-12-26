import { View, Text, FlatList } from 'react-native'
import React from 'react'
import OrderItem from './OrderItem'

const Order = ({order}) => {
  return (
    <View>
      <Text style={{textAlign: "center"}}>Order Id:  {order.id}</Text>
      <FlatList data={order.orderItems} keyExtractor={(item)=>item.id} renderItem={(itemData)=><OrderItem item={itemData.item} orderId={order.id} />} />
    </View>
  )
}

export default Order