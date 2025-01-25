/**********************
 * This controller is setup to create an Error
 ********************* */
const causeError = async function(req, res, next) {
    console.log("Causing an error...");
    const error = new Error("Something went wrong!");
    error.status = 500;
    next(error); // Pass the error to the error handling middleware
}

module.exports = causeError;