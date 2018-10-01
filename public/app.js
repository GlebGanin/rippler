
// First thing: ask the back end for json with all animals
$.getJSON("/all", function(data) {
  // Call our function to generate a table body
  displayResults(data);
});


function displayResults(rippleNews) {
  // First, empty the table
  $("#results").empty();

  // Then, for each entry of that json...
  rippleNews.forEach(function(item) {
    // Append each of the animal's properties tothe table
    $("#results").append("<ul class='collapsible'>"+
                          "<li>" +
                            "<div id='article_title' class='collapsible-header'>" +
                            "<div id='title'>" + item.title + "</div>" + 
                            
                              "<span class='badge'> Click to Comment </span></div>" +
                            "<div class='collapsible-body'>" +
                            "<center><a id='link_to_article' href="+ item.link+ " target='_blank'>" + "Link to Article" + "</a>" +
                            "<a id='link_to_article' href="+ item.link+ " target='_blank'>" + "Leave Note" + "</a>" +
                            "<a id='link_to_article' href="+ item.link+ " target='_blank'>" + "Delete Article" + "</a> <center>" +
                            "</div>" +
                          "</li>" +
                          "</ul>"); 

      });
    };
   


  
