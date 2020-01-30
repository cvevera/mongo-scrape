$.getJSON("/articles", function(data) {

    for (var i = 0; i < data.length; i++) {
      var articleCard = $("<div>");
      articleCard.addClass("card")
      var articleHeading = $("<h3>");
      articleHeading.addClass("card-heading")
      articleHeading.attr("data-id", data[i]._id)
      articleHeading.text(data[i].title);
      var articleImg = $("<img>");
      articleImg.attr("src", data[i].image)
      var articleLink = $("<a>");
      articleLink.attr("href", ("https://www.gamespot.com" + data[i].link));
      articleLink.attr("target", "_blank")
      articleLink.text("www.gamespot.com/" + data[i].link);
      articleCard.append(articleHeading);
      articleCard.append(articleImg);
      
      
      var articleSummary = $("<p>")
      articleSummary.text(data[i].summary);
      articleCard.append(articleSummary);
      articleCard.append(articleLink);

      var commentBtn = $("<h4>")
      commentBtn.text("Comment Here!")
      // commentBtn.addClass("commentbtn")
      commentBtn.attr("data-id", data[i]._id)
      articleCard.append(commentBtn);

      $("#articles").append(articleCard);
      // var comments = $("<div>")
      // comments.attr("id", "comment")
      // articleCard.append(comments)
    }
  });
  
  
  $(document).on("click", "h4", function() {
      console.log("test")
    $("#comment").empty();
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function(data) {
        console.log(data);
        $("#comment").append("<h5>" + "Commenting on: " + data.title + "</h5>");
        $("#comment").append("<h6>" + "Comment Title:" + "</h6>");
        $("#comment").append("<input id='titleinput' name='title' >");
        $("#comment").append("<h6>" + "Comment Body:" + "</h6>");
        $("#comment").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#comment").append("<br>");
        $("#comment").append("<button data-id='" + data._id + "' id='savecomment'>Save comment</button>");
        $("#comment").append("<br>");

        $("#comment").append("<button data-id='" + data._id + "' id='deletecomment'>Delete comment</button>")
        if (data.comment) {
          $("#titleinput").val(data.comment.title);
          $("#bodyinput").val(data.comment.body);
        }
      });
  });
  
  $(document).on("click", "#savecomment", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#comment").empty();
      });

    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  $(document).on("click", "#deletecomment", function() {
    var thisId = $(this).attr("data-id");
    console.log(thisId)
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
          title: "",
          body: "",
      }
    })
      .then(function(data) {
        console.log(data);
        $("#comment").empty();
      });
    });
    
  