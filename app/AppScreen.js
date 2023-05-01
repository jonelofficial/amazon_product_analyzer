import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Image, Keyboard, StyleSheet, View } from "react-native";
import {
  Button,
  HelperText,
  Snackbar,
  Text,
  TextInput,
  withTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import useCrawler from "./hooks/useCrawler";

import Classifier from "classificator";

const AppScreen = ({ theme }) => {
  const [text, setText] = useState("");
  const [isError, setIsError] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const { colors } = theme;

  const { isLoading, getRatingsAndReviews } = useCrawler();

  const classifier = new Classifier();

  // Train the classifier on a dataset of labeled reviews
  classifier.learn("I love this product!", "positive");
  classifier.learn("This product is terrible.", "negative");
  classifier.learn("The product is average.", "neutral");

  const handleAnalyzeBtn = async (url) => {
    Keyboard.dismiss();
    // Regular expression for matching Amazon product URLs
    if (url === "") {
      return setShowSnackbar(true);
    }
    var pattern =
      /^https?:\/\/(?:www\.)?amazon\.com\/(?:[\w-]+\/)?(?:dp|gp\/product)\/([\w]{10})/;

    // Check if the string matches the pattern
    const validUrl = pattern.test(url);
    if (validUrl) {
      const res = await getRatingsAndReviews(url);

      // // Define the stopwords array
      const stopwords = ["this", "is", "the", "a", "an"];

      // Preprocess the reviews by removing stop words and punctuation
      const preprocess = (text) => {
        return text
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .split(" ")
          .filter((word) => {
            return !stopwords.includes(word);
          })
          .join(" ");
      };
      const preprocessedReviews = res.reviews.map(preprocess);

      // Predict the sentiment of each review using the trained classifier
      const predictions = preprocessedReviews.map((review) => {
        return classifier.categorize(review);
      });

      // Compute the overall sentiment score based on the ratings and predictions
      const score = res.ratings.reduce((acc, val, index) => {
        if (predictions[index]?.predictedCategory === "positive") {
          return acc + val;
        } else if (predictions[index]?.predictedCategory === "negative") {
          return acc - val;
        } else {
          return acc;
        }
      }, 0);

      // Display the analysis results
      const totalStars = res.ratings.reduce((a, b) => a + b, 0);
      const overallScore = score / res.reviews.length;
      const avgRatings = totalStars / res.ratings.length;

      console.log({
        "Sentiment predictions": predictions,
        "Avg Ratings": avgRatings,
        "Some reviews": overallScore,
        "Overall score": (avgRatings + overallScore) / 2,
      });
    } else {
      setIsError(true);
    }
  };

  const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.white },
    container: { alignItems: "center" },
    img: { width: 250, height: 150 },
    textInput: { width: "90%" },
    button: {
      borderRadius: 5,
    },
    buttonContent: {
      paddingHorizontal: 15,
      paddingVertical: 3,
    },
  });

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Image source={require("../assets/app-logo.png")} style={styles.img} />
      </View>
      <View style={styles.container}>
        <TextInput
          mode="flat"
          label="Product Link"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          value={text}
          style={styles.textInput}
          onChangeText={(text) => setText(text)}
          right={
            <TextInput.Icon
              icon="close"
              size={20}
              onPress={() => {
                setText("");
                setIsError(false);
              }}
              style={{ display: text ? "flex" : "none" }}
            />
          }
        />
        <HelperText
          type="error"
          visible={isError}
          style={{ color: colors.danger }}
        >
          Not valid amazon product!
        </HelperText>
      </View>

      <View style={[styles.container, { marginBottom: 15 }]}>
        <Button
          uppercase
          mode="contained"
          onPress={() => handleAnalyzeBtn(text)}
          style={styles.button}
          contentStyle={styles.buttonContent}
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Analyzing" : "Analyze"}
        </Button>
      </View>

      {/* SNACKBAR */}

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        action={{
          label: "Close",
          onPress: () => {
            setShowSnackbar(false);
          },
        }}
      >
        Paste amazon product first.
      </Snackbar>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default withTheme(AppScreen);
