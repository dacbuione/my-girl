"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Canvas, useFrame, useThree } from "@react-three/fiber/native"
import { PerspectiveCamera, Environment } from "@react-three/drei/native"
import * as THREE from "three"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

export default function MiniGameScreen() {
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const navigation = useNavigation()

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
  }

  const endGame = () => {
    setGameOver(true)
  }

  return (
    <View style={styles.container}>
      {/* 3D Canvas for Flight Game */}
      <Canvas style={styles.canvas}>
        <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={75} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <Environment preset="sunset" />

        {gameStarted && !gameOver && <FlightGame setScore={setScore} endGame={endGame} />}

        {/* Static background elements */}
        <SkyBackground />
      </Canvas>

      {/* UI Overlay */}
      <View style={styles.uiContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          {gameStarted && !gameOver && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Score: {score}</Text>
            </View>
          )}
        </View>

        {!gameStarted && !gameOver && (
          <View style={styles.menuContainer}>
            <Text style={styles.titleText}>Spirit Flight</Text>
            <Text style={styles.instructionText}>
              Help your Spirit Guide collect magical orbs while avoiding obstacles!
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startText}>Start Game</Text>
            </TouchableOpacity>
          </View>
        )}

        {gameOver && (
          <View style={styles.menuContainer}>
            <Text style={styles.titleText}>Game Over</Text>
            <Text style={styles.scoreText}>Final Score: {score}</Text>
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.startButton, styles.secondaryButton]} onPress={() => navigation.goBack()}>
              <Text style={styles.startText}>Return to Sanctuary</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

// Flight Game Component
function FlightGame({ setScore, endGame }) {
  const playerRef = useRef()
  const obstaclesRef = useRef([])
  const collectiblesRef = useRef([])
  const timeRef = useRef(0)
  const { size, camera } = useThree()

  // Game state
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0, 0))
  const [obstacles, setObstacles] = useState([])
  const [collectibles, setCollectibles] = useState([])

  // Initialize game
  useEffect(() => {
    // Create initial obstacles
    const initialObstacles = Array(5)
      .fill()
      .map((_, i) => ({
        id: `obstacle-${i}`,
        position: new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5 + 2, -20 - i * 10),
        scale: 1 + Math.random(),
      }))

    // Create initial collectibles
    const initialCollectibles = Array(10)
      .fill()
      .map((_, i) => ({
        id: `collectible-${i}`,
        position: new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5 + 2, -15 - i * 5),
        collected: false,
      }))

    setObstacles(initialObstacles)
    setCollectibles(initialCollectibles)
  }, [])

  // Handle touch controls
  const handleMove = (dx, dy) => {
    if (playerRef.current) {
      const newPos = playerPosition.clone()
      newPos.x += dx * 0.05
      newPos.y += dy * 0.05

      // Clamp position to game boundaries
      newPos.x = Math.max(-5, Math.min(5, newPos.x))
      newPos.y = Math.max(0, Math.min(5, newPos.y))

      setPlayerPosition(newPos)
    }
  }

  // Game loop
  useFrame((state, delta) => {
    if (!playerRef.current) return

    // Update player position
    playerRef.current.position.copy(playerPosition)

    // Move camera with player (slightly)
    camera.position.x = playerPosition.x * 0.3
    camera.position.y = 2 + playerPosition.y * 0.2

    // Move obstacles and check collisions
    const updatedObstacles = obstacles.map((obstacle) => {
      const newPos = obstacle.position.clone()
      newPos.z += 10 * delta

      // Check collision with player
      if (newPos.distanceTo(playerPosition) < 1.5) {
        endGame()
      }

      // Reset obstacle if it passes the player
      if (newPos.z > 5) {
        newPos.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5 + 2, -50)
      }

      return {
        ...obstacle,
        position: newPos,
      }
    })

    // Move collectibles and check collection
    let scoreIncrement = 0
    const updatedCollectibles = collectibles.map((collectible) => {
      if (collectible.collected) return collectible

      const newPos = collectible.position.clone()
      newPos.z += 8 * delta

      // Check if collected by player
      if (newPos.distanceTo(playerPosition) < 1.5) {
        scoreIncrement += 10
        return {
          ...collectible,
          collected: true,
        }
      }

      // Reset collectible if it passes the player
      if (newPos.z > 5) {
        newPos.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5 + 2, -50)
        return {
          ...collectible,
          position: newPos,
          collected: false,
        }
      }

      return {
        ...collectible,
        position: newPos,
      }
    })

    // Update score
    if (scoreIncrement > 0) {
      setScore((prev) => prev + scoreIncrement)
    }

    // Update game time
    timeRef.current += delta

    // Periodically increase difficulty
    if (Math.floor(timeRef.current) % 10 === 0 && Math.floor(timeRef.current) > 0) {
      // Add new obstacle every 10 seconds
      if (obstacles.length < 10 && Math.floor(timeRef.current) !== Math.floor(timeRef.current - delta)) {
        const newObstacle = {
          id: `obstacle-${obstacles.length}`,
          position: new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5 + 2, -50),
          scale: 1 + Math.random(),
        }
        updatedObstacles.push(newObstacle)
      }
    }

    setObstacles(updatedObstacles)
    setCollectibles(updatedCollectibles)
  })

  return (
    <group>
      {/* Player (Spirit Guide) */}
      <group ref={playerRef} position={playerPosition.toArray()}>
        <mesh castShadow>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color="#9c88ff" emissive="#9c88ff" emissiveIntensity={0.3} />
        </mesh>

        {/* Spirit's ethereal trail */}
        <mesh position={[0, 0, 0.5]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.5, 2, 32]} />
          <meshStandardMaterial
            color="#9c88ff"
            transparent={true}
            opacity={0.6}
            emissive="#9c88ff"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Obstacles */}
      {obstacles.map((obstacle) => (
        <mesh
          key={obstacle.id}
          position={obstacle.position.toArray()}
          scale={[obstacle.scale, obstacle.scale, obstacle.scale]}
          castShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#e84393" />
        </mesh>
      ))}

      {/* Collectibles */}
      {collectibles.map(
        (collectible) =>
          !collectible.collected && (
            <mesh key={collectible.id} position={collectible.position.toArray()} castShadow>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshStandardMaterial color="#ffeaa7" emissive="#ffeaa7" emissiveIntensity={0.5} />
            </mesh>
          ),
      )}

      {/* Touch controls overlay */}
      <mesh
        position={[0, 0, 4]}
        rotation={[0, 0, 0]}
        visible={false}
        onPointerMove={(e) => {
          const { x, y } = e.point
          handleMove(x, y)
        }}
      >
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

