import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { fetchCatalogueDesigns } from "../../util/http";
import { useQuery } from "@tanstack/react-query";
import { FlatList } from "react-native-gesture-handler";

const Catalogue = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["catalogueDesigns"],
    queryFn: ({ signal }) => fetchCatalogueDesigns({ signal, accountId: 5 }),
  });

  let content = <Text>No designs in catalogue</Text>;

  function renderItemFn(item) {
    return (
      <View>
        <Text>Design {item.id}</Text>
      </View>
    );
  }
  
  if(isPending){
    content = <Text>Loading...</Text>
  }

  if(isError){
    content = <Text>Error Occured</Text>
    // console.log("Error is: ", error);
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

  return <View style={styles.screen}>{content}</View>;
};

export default Catalogue;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
});
