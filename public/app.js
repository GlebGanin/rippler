
// First thing: ask the back end for json with all animals
$.getJSON("/all", function(data) {
  // Call our function to generate a table body
  displayResults(data);
});


// We'll be rewriting the table's data frequently, so let's make our code more DRY
// by writing a function that takes in 'animals' (JSON) and creates a table body
function displayResults(rippleNews) {
  // First, empty the table
  $("#results").empty();

  // Then, for each entry of that json...
  rippleNews.forEach(function(item) {
    // Append each of the animal's properties to the table
    $("#results").append("<div id='border'> <div id='title'>" + item.title + "</div>" +
                      "<div id='link'> <a href='www.google.com' target='_blank'>" + item.link + "</a></div></div>" +
                      "<br>");                
  });
};