// Sky Background Component
function SkyBackground() {
  return (
    <group>
      {/* Distant mountains */}
      <mesh position={[0, -5, -30]} rotation={[0, 0, 0]}>
        <boxGeometry args={[100, 10, 1]} />
        <meshStandardMaterial color="#6c5ce7" />
      </mesh>

      {/* Clouds */}
      {Array(20)
        .fill()
        .map((_, i) => (
          <mesh
            key={`cloud-${i}`}
            position={[(Math.random() - 0.5) * 50, 10 + (Math.random() - 0.5) * 10, -30 - Math.random() * 20]}
          >
            <sphereGeometry args={[2 + Math.random() * 3, 16, 16]} />
            <meshStandardMaterial color="#dfe6e9" transparent opacity={0.8} />
          </mesh>
        ))}

      {/* Stars */}
      {Array(100)
        .fill()
        .map((_, i) => (
          <mesh key={`star-${i}`} position={[(Math.random() - 0.5) * 100, 20 + (Math.random() - 0.5) * 50, -50]}>
            <sphereGeometry args={[0.1 + Math.random() * 0.2, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
          </mesh>
        ))}
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreContainer: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 15,
    padding: 8,
  },
  scoreText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  menuContainer: {
    position: "absolute",
    top: "30%",
    left: "10%",
    width: "80%",
    backgroundColor: "rgba(45, 52, 54, 0.9)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  titleText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  instructionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: "rgba(108, 92, 231, 0.8)",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: "rgba(45, 52, 54, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(108, 92, 231, 0.8)",
  },
  startText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})
