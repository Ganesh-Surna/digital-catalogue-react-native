import { View, Text, Button, Image, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { uiActions } from '../../store/ui-slice';
import { useDispatch } from 'react-redux';
import CarouselCards from './carousel/CarouselCards';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import Ionicons from "@expo/vector-icons/Ionicons"

const CatalogueDetails = ({item, setDesignItem}) => {
    const dispatch = useDispatch();

    function handleGoBack(){
        setDesignItem();
        dispatch(uiActions.closeCatalogueDesignDetails());
    }

  return (
    <ScrollView>
    <View style={styles.screen}>
        <View style={styles.backBtn}>
            <Button title='Back' onPress={handleGoBack}/>
        </View>
        <Text style={styles.heading}>Design {item.id}</Text>
        <CarouselCards data={item.designImages}/>
        <View style={styles.actions}>
            <View style={styles.actionBtn}>
                <Button title='Add to cart' color="#fdab31" />
            </View>
            <View style={styles.actionBtn}>
                <Button title='Order now' color="brown" />
            </View>
        </View>
        <View style={styles.infoContainer}>
            <View style={styles.info}>
                <FontAwesome name="diamond" size={15} />
                <Text style={styles.infoText}>Purity Guaranteed.</Text>
            </View>
            <View style={styles.info}>
                <FontAwesome name="exchange" size={15} />
                <Text style={styles.infoText}>Exchange across all stores.</Text>
            </View>
            <View style={styles.info}>
                <FontAwesome5 name="shipping-fast" size={15} />
                <Text style={styles.infoText}>Free Shipping all across India.</Text>
            </View>
        </View>
        <View style={styles.productDetailsContainer}>
            <Text style={styles.productDetailsHead}>Product Details</Text>
            <Text style={styles.highlight}>Category : <Text style={styles.normalText}>{item.category}</Text></Text>
            <Text style={styles.highlight}>Gross Wt : <Text style={styles.normalText}>{item.grossWeight}</Text></Text>
            <Text style={styles.highlight}>Style : <Text style={styles.normalText}>{item.style}</Text></Text>
            <Text style={styles.highlight}>Model : <Text style={styles.normalText}>{item.model}</Text></Text>
            <Text style={styles.highlight}>Size : <Text style={styles.normalText}>{item.size}</Text></Text>
        </View>
    </View>
    </ScrollView>
  )
}

export default CatalogueDetails

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    heading: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    },
    backBtn: {
        width: 100,
        margin: 8,
        marginLeft: 15,
        // alignSelf: 'center',
    },
    actions: {
        flexDirection: "row",
        gap: 20,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 20,
        marginVertical: 8,
    },
    actionBtn: {
        flex: 1,
    },
    productDetailsContainer: {
        marginHorizontal: 20,
        marginVertical: 8,
        borderTopWidth: 1,
        borderColor: "#ccc",
    },
    productDetailsHead: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        paddingVertical: 10,
    },
    highlight: {
        fontWeight: 'bold',
        fontSize: 15,
        paddingVertical: 4,
    },
    normalText: {
        fontSize: 15,
        color: "#555353",
    },
    infoContainer: {
        marginHorizontal: 20,
        marginVertical: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderColor: "#ccc",
        gap: 4,
    },
    info : {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
    infoText:{
        fontSize: 15,
    },
})