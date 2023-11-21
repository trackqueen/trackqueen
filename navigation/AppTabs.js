import React from "react"

// Paper
import { BottomNavigation } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

// React Navigation
// https://reactnavigation.org/docs/native-stack-navigator
import { CommonActions } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
const Tabs = createBottomTabNavigator()

// Stacks
import AboutStack from "./AboutStack"
import LyricsStack from "./LyricsStack"
import CommentsStack from "./CommentsStack"
import VideoStack from "./VideoStack"
import DiscoverStack from "./DiscoverStack"

const AppTabs = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        animation: "none",
        headerShown: false,
        lazy: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })

            if (event.defaultPrevented) {
              preventDefault()
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              })
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key]
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 })
            }

            return null
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key]
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title

            return label
          }}
        />
      )}
    >
      <Tabs.Screen
        name="About"
        component={AboutStack}
        options={{
          animation: "none",
          tabBarLabel: "About",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="information" size={size} color={color} />
          },
        }}
      />
      <Tabs.Screen
        name="Lyrics"
        component={LyricsStack}
        options={{
          animation: "none",
          tabBarLabel: "Lyrics",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="music" size={size} color={color} />
          },
        }}
      />
      <Tabs.Screen
        name="Comments"
        component={CommentsStack}
        options={{
          animation: "none",
          tabBarLabel: "Comments",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="chat" size={size} color={color} />
          },
        }}
      />

      <Tabs.Screen
        name="Videos"
        component={VideoStack}
        options={{
          animation: "none",
          tabBarLabel: "Videos",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="video" size={size} color={color} />
          },
        }}
      />

      <Tabs.Screen
        name="Discover"
        component={DiscoverStack}
        options={{
          animation: "none",
          tabBarLabel: "Discover",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="shape" size={size} color={color} />
          },
        }}
      />
    </Tabs.Navigator>
  )
}
export default AppTabs
