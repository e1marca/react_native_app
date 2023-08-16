import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, View, Image, FlatList, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { useRootStore } from "src/hooks/useRootStore";
import { SliderDots } from "src/shared/Widgets/SliderDots";
import { Slides } from "src/stores/authStore/types";

const width = Dimensions.get("window").width;

export const Campaign = observer(() => {
  const {
    authStore: {
      mobileToken: {
        slides,
        company_info: {
          mobile_slider_params: { change_speed },
        },
      },
    },
  } = useRootStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<FlatList<Slides> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = (currentIndex + 1) % slides.length;
      if (sliderRef.current) {
        sliderRef.current.scrollToOffset({
          offset: nextIndex * width,
          animated: true,
        });
      }
      setCurrentIndex(nextIndex);
    }, change_speed);
    return () => clearInterval(timer);
  }, [currentIndex, slides.length, change_speed]);

  const handleOpenLink = (url: string) => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle URL: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error("An error occurred", err));
  };

  return (
    <View>
      <FlatList
        ref={sliderRef}
        data={slides}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={width}
        decelerationRate="fast"
        onScroll={({ nativeEvent }) => {
          const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
          if (slide !== currentIndex) {
            setCurrentIndex(slide);
          }
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            disabled={!item.link}
            activeOpacity={1}
            onPress={() => handleOpenLink(item.link)}
            style={s.contentContainer}>
            <Image style={s.image} source={{ uri: item.image_url }} resizeMode="contain" />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
      <SliderDots currentIndex={currentIndex} slides={slides} />
    </View>
  );
});

const s = StyleSheet.create({
  contentContainer: {
    width: width,
    height: width * 0.55,
    backgroundColor: "#FFF",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "#D9D9D9",
  },
  activeDot: {
    backgroundColor: "#FFF",
  },
});
