import React from "react";
import { View } from "react-native";
import { Card, Text, withTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const HowToUse = ({ theme, navigation }) => {
  const { colors } = theme;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={{ paddingHorizontal: 20 }}>
        {/* Steps */}
        <Card>
          <Card.Content>
            <View
              style={{
                gap: 5,
                marginLeft: 10,
              }}
            >
              <Text>
                {"\u2022"} Copy the link to the Amazon product you want to
                analyze.
              </Text>
              <Text>
                {"\u2022"} Open the app and paste the link into the designated
                field.
              </Text>
              <Text>
                {"\u2022"} Click on the "Analyze" button to start the analysis
                process.
              </Text>
              <Text>
                {"\u2022"} Wait for the app to analyze the product, which should
                only take a few seconds.
              </Text>
              <Text>
                {"\u2022"} A pop-up modal will appear on the screen, displaying
                the results of the analysis.
              </Text>
              <Text>
                {"\u2022"} The modal will indicate whether the product is
                recommended for purchase or not. It may also display additional
                information.
              </Text>
              <Text>
                {"\u2022"} If the product is recommended, you can proceed with
                the purchase. If not, you may want to consider other options or
                investigate further before making a purchase.
              </Text>
              <Text>
                {"\u2022"} You can analyze as many Amazon products as you like
                using the same process.
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Disclaimer */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 15,
        }}
      >
        <Text
          style={{
            fontStyle: "italic",
            textAlign: "center",
            fontSize: 13,
            fontWeight: "500",
            color: colors.primary,
          }}
        >
          This app was developed by Jonel Ignacio for entertainment purposes
          only. While we strive to provide accurate and useful information, the
          analysis results should not be relied upon as professional or expert
          advice. We are not affiliated with Amazon or any of its subsidiaries,
          and we do not endorse or promote any specific products or brands. Use
          this app at your own risk, and always conduct your own research before
          making any purchasing decisions.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default withTheme(HowToUse);
