const pool = require("../database/")

const Reviews = {}

/* *****************************
 *   Select all reviews inside table
 * *************************** */
Reviews.getReviewsByInvId = async function (inv_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.review AS r
        JOIN public.inventory AS i ON r.inv_id = i.inv_id
        JOIN public.account AS a ON r.account_id = a.account_id
        WHERE r.inv_id = $1`,
        [inv_id]
      )
      return data.rows
    } catch (error) {
      console.error("getReviewsByInvId error " + error)
    }
  }

/* *****************************
 *   Add new reviews
 * *************************** */
Reviews.addReview = async (review_rating, review_text, inv_id, account_id) => {
    try {
console.log("Inserting review with data:", {
      review_rating,
      review_text,
      inv_id,
      account_id
    });
      const sql =
        "INSERT INTO review (review_rating, review_text, inv_id, account_id) VALUES ($1, $2, $3, $4) RETURNING *";
      const Result = await pool.query(sql, [review_rating, review_text, inv_id, account_id]);
      return Result.rows

    } catch (error) {
      return error.message;
    }
  };

module.exports = Reviews

