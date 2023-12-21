import { useRef } from "react"
import Carousel from "react-native-snap-carousel"
import CarouselCardItem, { ITEM_WIDTH, SLIDER_WIDTH } from "./CarouselCardItem"
import { View } from "react-native"

const CarouselCards = ({data}) => {
    const isCarousel = useRef(null)
  
    return (
      <View>
        <Carousel
          layout="tinder"
          layoutCardOffset={9}
          ref={isCarousel}
          data={data}
          renderItem={CarouselCardItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          inactiveSlideShift={0}
          useScrollView={true}
        />
      </View>
    )
  }
  
  
  export default CarouselCards