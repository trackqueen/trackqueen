import React from "react"
import PropTypes from "prop-types"

// React Navigation
// https://reactnavigation.org/docs/native-stack-navigator
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
const Stack = createNativeStackNavigator()

// Expo
import { StatusBar } from "expo-status-bar"

// Screens
import LoadingScreen from "../views/other/LoadingScreen"
import ProfileScreen from "../views/modals/ProfileScreen"
import SoundCheckScreen from "../views/modals/SoundCheckScreen"

// Components
import CustomNavigationBar from "../components/CustomNavigationBar"
import DetailNavigationBar from "../components/DetailNavigationBar"

const LoadingStack = ({ theme }) => {
  return (
    <>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          screenOptions={{
            header: (props) => <CustomNavigationBar {...props} />,
          }}
        >
          <Stack.Screen name="TrackQueen" component={LoadingScreen} />
          <Stack.Screen
            name="Your recent tracks"
            component={ProfileScreen}
            options={{
              header: (props) => <DetailNavigationBar {...props} />,
            }}
          />

          <Stack.Screen
            name="Search nearby audio"
            component={SoundCheckScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  )
}

LoadingStack.propTypes = {
  theme: PropTypes.object,
}

export default LoadingStack
