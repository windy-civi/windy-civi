import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#b21357", // Set header background color
        },
        headerTintColor: "#fff",
        title: "",
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
