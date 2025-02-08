'use scrict'

// Get a list of items in inventory based on the classification_id
let classificationList = document.querySelector("#classification_name")

classificationList.addEventListener("change", function(){
    let classification_id = classificationList.value
    console.log(`classification_id is ${classification_id}`)
    let classIdURL = "/inv/getInventory/" +classification_id
    console.log(classIdURL);
    fetch(classIdURL)
    .then(function(response) {
        console.log(response.status); // Log the response status code
        if (response.ok){
            return response.json();
        }
        throw new Error("Network response was not OK");
    })
    .then(function(data){
        console.log(data)
        buildInventoryList(data);
    })
    .catch(function(error){
        console.log("There was a problem: "+ error.message)
    })
})

// Build inventory item into HTML table componenets and inject into DOM
function buildInventoryList(data){
    let inventoryDisplay = document.getElementById("inventoryDisplay")

    // Clear the current content of the inventory display
    inventoryDisplay.innerHTML = ''; 


    // Set up table labels
    let dataTable = "<thead>"
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
    dataTable += '</thead>'
    // Set up table body
    dataTable += '<tbody>';
    // iterate over all vehicles in the array and put each in a row
    data.forEach( function (element)  {
        if (element.inv_id) {
            console.log(element.inv_id + ' ' + element.inv_model);
            dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
            dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
            dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
          }
    });
    dataTable += '</tbody>'
    // Display the conetents in the inventory Management view
    inventoryDisplay.innerHTML = dataTable
}