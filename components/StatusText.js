import React from "react"
import PropTypes from "prop-types"

// Paper
import { Text, useTheme } from "react-native-paper"

// Design
import { baseUnit, verticalRhythm } from "../constants/Base"

const StatusText = ({ content }) => {
  const { colors } = useTheme()

  return (
    <Text
      variant={"titleMedium"}
      style={{
        padding: baseUnit * 2,
        lineHeight: verticalRhythm * 6,
        color: colors.tertiary,
        textAlign: "center",
      }}
    >
      {content}
    </Text>
  )
}

StatusText.propTypes = {
  content: PropTypes.string,
}

export default StatusText
