import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useRootStore } from "src/hooks/useRootStore";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";

interface InputProps {
  code: string[];
  setCode: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Input: React.FC<InputProps> = observer(({ code, setCode }) => {
  const inputs = useRef<TextInput[]>([]);
  const {
    authStore: { isSmsCodeInvalid, setSmsCodeInvalidity },
  } = useRootStore();

  const focusNext = (key: number) => {
    if (key < 3) {
      inputs.current[key + 1].focus();
    }
  };

  const focusPrevious = (key: number) => {
    if (key > 0) {
      inputs.current[key - 1].focus();
    }
  };

  const updateCode = (key: number, value: string) => {
    setCode(prevCode => {
      const newCode = [...prevCode];
      newCode[key] = value;
      return newCode;
    });
    if (value) {
      focusNext(key);
    } else {
      focusPrevious(key);
    }
    setSmsCodeInvalidity(false);
  };

  useEffect(() => {
    if (inputs.current[0]) {
      setTimeout(() => inputs.current[0].focus(), 100);
    }
  }, []);

  return (
    <View style={styles.container}>
      {isSmsCodeInvalid && <MyAppText style={styles.errorMessage}>Неверный код подтверждения</MyAppText>}
      {code.map((_, i) => (
        <TextInput
          key={i}
          ref={ref => inputs.current.push(ref as TextInput)}
          value={code[i]}
          onChangeText={value => updateCode(i, value)}
          keyboardType="numeric"
          maxLength={1}
          style={styles.input}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: FontFamily.MEDIUM,
    position: "absolute",
    bottom: -20,
    color: "#FF3E3E",
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CECECE",
    padding: 10,
    fontSize: 24,
    textAlign: "center",
    margin: 5,
    width: 50,
    backgroundColor: "#F0F5F5",
    borderRadius: 10,
  },
});
