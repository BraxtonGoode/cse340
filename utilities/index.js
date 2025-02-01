const inv_Model = require('../models/inventory-model');
const Util = {}

/* *************
* Constructs the nav HTML unordered List
****************** */
Util.getNav = async function(req, res, next) {
    let data = await inv_Model.getClassifications()
    let list = "<ul class='nav_Class'>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

/* ***********************
*Build vehicle Card via HTML
* ************************** */ 
Util.buildVehicleCard = async function(data){
  let card
  if(data.length > 0){
    card = `<div class='inv_grid'>`
    data.forEach(v => {
      card += `<div id="v_img"> <img src='${v.inv_image}' alt='${v.inv_make} ${v.inv_model}'></div>`
      card += '<ul id="inv-card">'
      card += `<li><h3> ${v.inv_make} ${v.inv_model} Details:</h3></li>`
      card += `<li><p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(v.inv_price)}</li>`
      card += `<li><p><strong>Description:</strong> ${v.inv_description}</p></li>`
      card += `<li><p><strong>Color:</strong> ${v.inv_color}</p></li>`
      card += `<li><p><strong>Mileage:</strong> ${v.inv_miles.toLocaleString()}</p></li>`
      card += '</ul>'
    })
    card += `</div>`
  } else { 
    card += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return card
}



// /* ***************************
//  *  Build classifications list
//  * ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await inv_Model.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classification_id" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  
  classificationList += "</select>"
  return classificationList
}



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)




  
module.exports = Util
