import { View, Text, Button } from 'react-native'
import React from 'react'
import { uiActions } from '../../store/ui-slice';
import { useDispatch } from 'react-redux';

const CatalogueDetails = ({item, setDesignItem}) => {
    const dispatch = useDispatch();

    function handleGoBack(){
        setDesignItem();
        dispatch(uiActions.closeCatalogueDesignDetails());
    }

  return (
    <View>
        <Button title='Back' onPress={handleGoBack}/>
        <Text>Design {item.id}</Text>
    </View>
  )
}

export default CatalogueDetails