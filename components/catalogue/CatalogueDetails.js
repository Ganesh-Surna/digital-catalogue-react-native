import { View, Text, Button, Image, StyleSheet, ScrollView, TextInput, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { uiActions } from '../../store/ui-slice';
import { useDispatch } from 'react-redux';
import CarouselCards from './carousel/CarouselCards';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchCart, fetchOrders, postCart, postOrder, queryClientObj } from '../../util/http';
import { getAccountLoader, getUser } from '../../util/auth';

const CatalogueDetails = ({item, setDesignItem}) => {
    const dispatch = useDispatch();
    const navigation = useNavigation()

    const [qty, setQty] = useState("1");

    const [user, setUser] = useState(null);
    const [account, setAccount] = useState(null); 

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

    useEffect(()=>{
        getAccountLoader()
        .then((response)=>{
          // console.log("resonse:", response);
          // console.log("parsed response:", typeof response)
          setAccount(response);
        })
        .catch((error)=>{
          console.log("error:", error);
        });
      },[getAccountLoader]);
    
    const {data, isPending, isError, error} = useQuery({
        queryKey: ["orders", {userId: user ? user.id : null}],
        queryFn : ({signal})=> user ? fetchOrders({signal, userId: user ? user.id : null}) : {},
    })

    console.log("orders data in catalogueDetails:", data);

    function handleChangeQty(inputText) {
        setQty(inputText);
    }
            
    // const [data, setData] = useState([]);

    // useEffect(()=>{
    //     async function fetchOrdersData(){
    //         const user = await getUser();
    //         const response = await fetch(
    //             `http://192.168.1.35:8080/api/orders/user/${user.id}/orders`
    //         );
            
    //         if(!response.ok){
    //             console.error("Failed to fetch orders");
    //         }else{
    //             const resData = await response.json();
    //             setData(resData.orderItems);
    //         }
    //     }

    //     fetchOrdersData();
    // },[getUser]);

    let isDesignExistInOrders ;

    if(data){
        if(data.length > 0){
            isDesignExistInOrders = data.findIndex((order)=>{
                const isExist = order.orderItems.findIndex((orderItem)=>orderItem.design.id ===item.id ) >= 0;
                return isExist;
              }) >= 0;
        }
        else{
            isDesignExistInOrders = false;
        }
    }

    const {mutate: mutateCart, isPending: addToCartIsPending} = useMutation({
        mutationFn: postCart,
        onSuccess: ()=>{
          queryClientObj.invalidateQueries({
            queryKey: ["cart"],
          })
        },
        onError: (err)=>{
          Alert.alert("Failed to add to cart!", `${err.errorMessage}`, [{text: "OK", style: "cancel"}])
        }
    })

    const {mutate: orderMutate, isPending: orderNowIsPending} = useMutation({
        mutationFn: postOrder,
        onSuccess: ()=>{
          queryClientObj.invalidateQueries({
            queryKey: ["orders"],
          })
        },
        onError: (err)=>{
            Alert.alert("Failed to order!", `${err.errorMessage}`, [{text: "OK", style: "cancel"}])
        }
      })
    
    async function handleOrderNow(){
        const user =await getUser();
        const account =await getAccountLoader();
    
        orderMutate({ userId: user.id, accountId: account.id, orderItems: [{designId: item.id, quantity: +qty }]});
    }

    function handleGoBack(){
        setDesignItem();
        dispatch(uiActions.closeCatalogueDesignDetails());
    }

    async function handleAddToCart(){
        const user = await getUser();
        const account = await getAccountLoader();
        mutateCart({userId: user.id, accountId: account.id, cartItems: [{designId: item.id, quantity: +qty}]});
    }

    const isInvalidQty = qty.trim().length === 0 || +qty === 0;

    let orderNowBtnTitle = "Order Now";

    if(orderNowIsPending){
        orderNowBtnTitle = "Ordering...";
    }
    if(isDesignExistInOrders){
        orderNowBtnTitle = "Ordered";
    }

  return (
    <ScrollView>
    <View style={styles.screen}>
        <View style={styles.backBtn}>
            <Button title='Back' onPress={handleGoBack}/>
        </View>
        {/* <Text style={styles.heading}>Design {item.id}</Text> */}
        <View style={styles.imageContainer}>
            <CarouselCards data={item.designImages}/>
        </View>
        <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity : </Text>
            <TextInput keyboardType="number-pad" value={qty} onChangeText={handleChangeQty} style={styles.quantityInput} />
        </View>
        <View style={styles.actions}>
            <View style={styles.actionBtn}>
                <Button title={addToCartIsPending ? 'Adding...' : 'Add to cart'} color="#fdab31" disabled={isInvalidQty || addToCartIsPending} onPress={handleAddToCart} />
            </View>
            <View style={styles.actionBtn}>
                <Button title={orderNowBtnTitle} color={isDesignExistInOrders ? "#71a171" : "brown"} disabled={isInvalidQty || isDesignExistInOrders || orderNowIsPending} onPress={handleOrderNow}  />
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
    quantityContainer: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 20,
        marginVertical: 8,
    },
    quantityLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        // flex: 1,
        color: "maroon",
    },
    quantityInput: {
        width: 50,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        fontSize: 18,
        fontWeight: 'bold',
        borderColor: "maroon",
    },
    imageContainer: {
        width: "100%",
        height: 200,
    }
})