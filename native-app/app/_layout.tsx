import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#b21357", // Set header background color
          // backgroundColor: "ff1c7a",
        },
        headerTintColor: "#fff", // Optional: Set the header text/icon color
        title: "", // Remove the default title
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
