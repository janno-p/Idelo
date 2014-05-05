function loadData (url) {
  var data = (function () {
    var data = null;
    $.ajax({
      'async': false,
      'global': false,
      'url': url,
      'dataType': 'json',
      'success': function (d) {
        data = d;
      }
    });
    return data;
  })();
  return data;
}

var subjects = loadData("data/citizens.json");
var complaints = loadData("data/complaints.json");

function wireSearchFunc () {
  $("#search-form").find("button").click(function () {
    var searchText = $("#search-form").find("input").val();
    if (searchText.length < 1) {
      return false;
    } else { //if (searchText == "ei leia") {
      window.location.href = "search-failure.htm";
    //} else if (searchText.contains("")) {
    //  window.location.href = "complex-search-results.htm";
    } /*else {
      window.location.href = "simple-search-results.htm";
    }*/
    return false;
  });
}

$(document).ready(function () {
  $.get('partial/navbar.htm', function (data) {
    $('body').prepend(data);
    $("a.navbar-brand").attr("href", "index-citizen.htm");
    $.get('partial/navbar-citizen.htm', function (data) {
      $('#navbar-container').append(data);
      $("#navbar-container li > a[href='index-citizen.htm']").parent().addClass("active");
      wireSearchFunc();
    });
  });

  function fillSubjects () {
    $("#complaints").find("tbody").empty();
    $.each(complaints, function (index, complaint) {
      var dt = new Date(Date.parse(complaint.date));
      var datePart = ("00" + dt.getDate()).slice(-2) + "." + ("00" + (dt.getMonth() + 1)).slice(-2) + "." + dt.getFullYear();
      var timePart = ("00" + dt.getHours()).slice(-2) + ":" + ("00" + dt.getMinutes()).slice(-2);

      var $tags = $("<td>");
      $.each(complaint.tags, function (jndex, tag) {
        if (jndex > 0) {
          $tags.append(" ");
        }
        $tags.append($("<span>").addClass("label label-info").append(tag));
      });

      $("<tr>").append($("<td>").append(complaint.title))
               .append($("<td>").append(datePart + " - " + timePart))
               .append($("<td>").append($.grep(subjects, function (x) { return x.id == complaint.citizenId; })[0].name))
               .append($tags)
               .appendTo($("#complaints").find("tbody"));
    });
  }

  fillSubjects();

  $("a.complaint-sort").click(function () {
    var $span = $(this).find("span");
    var className = "glyphicon-sort-by-attributes";
    var asc = true;
    if ($span.hasClass(className)) {
      className += "-alt";
      asc = false;
    }
    $("a.complaint-sort").find("span")
                       .removeClass("glyphicon-sort-by-attributes")
                       .removeClass("glyphicon-sort-by-attributes-alt")
                       .addClass("glyphicon-sort");
    $span.addClass(className);
    switch ($(this).attr("data-id")) {
      case "title":
        complaints.sort(function (a, b) {
          return (asc ? 1 : -1) * a.title.localeCompare(b.title);
        });
        break;
      case "date":
        complaints.sort(function (a, b) {
          return (asc ? 1 : -1) * a.date.localeCompare(b.date);
        });
        break;
      case "subject":
        complaints.sort(function (a, b) {
          var n1 = $.grep(subjects, function (x) { return x.id == a.citizenId; })[0].name;
          var n2 = $.grep(subjects, function (x) { return x.id == b.citizenId; })[0].name;
          return (asc ? 1 : -1) * n1.localeCompare(n2);
        });
        break;
    }
    fillSubjects();
  });
});
