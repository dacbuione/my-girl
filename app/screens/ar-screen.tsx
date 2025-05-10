"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native"
import { Camera } from "expo-camera"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

export default function ARScreen() {
  const [hasPermission, setHasPermission] = useState(null)
  const [spiritPlaced, setSpiritPlaced] = useState(false)
  const [spiritPosition, setSpiritPosition] = useState({ x: 0, y: 0 })
  const navigation = useNavigation()

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setHasPermission(status === "granted")
    })()
  }, [])

  const handlePlaceSpirit = (event) => {
    // In a real app, this would use AR Kit/Core to place the 3D model
    // For this concept, we'll simulate placement with 2D coordinates
    const { locationX, locationY } = event.nativeEvent
    setSpiritPosition({ x: locationX, y: locationY })
    setSpiritPlaced(true)
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={Camera.Constants.Type.back}>
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.title}>AR Mode</Text>

            <TouchableOpacity style={styles.iconButton} onPress={() => setSpiritPlaced(false)}>
              <Ionicons name="refresh" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {!spiritPlaced ? (
            <TouchableOpacity style={styles.placementArea} onPress={handlePlaceSpirit}>
              <Text style={styles.placementText}>Tap anywhere to place your Spirit Guide in the real world</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.spiritContainer, { left: spiritPosition.x - 75, top: spiritPosition.y - 75 }]}>
              {/* This would be a 3D model in a real AR implementation */}
              <Image source={require("../../assets/images/spirit-placeholder.png")} style={styles.spiritImage} />
            </View>
          )}

          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                /* Would trigger animation */
              }}
            >
              <Ionicons name="hand-left" size={24} color="#fff" />
              <Text style={styles.buttonText}>Pet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                /* Would trigger animation */
              }}
            >
              <Ionicons name="happy" size={24} color="#fff" />
              <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                /* Would trigger animation */
              }}
            >
              <Ionicons name="mic" size={24} color="#fff" />
              <Text style={styles.buttonText}>Speak</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    width: "100%",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  placementArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placementText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
    borderRadius: 10,
    maxWidth: "80%",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  spiritContainer: {
    position: "absolute",
    width: 150,
    height: 150,
  },
  spiritImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(108, 92, 231, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    marginTop: 4,
    fontSize: 12,
  },
  text: {
    color: "#000",
    fontSize: 18,
    textAlign: "center",
  },
})
