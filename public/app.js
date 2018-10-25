//POPUP WINDOW:

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("open_comment");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// First thing: ask the back end for json with all animals
$.getJSON("/all", function(data) {
  // Call our function to generate a table body
  displayResults(data);
});

$(document).ready(function() {
  $(".parallax").parallax();
});

// function activate() {
//   $(document).on('click', '#activate', function () {
//     console.log('alert');
//     $('#load_linkedin').removeClass('disabled');
//   });

$(document).on("click", "#load_linkedin", function() {
  $(".progress").css("visibility", "visible");
});

// function displayResults(rippleNews) {
//   // First, empty the table
//   $("#results").empty();

//   // Then, for each entry of that json...
//   rippleNews.forEach(function(item) {
//     // Append each of the animal's properties tothe table
//     $("#results").append("<ul class='collapsible'>"+
//                           "<li>" +
//                             "<div id='article_title' class='collapsible-header'>" +
//                             "<div class='title' id=" + item._id + ">" + item.title + "</div>" +

//                               "<span class='badge'> Click to Comment </span></div>" +
//                             "<div class='collapsible-body'>" +
//                             "<center><button id='link_to_article' onclick='" +item.link+ "' target='_blank'>" + "Link to Article" + "</button>" +
//                             "<button id='open_comment'> Leave Note </button>" +
//                             "<button class='delete' id=" + item._id + ">" + "Delete Article" + "</button> <center>" +
//                             "</div>" +
//                           "</li>" +
//                           "</ul>");

//       });
//     };

//   $(document).on("click", "#add_comment", function() {
//       // AJAX POST call to the submit route on the server
//       // This will take the data from the form and send it to the server
//     $.ajax({
//         type: "POST",
//         dataType: "json",
//         url: "/new_comment",
//         data: {
//           comment: $("#new_comment").val(),
//           created: Date.now()
//         }
//       })

//       .then(function(data) {
//         // Add the title and delete button to the #results section
//           $("#display_comments").prepend(data.comment + "<span class=delete>X</span></p>");
//           // Clear the note and title inputs on the page
//         });
//     });

//     $(document).on("click", ".delete", function() {
//       // Save the p tag that encloses the button
//       var selected = $(this);
//       var delete_selected = $(this).parent().parent().parent().parent();
//       // Make an AJAX GET request to delete the specific note
//       // this uses the data-id of the p-tag, which is linked to the specific note
//       $.ajax({
//         type: "GET",
//         url: "/delete_comment/" + selected.attr("id"),

//         // On successful call
//         success: function(response) {

//           delete_selected.remove();

//         }
//       });
//     });

//     // When the user clicks on the button, open the modal
//   $(document).on('click','#open_comment', function() {
//   modal.style.display = "block";
// });

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//       modal.style.display = "none";
//   }
// }
