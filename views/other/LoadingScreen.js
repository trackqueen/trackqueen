import React, { useContext, useEffect, useRef, useState } from "react"
import { AppState, RefreshControl, ScrollView, View } from "react-native"
import { useQuery, useQueryClient } from "@tanstack/react-query"

// Expo
import * as Linking from "expo-linking"

// Context
import SpotifyContext from "../../context/spotify"

// Services
import SpotifyCurrentTrack from "../../services/Spotify/getCurrentTrack"
import TokenCheck from "../../services/Custom/checkToken"

// Components
import Spinner from "../../components/Spinner"

// Paper
import { Button, useTheme, Text } from "react-native-paper"

// Design
import { baseUnit, verticalRhythm } from "../../constants/Base"

function LoadingScreen() {
  const { colors } = useTheme()
  const queryClient = useQueryClient()
  const spotifyContext = useContext(SpotifyContext)

  // AppState listener : https://reactnative.dev/docs/appstate
  const appState = useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)

  // State
  let [refreshing, setRefreshing] = useState(false)

  // Check current track function
  useQuery({
    queryKey: ["Check-current-track"],
    queryFn: async ({ signal }) => {
      return new Promise((resolve, reject) => {
        async function init() {
          try {
            let authToken = await TokenCheck(signal)
            let spotifyData = await SpotifyCurrentTrack(authToken, signal)
            resolve(spotifyData)
          } catch (error) {
            reject(error)
          }
        }
        init()
      })
    },
    refetchOnMount: true,
    keepPreviousData: false,
    enabled: false,
    retry: false,
    onError: (error) => {
      setRefreshing(false)
      console.error("Error on query for LoadingScreen", error)
      console.log("appStateVisible : ", appStateVisible)
    },
    onSuccess: (data) => {
      setRefreshing(false)
      // Update the app
      spotifyContext.updateTrack({
        track: data.name,
        artist: data.artists[0].name,
        spotifyData: data,
      })
    },
  })

  // Cancel query if app is closed
  // Restart query when back
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        setRefreshing(false)
        queryClient.resetQueries({
          queryKey: ["Check-current-track"],
        })
      } else {
        setRefreshing(false)
        queryClient.cancelQueries({
          queryKey: ["Check-current-track"],
        })
      }

      appState.current = nextAppState
      setAppStateVisible(appState.current)
    })

    return () => {
      setRefreshing(false)
      subscription.remove()
    }
  }, [queryClient])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            title="Checking your current Spotify track..."
            tintColor={colors.primary}
            titleColor={colors.primary}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true)
              queryClient.fetchQuery({
                queryKey: ["Check-current-track"],
              })
            }}
          />
        }
      >
        <Spinner />

        <View
          style={{
            gap: baseUnit * 4,
            padding: baseUnit * 4,
            alignItems: "center",
          }}
        >
          <View
            style={{
              gap: verticalRhythm * 2,
              alignItems: "center",
            }}
          >
            <Text
              variant="headlineSmall"
              style={{ color: colors.onSurface, fontWeight: 600 }}
            >
              Play a song with Spotify
            </Text>
            <Text
              variant="labelLarge"
              style={{ color: colors.tertiary, fontWeight: 500 }}
            >
              {" "}
              Pull down to refresh.
            </Text>
          </View>

          <Button
            icon={"spotify"}
            mode={"outlined"}
            accessibilityLabel={"Open Spotify"}
            textColor={colors.onSecondaryContainer}
            rippleColor={colors.tertiary}
            onPress={() => Linking.openURL("https://open.spotify.com")}
          >
            Open Spotify
          </Button>
        </View>
      </ScrollView>
    </View>
  )
}

export default LoadingScreen
