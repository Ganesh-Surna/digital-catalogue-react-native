import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const OrderItem = ({item}) => {
    return (
        <View style={styles.screen}>
          <Text>orderItem Id : {item.id}</Text>
          <Text>Qty : {item.quantity}</Text>
        </View>
    )
}

export default OrderItem

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
    }
});