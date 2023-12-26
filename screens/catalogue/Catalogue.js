import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { fetchCatalogueDesigns } from "../../util/http";
import { useQuery } from "@tanstack/react-query";
import { FlatList } from "react-native-gesture-handler";
import { getAccountLoader } from "../../util/auth";
import CatalogueDetails from "../../components/catalogue/CatalogueDetails";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";

const Catalogue = ({navigation}) => {
  const dispatch = useDispatch()
  const [account, setAccount] = useState(null);
  const [designItem, setDesignItem] = useState();

  const isCatalogueDesignDetailsOpen = useSelector(state => state.ui.isCatalogueDesignDetailsOpen);

  useLayoutEffect(()=>{
    navigation.setOptions({
      title: designItem ? `Design ${designItem.id} Details` : "Catalogue"
    });
  },[navigation,designItem]);
  
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

  // console.log("account data loaded", account);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["catalogueDesigns",{accountId: account ? account.id : null}],
    queryFn: ({ signal }) => account ? fetchCatalogueDesigns({ signal, accountId: account.id }) : {},
  });

  let content = <Text>No designs in catalogue</Text>;

  function handleShowDesignDetails(item){
    setDesignItem(item);
    dispatch(uiActions.openCatalogueDesignDetails());
  }

  function renderItemFn(item) {
    return (
      <Pressable android_ripple={{color: "#f3f3f3"}} style={({pressed})=>[styles.container, pressed && styles.pressDesign]} onPress={()=>handleShowDesignDetails(item)}>
        <View>
            <Image source={{ uri: item.designImages[0] ? item.designImages[0].preSignedURL : null }} style={styles.image} />
        </View>
        <View style={{paddingVertical: 8, gap: 6, paddingHorizontal: 12}}>
          <Text style={[styles.title]}>Design {item.id}</Text>
          <Text style={styles.text}>Gross Weight: {item.grossWeight} Gms</Text>
        </View>
      </Pressable>
    );
  }

  if(designItem && isCatalogueDesignDetailsOpen){
    return <CatalogueDetails item={designItem} setDesignItem={setDesignItem} />;
  }
  
  if(isPending){
    content = <Text>Loading...</Text>
  }

  if (data) {
    content = (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={(itemData) => renderItemFn(itemData.item)}
      />
    );
  }

  if(isError){
    content = <Text>{error.info ? error.info.errorMessage : "Error Occured"}</Text>
    // console.log("Error is: ", error);
  }


  return <View style={styles.screen}>{content}</View>;
};

export default Catalogue;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 6,
    alignItems: 'center',
  },
  container:{
    margin:6,
    backgroundColor:'white',
    elevation: 2,
    shadowColor: "black",
    shadowOffset: {width: 1, height: 1},
    shadowRadius: 4,
    shadowOpacity: 0.25,
    borderRadius: 8,
    overflow: "hidden",
},
pressDesign: {
  opacity: 0.75,
},
image:{
    width: '100%',
    height: 150
},
title:{
    fontWeight:'bold',
    textAlign: 'center',
    fontSize: 18,
    color: 'rgb(163, 4, 137)',
},
text:{
  fontSize:16,
  textAlign: "center",
}
});
