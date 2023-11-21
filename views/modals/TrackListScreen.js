import React, { useEffect } from "react"
import { View } from "react-native"
import { FlashList } from "@shopify/flash-list"
import PropTypes from "prop-types"

// Paper
import { useTheme } from "react-native-paper"

// Expo
import * as Linking from "expo-linking"

// Components
import Header from "../../components/Header"
import SpotifyButton from "../../components/SpotifyButton"
import Track from "../../components/Track"

// Design
import { baseUnit } from "../../constants/Base"

function TrackListScreen({ route, navigation }) {
  const { colors } = useTheme()

  useEffect(() => {
    navigation.setOptions({
      title: route.params.title,
    })
  }, [navigation, route.params.title])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <FlashList
        contentContainerStyle={{ paddingBottom: baseUnit * 6 }}
        estimatedItemSize={route.params.tracks.length}
        refreshing={false}
        ListHeaderComponent={
          <Header
            buttonTitle={`View on Spotify`}
            type={"spotify"}
            copy={`${route.params.tracks.length} tracks`}
            func={() => Linking.openURL("https://open.spotify.com")}
            border={false}
          />
        }
        ListFooterComponent={
          <View style={{ margin: baseUnit * 2, alignItems: "center" }}>
            <SpotifyButton
              text={"Open Spotify"}
              func={() => Linking.openURL("https://open.spotify.com")}
            />
          </View>
        }
        data={route.params.tracks}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <Track
            artists={item.album.artists}
            coverArt={item.album.images[2].url}
            link={item.external_urls.spotify}
            title={item.name}
          />
        )}
      />
    </View>
  )
}

TrackListScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
}

export default TrackListScreen
