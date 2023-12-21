import { View, Text, Button, Image, StyleSheet } from 'react-native'
import React from 'react'
import { uiActions } from '../../store/ui-slice';
import { useDispatch } from 'react-redux';
import CarouselCards from './carousel/CarouselCards';

const CatalogueDetails = ({item, setDesignItem}) => {
    const dispatch = useDispatch();

    function handleGoBack(){
        setDesignItem();
        dispatch(uiActions.closeCatalogueDesignDetails());
    }

  return (
    <View>
        <CarouselCards data={item.designImages}/>
        <Button title='Back' onPress={handleGoBack}/>
        <Text>Design {item.id}</Text>
    </View>
  )
}

export default CatalogueDetails

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 6,
    }
})