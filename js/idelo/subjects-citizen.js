var subjects = (function () {
  var subjects = null;
  $.ajax({
    'async': false,
    'global': false,
    'url': 'data/citizens.json',
    'dataType': 'json',
    'success': function (data) {
      subjects = data;
    }
  });
  return subjects;
})();

$(document).ready(function () {
  $.get('partial/navbar.htm', function (data) {
    $('body').prepend(data);
    $("a.navbar-brand").attr("href", "index-citizen.htm");
    $.get('partial/navbar-citizen.htm', function (data) {
      $('#navbar-container').append(data);
    });
  });

  function fillSubjects () {
    $("#subjects").find("tbody").empty();
    $.each(subjects.slice(0,10), function (i, row) {
      $("<tr>").append($("<td>").append($("<a>").addClass("subject-new-complaint").attr("href", "#").attr("title", "Lisa uus kaebus").append($("<span>").addClass("glyphicon glyphicon-file"))))
               .append($("<td>").text(row.name))
               .append($("<td>").text(row.birthDate))
               .append($("<td>").text(row.gender))
               .append($("<td>").text(row.address))
               .appendTo($("#subjects").find("tbody"));
    });
    $("a.subject-new-complaint").click(function () {
      $modal = $("#new-complaint-modal");
      if ($modal.length < 1) {
        $.get('partial/new-complaint.htm', function (data) {
          $('body').append(data);
          $("#new-complaint-modal").modal();
        });
      } else {
        $modal.modal();
      }
    });
  }

  fillSubjects();

  $("a.subject-sort").click(function () {
    var $span = $(this).find("span");
    var className = "glyphicon-sort-by-attributes";
    var asc = true;
    if ($span.hasClass(className)) {
      className += "-alt";
      asc = false;
    }
    $("a.subject-sort").find("span")
                       .removeClass("glyphicon-sort-by-attributes")
                       .removeClass("glyphicon-sort-by-attributes-alt")
                       .addClass("glyphicon-sort");
    $span.addClass(className);
    switch ($(this).attr("data-id")) {
      case "name":
        subjects.sort(function (a, b) {
          return (asc ? 1 : -1) * a.name.localeCompare(b.name);
        });
        break;
      case "birthDate":
        subjects.sort(function (a, b) {
          return (asc ? 1 : -1) * a.birthDate.localeCompare(b.birthDate);
        });
        break;
      case "gender":
        subjects.sort(function (a, b) {
          return (asc ? 1 : -1) * a.gender.localeCompare(b.gender);
        });
        break;
      case "address":
        subjects.sort(function (a, b) {
          return (asc ? 1 : -1) * a.address.localeCompare(b.address);
        });
        break;
    }
    fillSubjects();
  });

  /*
  var $tr =$('<tr>').addClass('header');
        $.each(data.headers, function(i,header){
            $tr.append($('<th>').append($('a').addClass('sort').attr('href','#').append($('span').text(header))));
        });
        $tr.appendTo('table.data');
        $.each(data.rows,function(i,row){
            $('<tr>').attr('id',i).
                append($('<td>').text(row.date)).
                append($('<td>').text(row.company)).
                append($('<td>').text(row.location)).appendTo('table.data');
        });*/
});
