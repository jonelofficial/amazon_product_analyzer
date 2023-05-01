import axios from "axios";
import * as cheerio from "cheerio";
import { useState } from "react";

const useCrawler = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getRatingsAndReviews = async (userLink) => {
    setIsLoading(true);

    // replace "/dp/" with "/product-reviews/"
    let url = userLink.replace("/dp/", "/product-reviews/");

    // replace the query string with "ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews"
    url = url.replace(
      /ref=.*/,
      "ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews"
    );

    let reviews = [];
    let ratings = [];
    let counter = 0;
    let title = "";
    let imageUrl = "";

    let nextPage = url;

    while (nextPage && counter < 100) {
      const response = await axios.get(nextPage);
      const html = response.data;
      const $ = cheerio.load(html);

      if (!title) {
        title = $("h1.a-size-large a").text().trim();
      }

      if (!imageUrl) {
        imageUrl = $("img[data-hook='cr-product-image']").attr("src");
      }

      // Extract all reviews on the current page
      const pageReviews = $(".review-text-content")
        .map((i, el) => $(el).text().trim())
        .get();
      const pageRatings = $(".review-rating span.a-icon-alt")
        .map((i, el) => {
          const ratingText = $(el).text().trim();
          return parseFloat(ratingText.split(" ")[0]);
        })
        .get();
      reviews.push(...pageReviews);
      ratings.push(...pageRatings);
      counter += pageReviews.length;

      // Check if there is a "Next" button to load the next page of reviews
      const nextButton = $("#cm_cr-pagination_bar .a-last a");
      if (nextButton.length > 0) {
        nextPage = "https://www.amazon.com" + nextButton.attr("href");
      } else {
        nextPage = null;
      }
    }

    setIsLoading(false);
    return { ratings, reviews, title };
  };

  return { getRatingsAndReviews, isLoading };
};

export default useCrawler;
