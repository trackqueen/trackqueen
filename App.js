// React
import "react-native-gesture-handler"
import React, { useEffect, useMemo, useReducer } from "react"
import { useColorScheme } from "react-native"

// Paper
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper"
import { useMaterial3Theme } from "@pchmn/expo-material3-theme"

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
const queryClient = new QueryClient()

// Expo
import * as SecureStore from "expo-secure-store"
import * as SplashScreen from "expo-splash-screen"

// Reducer
import ReducedConfig from "./utility/ReducedConfig.js"

// Context
import AuthContext from "./context/auth.js"
import SpotifyContext from "./context/spotify"

// Services
import { getSecureValue } from "./utility/SecureStore"

// Navigation
import AppNavigation from "./navigation/AppNavigation"
import LoginStack from "./navigation/LoginStack.js"
import LoadingStack from "./navigation/LoadingStack.js"

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [state, dispatch] = useReducer(ReducedConfig, {
    isSignedIn: false,
    userToken: null,
    currentlyPlaying: {
      track: null,
      artist: null,
      spotifyData: null,
    },
  })

  const authContext = useMemo(
    () => ({
      signIn: async (loginResults) => {
        if (loginResults !== "Login attempt canceled") {
          dispatch({ type: "SIGN_IN", token: loginResults })
        }
      },
      signOut: async () => {
        await SecureStore.deleteItemAsync("spotifyToken")
        await SecureStore.deleteItemAsync("spotifyRefreshToken")
        dispatch({ type: "SIGN_OUT" })
      },
    }),
    []
  )

  const spotifyContext = useMemo(
    () => ({
      currentlyPlaying: state.currentlyPlaying,
      updateTrack: async ({ track, artist, spotifyData }) => {
        dispatch({
          type: "UPDATE_TRACK",
          track: track,
          artist: artist,
          spotifyData: spotifyData,
        })
      },
    }),
    [state.currentlyPlaying]
  )

  useEffect(() => {
    function timeout(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    }

    const checkToken = async function () {
      try {
        const accessToken = await getSecureValue("spotifyToken")

        if (accessToken !== null) {
          dispatch({
            type: "UPDATE_TOKEN_BOOTSTRAP",
            token: accessToken,
          })
          await timeout(2000)
          await SplashScreen.hideAsync()
        } else {
          await timeout(2000)
          await SplashScreen.hideAsync()
          return true
        }
      } catch (error) {
        console.error(error)
      }
    }
    checkToken()
  }, [])

  const { isSignedIn, currentlyPlaying } = state

  // Theme merging with React Navigation and Paper
  const colorScheme = useColorScheme()
  const { theme } = useMaterial3Theme()
  const paperTheme = useMemo(
    () =>
      colorScheme === "dark"
        ? { ...MD3DarkTheme, colors: theme.dark }
        : { ...MD3LightTheme, colors: theme.light },
    [colorScheme, theme]
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authContext}>
        <SpotifyContext.Provider value={spotifyContext}>
          <PaperProvider theme={paperTheme}>
            {!isSignedIn && <LoginStack theme={paperTheme} />}
            {isSignedIn && currentlyPlaying.track === null && (
              <LoadingStack theme={paperTheme} />
            )}
            {isSignedIn && currentlyPlaying.track !== null && (
              <AppNavigation theme={paperTheme} />
            )}
          </PaperProvider>
        </SpotifyContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  )
}
