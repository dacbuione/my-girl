"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

export default function HomeScreen() {
  const [spiritData, setSpiritData] = useState({
    name: "Lumina",
    level: 5,
    happiness: 80,
    energy: 65,
    lastInteraction: new Date(Date.now() - 3600000), // 1 hour ago
  })
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spirit Sanctuary</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.spiritCard}>
          <View style={styles.spiritImageContainer}>
            <Image source={require("../../assets/images/spirit-profile.png")} style={styles.spiritImage} />
          </View>

          <Text style={styles.spiritName}>{spiritData.name}</Text>
          <Text style={styles.spiritLevel}>Level {spiritData.level} Spirit Guide</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={20} color="#e84393" />
              <Text style={styles.statLabel}>Happiness</Text>
              <View style={styles.statBar}>
                <View style={[styles.statFill, { width: `${spiritData.happiness}%`, backgroundColor: "#e84393" }]} />
              </View>
              <Text style={styles.statValue}>{spiritData.happiness}%</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="flash" size={20} color="#fdcb6e" />
              <Text style={styles.statLabel}>Energy</Text>
              <View style={styles.statBar}>
                <View style={[styles.statFill, { width: `${spiritData.energy}%`, backgroundColor: "#fdcb6e" }]} />
              </View>
              <Text style={styles.statValue}>{spiritData.energy}%</Text>
            </View>
          </View>

          <Text style={styles.lastSeen}>Last interaction: {formatTimeAgo(spiritData.lastInteraction)}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.mainActionButton} onPress={() => navigation.navigate("Sanctuary")}>
            <Ionicons name="home" size={32} color="#fff" />
            <Text style={styles.mainActionText}>Enter Sanctuary</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryActionButton} onPress={() => navigation.navigate("MiniGame")}>
              <Ionicons name="game-controller" size={24} color="#fff" />
              <Text style={styles.secondaryActionText}>Play Games</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryActionButton} onPress={() => navigation.navigate("AR")}>
              <Ionicons name="cube" size={24} color="#fff" />
              <Text style={styles.secondaryActionText}>AR Mode</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryActionButton} onPress={() => navigation.navigate("Customize")}>
              <Ionicons name="color-palette" size={24} color="#fff" />
              <Text style={styles.secondaryActionText}>Customize</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.journalContainer}>
          <Text style={styles.sectionTitle}>Spirit Journal</Text>

          <View style={styles.journalEntry}>
            <View style={styles.journalHeader}>
              <Text style={styles.journalDate}>Today</Text>
              <View style={styles.journalBadge}>
                <Text style={styles.journalBadgeText}>New!</Text>
              </View>
            </View>
            <Text style={styles.journalText}>
              Lumina learned a new ability today! Your Spirit Guide can now create small light orbs that follow you
              around the Sanctuary.
            </Text>
          </View>

          <View style={styles.journalEntry}>
            <Text style={styles.journalDate}>Yesterday</Text>
            <Text style={styles.journalText}>
              You and Lumina played the flight game and collected 120 magical orbs. Your bond has strengthened!
            </Text>
          </View>

          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>View Full Journal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

// Helper function to format time
function formatTimeAgo(date) {
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffDay > 0) {
    return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`
  } else if (diffHour > 0) {
    return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`
  } else if (diffMin > 0) {
    return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`
  } else {
    return "Just now"
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d3436",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#6c5ce7",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  spiritCard: {
    backgroundColor: "#34495e",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  spiritImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#6c5ce7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#a29bfe",
  },
  spiritImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  spiritName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  spiritLevel: {
    color: "#a29bfe",
    fontSize: 16,
    marginBottom: 15,
  },
  statsContainer: {
    width: "100%",
    marginBottom: 15,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statLabel: {
    color: "#dfe6e9",
    fontSize: 14,
    width: 80,
    marginLeft: 5,
  },
  statBar: {
    flex: 1,
    height: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 5,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  statFill: {
    height: "100%",
    borderRadius: 5,
  },
  statValue: {
    color: "#dfe6e9",
    fontSize: 14,
    width: 40,
    textAlign: "right",
  },
  lastSeen: {
    color: "#dfe6e9",
    fontSize: 12,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  mainActionButton: {
    backgroundColor: "#6c5ce7",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  mainActionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondaryActionButton: {
    backgroundColor: "#34495e",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    width: "31%",
  },
  secondaryActionText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
  journalContainer: {
    backgroundColor: "#34495e",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  journalEntry: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    paddingBottom: 15,
  },
  journalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  journalDate: {
    color: "#a29bfe",
    fontSize: 14,
    fontWeight: "bold",
  },
  journalBadge: {
    backgroundColor: "#6c5ce7",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  journalBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  journalText: {
    color: "#dfe6e9",
    fontSize: 14,
    lineHeight: 20,
  },
  viewMoreButton: {
    alignItems: "center",
    padding: 10,
  },
  viewMoreText: {
    color: "#a29bfe",
    fontSize: 14,
    fontWeight: "bold",
  },
})
