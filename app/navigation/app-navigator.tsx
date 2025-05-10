"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import HomeScreen from "../screens/home-screen"
import SanctuaryScreen from "../screens/sanctuary-screen"
import MiniGameScreen from "../screens/mini-game-screen"
import ARScreen from "../screens/ar-screen"

const Stack = createStackNavigator()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#2d3436" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Sanctuary" component={SanctuaryScreen} />
        <Stack.Screen name="MiniGame" component={MiniGameScreen} />
        <Stack.Screen name="AR" component={ARScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
