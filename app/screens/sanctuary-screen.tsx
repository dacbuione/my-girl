"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Canvas, useFrame } from "@react-three/fiber/native"
import { PerspectiveCamera, Environment, useCursor } from "@react-three/drei/native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as THREE from "three"
import { Audio } from "expo-av"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

// Main Sanctuary Screen Component
export default function SanctuaryScreen() {
  const [showCustomizeMenu, setShowCustomizeMenu] = useState(false)
  const [showMoodIndicator, setShowMoodIndicator] = useState(false)
  const [spiritMood, setSpiritMood] = useState("content")
  const navigation = useNavigation()

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        {/* 3D Canvas for Spirit Guide and Sanctuary */}
        <Canvas style={styles.canvas}>
          <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={60} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <Environment preset="sunset" />
          <Sanctuary />
          <SpiritGuide setShowMoodIndicator={setShowMoodIndicator} setSpiritMood={setSpiritMood} />
        </Canvas>

        {/* UI Overlay Elements */}
        <View style={styles.uiContainer}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Home")}>
              <Ionicons name="home-outline" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.energyContainer}>
              <Ionicons name="flash" size={18} color="#FFD700" />
              <View style={styles.energyBar}>
                <View style={[styles.energyFill, { width: "75%" }]} />
              </View>
            </View>

            <TouchableOpacity style={styles.iconButton} onPress={() => setShowCustomizeMenu(!showCustomizeMenu)}>
              <Ionicons name="color-palette-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {showMoodIndicator && (
            <View style={styles.moodIndicator}>
              <Text style={styles.moodText}>Your Spirit is feeling {spiritMood}</Text>
            </View>
          )}

          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Feed")}>
              <Ionicons name="nutrition-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>Feed</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Play")}>
              <Ionicons name="game-controller-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Speak")}>
              <Ionicons name="mic-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>Speak</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Customization Menu */}
        {showCustomizeMenu && (
          <View style={styles.customizeMenu}>
            <Text style={styles.menuTitle}>Customize Sanctuary</Text>
            <View style={styles.itemsGrid}>
              {["Tree", "Fountain", "Lantern", "Crystals"].map((item) => (
                <TouchableOpacity key={item} style={styles.itemButton}>
                  <View style={styles.itemIcon} />
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowCustomizeMenu(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  )
}

// Spirit Guide 3D Model Component
function SpiritGuide({ setShowMoodIndicator, setSpiritMood }) {
  const group = useRef()
  const [hovered, setHovered] = useState(false)
  const [petted, setPetted] = useState(false)
  const [tickled, setTickled] = useState(false)
  const [position] = useState(new THREE.Vector3(0, 0, 0))
  const [soundEffect, setSoundEffect] = useState(null)

  // Simulating loading a 3D model
  // In a real app, you would use useGLTF to load your spirit guide model

  useCursor(hovered)

  // Animation loop
  useFrame((state, delta) => {
    if (!group.current) return

    // Idle animation - gentle floating
    group.current.position.y = position.y + Math.sin(state.clock.elapsedTime) * 0.1

    // Petting animation
    if (petted) {
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 5) * 0.1
      setTimeout(() => setPetted(false), 2000)
    }

    // Tickling animation
    if (tickled) {
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 10) * 0.1
      setTimeout(() => setTickled(false), 2000)
    }
  })

  // Handle touch interactions
  const handlePet = async () => {
    setPetted(true)
    setSpiritMood("happy")
    setShowMoodIndicator(true)
    setTimeout(() => setShowMoodIndicator(false), 3000)

    // Play sound effect
    try {
      const { sound } = await Audio.Sound.createAsync(require("../../assets/sounds/purr.mp3"))
      setSoundEffect(sound)
      await sound.playAsync()
    } catch (error) {
      console.log("Error playing sound", error)
    }
  }

  const handleTickle = () => {
    setTickled(true)
    setSpiritMood("playful")
    setShowMoodIndicator(true)
    setTimeout(() => setShowMoodIndicator(false), 3000)
  }

  useEffect(() => {
    return soundEffect
      ? () => {
          soundEffect.unloadAsync()
        }
      : undefined
  }, [soundEffect])

  // Placeholder for the 3D model
  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          // Different reactions based on where the spirit is touched
          if (e.point.y > 0.5) {
            handlePet() // Pet head
          } else {
            handleTickle() // Tickle body
          }
          e.stopPropagation()
        }}
      >
        {/* Placeholder geometry - would be replaced with actual model */}
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color={hovered ? "#9c88ff" : "#8c7ae6"}
          emissive={petted || tickled ? "#9c88ff" : "#000000"}
          emissiveIntensity={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Spirit's eyes */}
      <mesh position={[-0.25, 0.3, 0.6]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.25, 0.3, 0.6]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Spirit's pupils */}
      <mesh position={[-0.25, 0.3, 0.7]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.25, 0.3, 0.7]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Spirit's ethereal aura/wings */}
      <mesh position={[0, 0, -0.3]} rotation={[0, 0, 0]}>
        <torusGeometry args={[1, 0.2, 16, 100, Math.PI * 2]} />
        <meshStandardMaterial
          color="#9c88ff"
          transparent={true}
          opacity={0.6}
          emissive="#9c88ff"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}

// Sanctuary Environment Component
function Sanctuary() {
  // This would be customizable by the user
  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#a29bfe" />
      </mesh>

      {/* Decorative elements */}
      <mesh position={[-3, -0.5, -3]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#74b9ff" />
      </mesh>

      <mesh position={[2.5, -0.5, -2]} castShadow>
        <coneGeometry args={[0.7, 2, 32]} />
        <meshStandardMaterial color="#55efc4" />
      </mesh>

      {/* Floating crystals */}
      <group position={[3, 0.5, -4]}>
        <mesh rotation={[0.5, 0.5, 0]}>
          <octahedronGeometry args={[0.5]} />
          <meshStandardMaterial color="#fd79a8" emissive="#fd79a8" emissiveIntensity={0.3} />
        </mesh>
      </group>

      <group position={[-2, 1, -3]}>
        <mesh rotation={[0.2, 0.3, 0.1]}>
          <octahedronGeometry args={[0.3]} />
          <meshStandardMaterial color="#00cec9" emissive="#00cec9" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </group>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  uiContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "box-none",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    width: "100%",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  energyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 15,
    padding: 8,
  },
  energyBar: {
    width: 100,
    height: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 5,
    marginLeft: 8,
    overflow: "hidden",
  },
  energyFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 5,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(108, 92, 231, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    marginTop: 4,
    fontSize: 12,
  },
  moodIndicator: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
  },
  moodText: {
    color: "#fff",
    fontWeight: "bold",
  },
  customizeMenu: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(45, 52, 54, 0.9)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  menuTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemButton: {
    width: "48%",
    backgroundColor: "rgba(108, 92, 231, 0.3)",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dfe6e9",
    marginBottom: 5,
  },
  itemText: {
    color: "#fff",
  },
  closeButton: {
    backgroundColor: "rgba(108, 92, 231, 0.8)",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
})
