import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, View, TextInput, Animated, TouchableOpacity, Image } from "react-native";
import { AppLogo } from "./AppLogo";
import { FontFamily } from "../MyAppText";
import { useFetch } from "src/hooks/useFetch";
import { SearchIcon } from "./SearchIcon";
import { useRootStore } from "src/hooks/useRootStore";
import { observer } from "mobx-react-lite";
import { HeaderBonusInfo } from "../HeaderBonusInfo";

export const MainHeader = observer(() => {
  const {
    catalogStore,
    authStore: {
      isAuthenticated,
      mobileToken: {
        client_info: { bonuses },
      },
    },
  } = useRootStore();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { getUserSearchResults, setUserSearchResults, setUserSearchResultsIsLoading } = catalogStore;
  const { invokeApi, isLoading } = useFetch(getUserSearchResults);
  const inputRef = useRef<TextInput | null>(null);

  const handleSearchPress = () => {
    setIsSearchActive(true);
  };

  const handleCancelSearch = () => {
    setIsSearchActive(false);
    setSearchValue("");
    setUserSearchResults(null);
  };

  const handleChangeText = (t: string) => {
    setSearchValue(t);
    invokeApi(t);
  };

  const inputWidth = isSearchActive ? "100%" : 0;
  const wrapperOpacity = isSearchActive ? 0 : 1;

  useEffect(() => {
    Animated.timing(wrapperOpacityValue, {
      toValue: wrapperOpacity,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (isSearchActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchActive, wrapperOpacity]);

  useEffect(() => {
    setUserSearchResultsIsLoading(isLoading);
  }, [isLoading]);

  const wrapperOpacityValue = useRef(new Animated.Value(wrapperOpacity)).current;
  console.log("isAuthenticated", isAuthenticated);
  return (
    <SafeAreaView>
      <View style={s.wrapper}>
        <Animated.View style={{ opacity: wrapperOpacityValue }}>{!isSearchActive && <AppLogo />}</Animated.View>
        <Animated.View style={[s.container, { width: inputWidth }]}>
          <View style={s.searchInputWrapper}>
            <Image source={require("icons/mainScreen/header/search.png")} />
            <TextInput
              ref={inputRef}
              style={s.searchInput}
              value={searchValue}
              onChangeText={handleChangeText}
              placeholder="Найти товар"
            />
            <TouchableOpacity onPress={handleCancelSearch} style={s.cancelIconWrapper}>
              <Image source={require("icons/close.png")} />
            </TouchableOpacity>
          </View>
        </Animated.View>
        {!isSearchActive && (
          <View style={s.iconsWrapper}>
            {isAuthenticated && <HeaderBonusInfo bonuses={bonuses} />}
            <SearchIcon handleSearchPress={handleSearchPress} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
});

const s = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    padding: 5,
    backgroundColor: "#F8F8F8",
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#323232",
    fontFamily: FontFamily.REGULAR,
    fontSize: 14,
    fontWeight: "400",
  },
  cancelIconWrapper: {
    paddingHorizontal: 10,
  },
  iconsWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchIconWrapper: {
    paddingRight: 15,
  },
});
