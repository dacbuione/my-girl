"use client"
import React from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "react-native"
import AppNavigator from "./navigation/app-navigator"

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <AppNavigator />
    </SafeAreaProvider>
  )
}
