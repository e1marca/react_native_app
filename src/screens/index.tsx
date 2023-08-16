import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer, ParamListBase, RouteProp } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { I18nextProvider } from "react-i18next";
import i18nextConfig from "configs/i18nextConfig";
import { StatusBar } from "react-native";
import { observer } from "mobx-react-lite";
import { AppScreen } from "src/screens/types";
import { useRootStore } from "src/hooks/useRootStore";
import { useFetch } from "src/hooks/useFetch";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";
import { ErrorMessage } from "src/shared/Widgets/ErrorMessage";
import { MainScreen } from "./Main";
import { CatalogScreen } from "./Catalog";
import { CartScreen } from "./Cart";
import { ProfileScreen } from "./Profile";
import { GreetingScreen } from "src/shared/Widgets/GreetingsScreen";
import { CartScreens } from "./Cart/types";
import { ProfileScreens } from "./Profile/types";
import { CatalogScreens } from "src/shared/Catalog/types";
import { ChooseCityModal } from "src/shared/Modals/ChooseCityModal";
import { MyIcon } from "src/shared/Widgets/MyIcon";

const tabBarActiveTintColor = "#383F85";

const Tab = createBottomTabNavigator();

const tabIconSources = {
  [AppScreen.Main]: require("icons/bottomTab/main.png"),
  [AppScreen.Catalog]: require("icons/bottomTab/catalog.png"),
  [AppScreen.Cart]: require("icons/bottomTab/cart.png"),
  [AppScreen.Profile]: require("icons/bottomTab/profile.png"),
};

interface TabBarIconProps {
  color: string;
  size: number;
  route: RouteProp<ParamListBase>;
}
const tabBarIcons = ({ color, route, size }: TabBarIconProps) => {
  return (
    <MyIcon source={tabIconSources[route.name as AppScreen]} styles={{ tintColor: color, width: size, height: size }} />
  );
};

export const AppScreens: React.FC<{ mainStoreIsLoading: boolean }> = observer(({ mainStoreIsLoading }) => {
  const {
    authStore: {
      getOrUpdateToken,
      mobileToken,
      currentCity,
      isAuthenticated,
      mobileToken: { company_info },
    },
    cartStore,
    mainStore: { isGreetingScreenShown },
  } = useRootStore();
  const { t } = useTranslation();
  const { invokeApi, isLoading } = useFetch(getOrUpdateToken);
  const { cart } = cartStore;

  useEffect(() => {
    invokeApi();
  }, [invokeApi]);

  if (isLoading || mainStoreIsLoading) {
    return <LoadingIndicator />;
  }

  if (!Object.keys(mobileToken).length) {
    return <ErrorMessage />;
  }

  if (!isGreetingScreenShown) {
    return <GreetingScreen />;
  }

  const NAVIGATION_BLOCKED = !isAuthenticated && company_info.mobile_auth_required;

  const PROFILE_TAB = (
    <Tab.Screen
      name={AppScreen.Profile}
      component={ProfileScreen}
      options={{ headerShown: false, tabBarStyle: NAVIGATION_BLOCKED ? { display: "none" } : {} }}
      listeners={({ navigation: { navigate } }) => ({
        tabPress: e => {
          e.preventDefault();
          navigate(AppScreen.Profile, {
            screen: ProfileScreens.PROFILE_HOME,
          });
        },
      })}
    />
  );

  const renderTabs = () => {
    if (NAVIGATION_BLOCKED) {
      return PROFILE_TAB;
    }
    return (
      <>
        <Tab.Screen name={AppScreen.Main} component={MainScreen} options={{ headerShown: false }} />
        <Tab.Screen
          name={AppScreen.Catalog}
          component={CatalogScreen}
          options={{ headerShown: false }}
          listeners={({ navigation: { navigate } }) => ({
            tabPress: e => {
              e.preventDefault();
              navigate(AppScreen.Catalog, {
                screen: CatalogScreens.CATALOG_SCREEN,
              });
            },
          })}
        />
        <Tab.Screen
          name={AppScreen.Cart}
          component={CartScreen}
          options={{
            headerShown: false,
            tabBarBadge: cart?.count ? cart?.count : undefined,
          }}
          listeners={({ navigation: { navigate } }) => ({
            tabPress: e => {
              e.preventDefault();
              navigate(AppScreen.Cart, {
                screen: CartScreens.CART_HOME,
              });
            },
          })}
        />
        {PROFILE_TAB}
      </>
    );
  };

  return (
    <I18nextProvider i18n={i18nextConfig}>
      <StatusBar />
      {!currentCity && <ChooseCityModal />}
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => {
            return {
              tabBarIcon: ({ color, size }) => tabBarIcons({ color, size, route }),
              tabBarLabel: t(`General:${route.name}`) as string,
              tabBarActiveTintColor,
            };
          }}>
          {renderTabs()}
        </Tab.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
});
