import React from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from "react-native"

export const SLIDER_WIDTH = Dimensions.get('window').width + 0
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9)

const CarouselCardItem = ({ item, index }) => {
  return (
    <View style={styles.container} key={item.preSignedURL}>
      <Image
        source={{ uri: item.preSignedURL }}
        style={styles.image}
      />
      <Text style={styles.body}>Image {index+1}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: ITEM_WIDTH,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    marginVertical: 10,
    overflow: "hidden",
  },
  image: {
    width: ITEM_WIDTH,
    height: 200,
    objectFit: "fill",
  },
  header: {
    color: "#222",
    fontSize: 28,
    fontWeight: "bold",
    paddingTop: 10,
    textAlign: "center",
  },
  body: {
    textAlign: "center",
    color: "#222",
    fontSize: 18,
    paddingTop: 10,
  }
})

export default CarouselCardItem