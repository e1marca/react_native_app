import { useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import { useRootStore } from "./useRootStore";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "src/screens/types";

const useRedirect = () => {
  const {
    mainStore: { redirectScreen, setRedirectScreen },
    authStore: { isAuthenticated },
  } = useRootStore();
  const { navigate } = useNavigation<StackNavigationProp<AppStackParamList>>();

  useEffect(() => {
    if (redirectScreen && isAuthenticated) {
      navigate(...redirectScreen);
      setRedirectScreen(null);
    }
  }, [redirectScreen, navigate, setRedirectScreen, isAuthenticated]);
};

export default useRedirect;
