import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../app/context/ThemeContext"

export default function RootLayout() {
  return(
    // Wrap code around ThemeProvider to apply theme ie, 
    // Light and dark mode
    <ThemeProvider>
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false}}>
        <Stack.Screen name="index" />
        <Stack.Screen name="todos/[id]" />
      </Stack>
    </SafeAreaProvider>
    </ThemeProvider>
  )
}
