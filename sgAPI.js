var buttons = ["sports", 
               "hockey", 
               "football",
               "basketball",
               "mma"
               ];



$(document).ready(function(){

var $buttonDiv = $("#buttons");
var $display = $("#display");
var zipcode = 75238;
var id = 	'MzI4Mzc0M3wxNTU1NTUzMjg4LjU3';

//Renders buttons -------------------------------------------------------------------
function renderButtons(){
    $buttonDiv.empty();
    console.log("renderButtons");

    buttons.forEach(function(subject,i){
        console.log(subject);
        // $display.text("Hello Computer");
        var $newBtn = $("<button>");
        $newBtn.addClass("btn");
        $newBtn.addClass("btn-outline-primary");
        $newBtn.attr("data-value",subject);
        $newBtn.attr("index",i);
        $newBtn.text(subject);
        $newBtn.addClass("myButton");

        $buttonDiv.append($newBtn);
        // $display.append($newBtn);
    });
};

//Button Click Handler ------------------------------------------------
$buttonDiv.on("click", ".myButton", function(){
    console.log("click button");
    $("#display").empty();
  
    // Grabbing and storing the data-value property value from the button
    var newSubject = $(this).attr("data-value");

    displayResults(newSubject);
});

//display events in Dallas, shows 10 events ------------------------------------------------
function displayResults(newSubject){
    // Constructing a queryURL using the animal name
    
    var queryURL = 'http://api.seatgeek.com/2/events?client_id=' + id + '&taxonomies.name=' + newSubject + '&postal_code=' + zipcode;

      //Update the resultsHeading
      $("#resultsHeading").empty();
      $("#resultsHeading").html('<span>Showing 10 results for : ' + newSubject + ' in Zipcode ' + zipcode + '<button class="btn btn-outline-secondary btn-sm" id="deleteBtn" data-value="'+newSubject+'">Delete button</button>');


    // Performing an AJAX request with the queryURL
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // After data comes back from the request
      .then(function(response) {
        console.log(queryURL);

        console.log(response);
        // storing the data from the AJAX request in the results variable
        var results = response;

        // Looping through each result item
        for (var i = 0; i < results.events.length; i++) {

          // Creating a paragraph tag with the result item's rating
          var p = $("<p>");
           p.html('<br>' + (i+1) + '. ' + results.events[i].short_title);
           p.append(" @ ");
           p.append(results.events[i].venue.name);
           p.append(" on ");
           p.append(results.events[i].datetime_local);
           p.append(" Latitude : ");
           p.append(results.events[i].venue.location.lat);
           p.append(" Longitude : ");
           p.append(results.events[i].venue.location.lon);
           p.attr("id", "newSearch");
           $display.append(p);
        }
        
      });
};

//display gifs, shows 10 GIFs ------------------------------------------------
function createPullDown(){
    // Constructing a queryURL using the animal name
    var queryURL = 'https://api.seatgeek.com/2/taxonomies?client_id=' + id;
    
    // Performing an AJAX request with the queryURL
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // After data comes back from the request
      .then(function(response) {
        console.log(queryURL);

        console.log(response);
        // storing the data from the AJAX request in the results variable
        var results = response;

        // Looping through each result item
        for (var i = 0; i < results.taxonomies.length; i++) {

          // Creating and storing a div tag
          var dropDownList = $("#taxonomies");
         
          // Creating a paragraph tag with the result item's rating
          var p = $("<option>");
           p.attr("data-value", response.taxonomies[i].name);
           p.text(response.taxonomies[i].name);
           dropDownList.prepend(p);

           console.log(response.taxonomies[i].name);
    
        }
      });
};





//Adds new Button ----------------------------------------------------------------------------
$("#addButton").on("click", function(){
    event.preventDefault();
    var taxonomy = $('#taxonomies').find(":selected").text();
    console.log("new search");
    if(buttons.indexOf(taxonomy) < 0){
    buttons.push(taxonomy);
    renderButtons();
    displayResults(taxonomy);
    } else {
      //invalid entry
      alert("Please enter a valid entry.");
    }

});

//Deletes  Button ----------------------------------------------------------------------------
$("#resultsHeading").on("click","#deleteBtn", function(){
  event.preventDefault();
  console.log("delete button " + $(this).attr("data-value") + " at position: " +$(this).attr("index"));
  
  var myIndex = buttons.indexOf($(this).attr("data-value"));

  buttons.splice(myIndex,1);
  renderButtons();
  $("#resultsHeading").empty();
  $("#resultsHeading").html('<span>Showing 10 results for : ' + $(this).attr("data-value"));

});

renderButtons();
displayResults("sports");
createPullDown();
}); // END OF document.ready()


