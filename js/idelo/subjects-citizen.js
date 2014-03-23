/*
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;
 
    // an array that will be populated with substring matches
    matches = [];
 
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
 
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        matches.push({ value: str });
      }
    });
 
    cb(matches);
  };
};*/
 
var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

// -------------------

var selectedFilters = [];

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
      var dt = new Date(Date.parse(row.birthDate));
      $("<tr>").append($("<td>").append($("<a>").addClass("subject-new-complaint").attr("href", "#").attr("title", "Lisa uus kaebus").append($("<span>").addClass("glyphicon glyphicon-file"))))
               .append($("<td>").text(row.name))
               .append($("<td>").text(("00" + dt.getDate()).slice(-2) + "." + ("00" + (dt.getMonth() + 1)).slice(-2) + "." + dt.getFullYear()))
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

  $("#event-type-filter").typeahead({
    source: states,
    updater: function (item) {
      if ($.inArray(item, selectedFilters) >= 0) {
        return null;
      }
      if (selectedFilters.length < 1) {
        var activeFilters = $("<div>").attr("id", "active-filters")
                                      .addClass("vspace-5")
                                      .append($("<a>").attr("href", "#")
                                                      .addClass("remove-all")
                                                     .append($("<small>").append("Eemalda kõik filtrid"))
                                                     .click(function () {
                                                        $("#active-filters").remove();
                                                        selectedFilters = [];
                                                     }));
        $("#event-filter").append(activeFilters);
      }
      selectedFilters.push(item);
      $("#event-filter .remove-all").before($("<span>").addClass("label label-info")
                                                         .attr("data-value", item)
                                                         .append(item + " ")
                                                         .append($("<a>").attr("href", "#")
                                                                         .append("&times;")
                                                                         .click(function () {
                                                                           var value = $(this).parent().attr("data-value");
                                                                           selectedFilters.splice($.inArray(value, selectedFilters), 1);
                                                                           $(this).parent().remove();
                                                                           if (selectedFilters.length < 1) {
                                                                             $("#active-filters").remove();
                                                                           }
                                                                           return false;
                                                                         })))
                                      .before(" ");
    }
  }).typeahead();

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
