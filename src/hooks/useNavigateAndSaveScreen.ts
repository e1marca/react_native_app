import { useNavigation } from "@react-navigation/core";
import { useRootStore } from "./useRootStore";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "src/screens/types";

const useNavigateAndSaveScreen = () => {
  const {
    mainStore: { setRedirectScreen },
  } = useRootStore();

  const { navigate } = useNavigation<StackNavigationProp<AppStackParamList>>();
  const navigateAndSaveScreen = ({ currentScreen, targetScreen }: { currentScreen: any; targetScreen: any }) => {
    setRedirectScreen(currentScreen);
    navigate(...targetScreen);
  };

  return navigateAndSaveScreen;
};

export default useNavigateAndSaveScreen;
