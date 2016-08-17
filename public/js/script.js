var mode = "view";
var view = $("#read-view");
var currentId = null;

function notify(type, msg){
  var alert = $("#alert");
  var text  = $("#alert span");
  var close = $("#alert button");

  switch(type){
    case "success":
      alert.css("background-color", "#2ecc71")
      text.text(msg);

      close.css("background-color", "#27ae60");
      break;
    case "error":
      alert.css("background-color", "#e74c3c");
      text.text(msg);

      close.css("background-color", "#c0392b");
      break;
    default:
      alert.css("background-color", "#95a5a6")
      text.text(msg);

      close.css("background-color", "#7f8c8d");
      break;
  }

  alert.fadeIn({duration: 500});
}

function getAllPosts(callback = function(){}){
  var status;
  var posts;

  $.ajax({
    method: "GET",
    url: "/posts/",
    success: function(response){
      if(response.error){
        notify("error", "could not get posts");
        status = 0;
      }
      else{
        posts = response;
        status = 1;
      }
    },
    error: function(xhr, ajaxOptions, thrownError){
      notify("error", thrownError);
      status = 0;
    },
    complete: function(){
      callback(status, posts);
    }
  });
}

function getPost(id, callback = function(){}){
  var status;
  var post;

  $.ajax({
    method: "GET",
    url: "/posts/" + id,
    success: function(response){
      if(response.error){
        notify("error", "could not get post");
        status = 0;
      }
      else{
        status = 1;
        post = response;
      }
    },
    error: function(xhr, ajaxOptions, thrownError){
      notify("error", thrownError);
      status = 0;
    },
    complete: function(){
      callback(status, post);
    }
  });
}

function createPost(title, content, callback = function(){}){
  var status;
  var post;

  title = title.trim();

  $.ajax({
    method: "POST",
    url: "/posts/",
    data: {
      title:   title,
      date:    new Date(),
      content: content
    },
    success: function(response){
      if(response.error){
        notify("error", "could not create post");
        status = 0;
      }
      else{
        notify("success", "'" + response.title + "' has been created!");
        status = 1;
        post = response;
      }
      refresh();
    },
    error: function(xhr, ajaxOptions, thrownError){
      notify("error", thrownError);
      status = 0;
    },
    complete: function(){
      callback(status, post);
    }
  });
}

function updatePost(id, title, content, callback = function(){}){
  var status;
  var post;

  title = title.trim();

  $.ajax({
    method: "PUT",
    url: "/posts/" + id,
    data: {
      title:   title,
      content: content
    },
    success: function(response){
      if(response.error){
        notify("error", "could not update post");
        status = 0;
      }
      else{
        notify("success", "'" + response.title + "' has been updated!");
        status = 1;
        post = response;
      }
      refresh();
    },
    error: function(xhr, ajaxOptions, thrownError){
      notify("error", thrownError);
      status = 0;
    },
    complete: function(){
      callback(status, post);
    }
  });
}

function deletePost(id, callback = function(){}){
  var status = 0;
  var post;

  $.ajax({
    method: "DELETE",
    url: "/posts/" + id,
    success: function(response){
      if(response.error){
        notify("error", "could not delete post");
        status = 0;
      }
      else{
        notify("success", "'" + response.title + "' was deleted!");
        status = 1;
        post = response;
      }
      refresh();
    },
    error: function(xhr, ajaxOptions, thrownError){
      notify("error", thrownError);
      status = 0;
    },
    complete: function(){
      callback(status, post);
    }
  });
}

function changeMode(newMode, id = currentId){
  if((mode === "create" || mode === "update") && newMode === "view"){
    view.fadeOut({duration: 500});
    view = $("#read-view");
    view.delay(500).fadeIn({duration: 500});
  }
  else if(mode === "view" && (newMode === "create" || newMode === "update")){
    view.fadeOut({duration: 500});
    view = $("#edit-view");
    view.delay(500).fadeIn({duration: 500});
  }

  mode = newMode;
  currentId = id;

  loadView();
}

function loadView(callback = function(){}){
  view.find(".title").val("").text("");
  view.find(".content").val("").text("");

  if(currentId){
    getPost(currentId, function(status, post){
      if(status){
        view.find(".title").val(post.title).text(post.title);
        view.find(".content").val(post.content).text(post.content);
      }
      else{
        notify("error", "could not retrieve data from database");
      }
    });
  }

  callback();
}

function refresh(callback = function(){}){
  var posts = getAllPosts(function(status, posts){
    if(status){
      var list = $("<ul id=\"posts\"></ul>");

      for(post in posts){
        var item = $("<li></li>");

        item.attr("data-id", posts[post]["_id"]);
        item.addClass("post");

        var title = $("<h4 class=\"title\"></h4>");
        title.text(posts[post]["title"]);

        var date = $("<p class=\"date\"></p>");
        var postDate = new Date(posts[post]["date"]);

        date.text(postDate.getFullYear() + "." + (parseInt(postDate.getMonth()) + 1) + "." + postDate.getDate());

        var edit = $("<button class=\"edit\"></button>");
        edit.text("edit");

        var close = $("<button class=\"close\"></button>");
        close.html("&#x2715;");

        item.append(title);
        item.append(date);
        item.append(edit);
        item.append(close);

        list.prepend(item);
      }

      $("#posts").replaceWith(list);

      $(".post .title").on("click", function(){
        var id = $(this).parent().attr("data-id");
        changeMode("view", id);
      });

      $(".post .close").on("click", function(){
        var id = $(this).parent().attr("data-id");
        if(currentId === id){
          currentId = "";
          changeMode("view");
        }
        deletePost(id);
      });

      $(".post .edit").on("click", function(){
        var id = $(this).parent().attr("data-id");
        currentId = id;
        changeMode("update", id);
      });
    }
    else{
      notify("error", "could not connect to database");
    }
    callback();
  });
}

$(function(){
  $("#add #create").on("click", function(){
    changeMode("create", "");
  });

  $("#edit-view .submit").on("click", function(){
    if(mode === "update"){
      var title = $("#edit-view .title").val();
      var content = $("#edit-view .content").val();
      updatePost(currentId, title, content, function(status, post){
        if(status){
          changeMode("view");
        }
        else{
          notify("error", "could not update post");
        }
      });
    }
    else if(mode === "create"){
      var title = $("#edit-view .title").val();
      var content = $("#edit-view .content").val();
      createPost(title, content, function(status, post){
        if(status){
          currentId = post["_id"];
          changeMode("view");
        }
        else{
          notify("error", "could not create post");
        }
      });
    }
    else{
      notify("error", "cannot submit when not in update or create mode");
    }
  });

  $("#alert button").on("click", function(){
    $("#alert").fadeOut({duration: 500});
  });

  refresh();
});
