const reviewModel = require("../models/review-model");
const invModel = require("../models/inventory-model");
const reviewFinal = require('./review-final');
const { body, validationResult } = require("express-validator");
const utilities = require(".");
require("dotenv").config();
const Util = {};


/* ***********************
 *Build Reviews Section via html
 * ************************** */
 Util.buildReviewSection = async function (reviewData) {
    let reviews = '';
    let avgRating = 0;
    //  Start building the reviews section 
    if (reviewData.length > 0) {
      reviews += `<section class='reviewSection'>`;
      reviewData.forEach((r)=> {
        avgRating = avgRating + r.review_rating 
      })
      const rating = Math.floor(avgRating / reviewData.length)

      // star average
      let stars = '';
      const filledStarColor = '#551a8b'; // White color for filled stars
      const emptyStarColor = '#808080'; // Grey color for empty stars
      
      for (let i = 0; i < 5; i++) {
        if (i < rating) {
          // Filled star (white color)
          stars += `<span style="color: ${filledStarColor}; font-size: 30px;">&#9733;</span>`;
        } else {
          // Empty star (grey color)
          stars += `<span style="color: ${emptyStarColor}; font-size: 30px;">&#9734;</span>`;
        }
      }

      reviews += '<h2>Reviews Section</h2>';
      reviews += `<p>The average rating for this car is ${stars}`
      reviewData.forEach((r) => {
        let starRating = '';
        const currentrating = r.review_rating; // Assuming the rating is stored in `r.review_rating`
        
        for (let i = 1; i <= 5; i++) {
          if (i <= currentrating) {
            starRating += '&#9733;'; // Filled star
          } else {
            starRating += '&#9734;'; // Empty star
          }
        }
        
        reviews += `<div>`
        reviews += `<h4> ${r.account_firstname[0]}.${r.account_lastname} reviewed on this car and gave it <span style="font-size: 15px;">${starRating}</span> </h4>`
        reviews += `<p> ${r.review_text} </p>`
        reviews += `</div>`
      });
      
      reviews += `</section>`;
    } else {
        reviews += '<h2>Reviews Section</h2>';
        reviews += '<p id="noReviews">No reviews at this time! You can be the first to review though</p>';
    }
    console.log("returning test")
    return reviews;
  };


/*  **********************************
 *  Add new Review Validation Rules
 * ********************************* */
Util.addReviewerRules = () => {
  return [
    // valid review_rating is required
    body("rating")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isInt()
      .withMessage("A Valid rating is required."),

    // valid review_text is required
    body("review_text")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("A Valid review_text is required."),

    // valid account_id id is required
    body("account_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isInt()
      .withMessage("A Valid account_id is required."),

    // valid inv_id is required
    body("inv_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isInt()
      .withMessage("A Valid inv_id is required."),
    
    

  ];
};

/* ******************************
 * Check Reviewer data and return errors or continue on
 * ***************************** */
Util.checkReviewerData = async (req, res, next) => {
  // Directly destructure from req.body
  const { rating, review_text, inv_id, account_id } = req.body;

  console.log('Rating:', rating);
  console.log('Review text:', review_text);
  console.log('Inventory ID:', inv_id);
  console.log('Account ID:', account_id);

  // Error handling
  let errors = [];
  errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const revRating = parseInt(rating);
    const invID = parseInt(inv_id);
    const accountID = parseInt(account_id);

    // Model & data creation
    await reviewModel.addReview({
      revRating,
      review_text, 
      invID,
      accountID,
    });

    const data = await invModel.getVehicleItemsByInvId(invID);
    const reviewerData = await reviewModel.getReviewsByInvId(invID);
    const card = await utilities.buildVehicleCard(data);
    const reviews = await Util.buildReviewSection(reviewerData);

    let nav = await utilities.getNav();
    const invName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
    res.render("./inventory/detail", {
      errors: null,
      title: invName,
      nav,
      card,
      reviews,
      inv_id,
      review_rating: rating,
      review_text,
    });
    return;
  }

  next();
};


module.exports = Util