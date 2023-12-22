import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const CartItem = ({item}) => {
  return (
    <View style={styles.screen}>
      <Text>CartItem Id : {item.id}</Text>
      <Text>Qty : {item.quantity}</Text>
    </View>
  )
}

export default CartItem

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
    }
});