import React, { useRef, useState, useEffect } from "react";
import { Image, View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Animated } from "react-native";
import { FontFamily, MyAppText } from "../MyAppText";
import { useRootStore } from "src/hooks/useRootStore";

const screens = [
  {
    title: "Выбери и Закажи воду",
    image: require("images/greetingScreen/1.png"),
  },
  {
    title: "Укажи свой адрес",
    image: require("images/greetingScreen/2.png"),
  },
  {
    title: "Доставим воду в срок!",
    image: require("images/greetingScreen/3.png"),
  },
];

export const GreetingScreen = () => {
  const {
    mainStore: { setGreetingScreenShown },
  } = useRootStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnims = useRef(screens.map((_, index) => new Animated.Value(index === 0 ? 41 : 15))).current;
  const startButtonOpacity = useRef(new Animated.Value(0)).current;

  const fadeIn = (index: number) => {
    Animated.parallel([
      Animated.timing(fadeAnims[index], {
        toValue: 41,
        duration: 1000,
        useNativeDriver: false,
      }),
      ...fadeAnims
        .filter((_, i) => i !== index)
        .map(anim =>
          Animated.timing(anim, {
            toValue: 15,
            duration: 1000,
            useNativeDriver: false,
          })
        ),
    ]).start();
  };

  const fadeInStartButton = () => {
    Animated.timing(startButtonOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    fadeIn(currentIndex);
    if (currentIndex === screens.length - 1) {
      fadeInStartButton();
    }
  }, []);

  const handleNext = () => {
    if (currentIndex < screens.length - 1) {
      setCurrentIndex(prev => prev + 1);
      fadeIn(currentIndex + 1);
      if (currentIndex + 1 === screens.length - 1) {
        fadeInStartButton();
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      fadeIn(currentIndex - 1);
      if (currentIndex - 1 !== screens.length - 1) {
        startButtonOpacity.setValue(0);
      }
    }
  };

  const handleStart = () => {
    // Handle the "Start" button press
    setGreetingScreenShown();
    console.log("Start button pressed");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.arrowContainer}>
          {currentIndex > 0 && (
            <TouchableOpacity onPress={handleBack}>
              <Image source={require("icons/arrowLeft.png")} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.imageContainer}>
          <Image source={screens[currentIndex].image} />
          <MyAppText style={styles.title}>{screens[currentIndex].title}</MyAppText>
        </View>
        <View style={styles.dotsContainer}>
          {screens.map((_, index) => (
            <Animated.View
              style={[styles.dot, index === currentIndex && styles.selectedDot, { width: fadeAnims[index] }]}
              key={index}
            />
          ))}
        </View>
      </View>
      {currentIndex === screens.length - 1 ? (
        <Animated.View style={[styles.startButtonContainer, { opacity: startButtonOpacity }]}>
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handleStart}>
            <Text style={styles.skipButtonText}>Пропустить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Image
              source={require("icons/arrowLeft.png")}
              style={{ transform: [{ rotate: "180deg" }], tintColor: "#FFF" }}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  arrowContainer: {
    flex: 1,
  },
  imageContainer: {
    flex: 2,
  },
  title: {
    fontWeight: "500",
    fontFamily: FontFamily.MEDIUM,
    fontSize: 20,
    textAlign: "center",
    marginTop: 30,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 0.5,
    alignItems: "center",
  },
  dot: {
    width: 15,
    height: 15,
    backgroundColor: "#D9D9D9",
    borderRadius: 100,
    marginHorizontal: 10,
    transition: 1,
  },
  selectedDot: {
    width: 41,
    backgroundColor: "#10BBFF",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flex: 0.2,
  },
  skipButtonText: {
    fontWeight: "500",
    fontFamily: FontFamily.MEDIUM,
    fontSize: 16,
    opacity: 0.5,
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: "#10BBFF",
    paddingVertical: 15,
    paddingHorizontal: 41,
    borderRadius: 25,
  },
  startButtonContainer: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#10BBFF",
    paddingVertical: 15,
    paddingHorizontal: 41,
    borderRadius: 25,
  },
  startButtonText: {
    color: "#FFF",
    fontFamily: FontFamily.MEDIUM,
    fontSize: 16,
  },
});
