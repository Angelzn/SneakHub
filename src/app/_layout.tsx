import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";

import { CatalogoProvider } from "../context/CatalogoContext";

export default function RootLayout() {
  return (
    <PaperProvider>
      <CatalogoProvider>
        <StatusBar style="light" />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "#0C0C0C",
            },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="inicio" />
          <Stack.Screen name="catalogo" />
          <Stack.Screen name="agregar" />
          <Stack.Screen name="explore" />
        </Stack>
      </CatalogoProvider>
    </PaperProvider>
  );
}
