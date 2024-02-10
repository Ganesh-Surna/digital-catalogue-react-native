import { fetchCatalogueDesigns, fetchOrderedDesignsForUser, fetchAccountOrdersForManufacturer, fetchRecentOrders } from "../../util/http";
import { getAccountLoader, getUser } from "../../util/auth";
import {View, Text, StyleSheet, FlatList, Image, useWindowDimensions, ScrollView} from 'react-native';
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [screenHeight, setScreenHeight] = useState(0)
    const onContentSizeChange = (contentWidth, contentHeight) =>setScreenHeight(contentHeight);

    const {width, height} =useWindowDimensions();

    const scrollEnabled = screenHeight > height;

    //const {accountType, id: accountId} = getAccountLoader();
    //const user = getUser();
    //const userId= user ? user.id : null;

    const [account, setAccount] = useState();
    const [user, setUser] = useState();
    const [designs, setDesigns] = useState();
    const [orders, setOrders] = useState();
    const [chartData, setChartData] = useState();
    const [recentOrders, setRecentOrders] =useState();

    useEffect(()=>{
        getUser()
      .then((response) => {
        setUser(response);
      })
      .catch((error) => {
        console.log("error:", error);
      });
  }, [getUser]);

  useEffect(()=>{
    getAccountLoader()
  .then((response) => {
    setAccount(response);
  })
  .catch((error) => {
    console.log("error:", error);
  });
}, [getAccountLoader]);

