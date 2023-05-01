import { KeyboardAvoidingView, View } from "react-native";
import AppScreen from "./app/AppScreen";
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
  configureFonts,
} from "react-native-paper";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";

// SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "OpenSans-Regular": require("./assets/fonts/OpenSans-Regular.ttf"),
    "OpenSans-Medium": require("./assets/fonts/OpenSans-Medium.ttf"),
    "OpenSans-Light": require("./assets/fonts/OpenSans-Light.ttf"),
    "OpenSans-Bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const fontConfig = {
    default: {
      regular: {
        fontFamily: "OpenSans-Regular",
        fontWeight: "normal",
      },
      medium: {
        fontFamily: "OpenSans-Medium",
        fontWeight: "normal",
      },
      light: {
        fontFamily: "OpenSans-Light",
        fontWeight: "normal",
      },
      labelLarge: {
        fontFamily: "OpenSans-Medium",
        fontWeight: "normal",
      },
      bodySmall: {
        fontFamily: "OpenSans-Regular",
        fontWeight: "normal",
      },
      bodyMedium: {
        fontFamily: "OpenSans-Regular",
        fontWeight: "normal",
      },
      bodyLarge: {
        fontFamily: "OpenSans-Regular",
        fontWeight: "normal",
      },
    },
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      main: "#F4EEE0",
      accent: "#4F4557",
      primary: "#393646",
      secondary: "#6D5D6E",
      danger: "#f56565",
      warning: "#eed202",
      success: "#48bb78",
      light: "#6e6969",
      white: "#fdfdfd",
      dark: "#0c0c0c",
      notActive: "#f2f2f2",
    },
    fonts: configureFonts({ config: fontConfig, isV3: false }),
  };
  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <AppScreen />
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}
