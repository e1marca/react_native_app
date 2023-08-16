import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "src/screens/types";
import { useRootStore } from "./useRootStore";

export const useBackButtonHandler = () => {
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const {
    mainStore: { redirectScreen, setRedirectScreen },
  } = useRootStore();

  const handleBackButton = () => {
    if (redirectScreen) {
      navigation.navigate(...redirectScreen);
      setRedirectScreen(null);
    } else {
      navigation.goBack();
    }
  };

  return handleBackButton;
};