const {data: accountOrdersData} = useQuery({
    queryKey: ["accountOrders"],
    queryFn: fetchAccountOrdersForManufacturer,
  })

    const {data: designsData} = useQuery({
        queryKey:  ["designs"],
        queryFn: ({signal})=> (account ? fetchCatalogueDesigns({signal, accountId: account ? account.id : null}) : 0)
    })

    const {data: orderedDesignsForUser} = useQuery({
        queryKey: ["ordered-designs", {userId: user ? user.id: null}],
        queryFn: ({signal})=> user ? fetchOrderedDesignsForUser({signal, userId: user ? user.id : null }) : 0,
    })

    const {data: recentOrdersData} = useQuery({
        queryKey: ["orders", {max:3}],
        queryFn: ({signal, queryKey})=>fetchRecentOrders({signal, ...queryKey[1]})
      })

    useEffect(()=>{
        if (designsData){
            setDesigns(designsData)
        }
        if (orderedDesignsForUser){
            setOrders(orderedDesignsForUser)
        }
        if (recentOrdersData){
            setRecentOrders(recentOrdersData)
        }
    }, [designsData, orderedDesignsForUser, recentOrdersData])

    useEffect(()=>{
        if(accountOrdersData){
          const mappedList = accountOrdersData.map((eachObj)=>{
            return {name: eachObj.account.name, orders: eachObj.objects.length}
          })
          setChartData([...mappedList]);
        }
    },[accountOrdersData])

    // const data = {
    //     labels: ["January", "February", "March", "April", "May", "June"],
    //     datasets: [
    //       {
    //         data: [20, 45, 28, 80, 99, 43]
    //       }
    //     ]
    //   };
    const data=[ {value:50}, {value:80}, {value:90}, {value:70}, {value:40}, {value:60} ]

    console.log(chartData)

    const barData = chartData && chartData.map(dataPoint => ({
        value: dataPoint.orders,
        label: dataPoint.name,
        topLabelComponent: () => (
            <Text style={{color: 'blue', fontSize: 18, marginBottom: 2}}>{dataPoint.orders}</Text>
          ),
    }));

    return(
        <ScrollView style={[styles.screen, {flexDirection: width > height ? "column" : "column"}]}>
            <View style={[styles.cards, {width: width > height ? '100%' : "100%"}]}>
                <View style={styles.card}>
                    <Text style={styles.title}>Catalogue Designs</Text>
                    <Text style={styles.designs}>{designs ? designs.length : 0}</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.title}>Ordered Designs</Text>
                    <Text style={styles.designs}>{orders ? orders.length : 0}</Text>
                </View>
            </View>
            <View style={[styles.chartAndOrdersContainer,{flexDirection: width > height ? "row" : "column",width: width>height ? '99.5%': '96%',}]}>
            <View style={[styles.container, {width: width>height ? '50%': '200%'}]}>
                <View>
                    <Text style={styles.title}>Orders by Retailers</Text>
                </View>
                <View style={{overflow: 'auto', width: "100%", flex: 1}}>
                    {/* <BarChart
                        isAnimated
                        height={200}
                        width={300}
                        barWidth={50}
                        noOfSections={5}
                        barBorderRadius={2}
                        frontColor="#9d7dba"
                        data={barData}
                        yAxisThickness={1}
                        xAxisThickness={1}
                    /> */}
                </View>
            </View>
            <ScrollView style={[styles.container, {width: width>height ? '50%': '100%'}]}>
                <Text style={styles.title}>Recent Orders</Text>
                {recentOrders ? 
                    recentOrders.map((item)=><View key={item.id} style={[styles.orderCard, {width: width>height ? '100%': '100%'}]}>
                            {/* <Swiper style={{width: '20%'}} showsButtons={true}>
                                {itemData.item.orderItems.map(item => (
                                    <View key={item.id}>
                                        <Image
                                            source={{ uri: item.design.designImages[0]?.preSignedURL }}
                                            style={styles.images}
                                        />
                                    </View>
                                ))}
                            </Swiper> */}
                            <View style={styles.image}>
                                {item.orderItems.slice(0,2).map((order) => (
                                    <Image key={order.id} source={{ uri: order.design.designImages[0]?.preSignedURL }} style={styles.designImage} />
                                ))}
                            </View>
                            <View style={styles.name}>
                                <Text style={{fontSize: 16}}>by</Text>
                                <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.user.firstName} {item.user.lastName}</Text>
                            </View>
                            <View style={styles.status}>
                                <Text style={{fontSize: 16}}>status</Text>
                                <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.orderStatus}</Text>
                            </View>
                        </View>)
                :
                <Text style={{textAlign: 'center'}}>No orders to display</Text>}
            </ScrollView>
            </View>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        // width: "100%",
        padding: 16,
        flexWrap: "wrap",
      },
    cards:{
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#ccc',
        borderWidth:1,
        borderColor: 'black',
        borderRadius: 6,
        height: 100,
        width: '49%',
        elevation: 2,
        shadowColor: "black",
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 4,
        shadowOpacity: 0.25,
        borderRadius: 10,
        overflow: "hidden",
    },
    image: {flexDirection: 'row', width: '20%', marginLeft: 16},
    name: {alignItems: 'center', width: '40%'},
    status: {alignItems: 'center', width: '40%'},
    title:{
        fontSize: 18,
        textAlign: 'center',
        padding: 4,
        fontWeight: 'bold',
        marginBottom: 4,
        width: '100%'
    },
    chartAndOrdersContainer:{
        gap: 8,
        alignSelf: 'center',
        width: '98%',
        marginBottom: 20,
        alignItems: "stretch",
    },
    designs:{
        fontSize: 28,
        textAlign: 'center',
        padding: 8,
        fontWeight: '800'
    },
    container:{
        width: '100%',
        alignSelf: "stretch",
        flex: 1,
        borderWidth: 1,
        borderRadius:8,
        padding: 8, 
        backgroundColor: '#ccc',
        marginBottom: 10,
    },
    orderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        //gap: 8,
        // borderBottomWidth: 1,
        // borderBottomColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#9d7dba',
        padding: 16,
        paddingHorizontal: 16,
        marginBottom: 10,
        elevation: 2,
        shadowColor: "black",
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 4,
        shadowOpacity: 0.25,
        borderRadius: 8,
        // width: "98%",
        alignSelf: "center",
        justifyContent: 'flex-start',
    },
    designImage:{
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: -10,
        borderWidth:0.5,
        marginTop:3,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    images: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

})