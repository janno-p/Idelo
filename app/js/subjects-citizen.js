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

var currentPage = 1;

var filters = loadData("data/actions.json");
var selectedFilters = [];

var subjects = loadData("data/citizens.json");
var selectedSubjects = [];

function wireSearchFunc () {
  $("#search-form").find("button").click(function () {
    var searchText = $("#search-form").find("input").val();
    if (searchText.length < 1) {
      return false;
    } else { //if (searchText == "ei leia") {
      window.location.href = "search-failure.htm";
    //} else if (searchText.contains("")) {
    //  window.location.href = "complex-search-results.htm";
    }/* else {
      window.location.href = "simple-search-results.htm";
    }*/
    return false;
  });
}

function setupValidation() {
  $("form#citizen-form").validate({
    rules: {
      "citizen-birth": {
        dateCheck: true
      }
    },

    showErrors: function (errorMap, errorList) {
      $.each(this.validElements(), function (index, element) {
        $(element).parent()
                  .removeClass("has-error");
        $(element).data("title", "")
                  .tooltip("destroy");
      });

      $.each(errorList, function (index, error) {
        $(error.element).parent()
                        .addClass("has-error");
        $(error.element).tooltip("destroy")
                        .data("title", error.message)
                        .tooltip({ placement: "right", container: "#citizen-form-modal" })
                        .tooltip("show");
      });
    },

    submitHandler: function (form) {
      //window.location.href = "register-success.htm";
      return false;
    }
  });

  $('form#citizen-form input').blur(function () {
    $(this).valid();
  });
}

$(document).ready(function () {
  $.validator.addMethod("dateCheck", function (value, element) {
    var str = $("#citizen-birth").val();
    if (str.length > 10) {
      return false;
    }
    var day = str.substring(0, 2);
    var month = str.substring(3, 5) - 1;
    var year = str.substring(6, 10);
    var s = (new Date(year, month, day)).getTime();
    var o = new Date();
    o.setTime(s);
    if (s > new Date().getTime()) {
      return false;
    }
    if (o.getFullYear() != year || o.getMonth() != month || o.getDate() != day) {
      return false;
    }
    return true;
  }, "Sünnikuupäev ei ole antud sobival kujul.");

  $.get('partial/navbar.htm', function (data) {
    $('body').prepend(data);
    $("a.navbar-brand").attr("href", "index-citizen.htm");
    $.get('partial/navbar-citizen.htm', function (data) {
      $('#navbar-container').append(data);
      $("#navbar-container li > a[href='subjects-citizen.htm']").parent().addClass("active");
      wireSearchFunc();
    });
  });

  function updateSelectedSubjects () {
    selectedSubjects = []
    if (selectedFilters.length > 0) {
      $.each(subjects, function (index, subject) {
        var addSubject = true;
        $.each(selectedFilters, function (index, filter) {
          if ($.inArray(filter, subject.tags) < 0) {
            addSubject = false;
          }
        });
        if (addSubject) {
          selectedSubjects.push(subject);
        }
      });
    }
    if (selectedSubjects.length < 1) {
      selectedSubjects = subjects.slice(0);
    }
    if (selectedSubjects.length == 0) {
      currentPage = 1;
    } else {
      currentPage = Math.min(currentPage, Math.floor((selectedSubjects.length - 1) / 10) + 1);
    }
  }

  function updatePagination() {
    $("ul.pagination li").remove();
    var firstPage = $("<li>");
    if (currentPage == 1) {
      firstPage.addClass("disabled").append($("<span>").append("&laquo;"));
    } else {
      firstPage.append($("<a>").attr("href", "#").append("&laquo;").click(function () {
        currentPage = 1;
        fillSubjects();
      }));
    }
    var numPages = 1;
    if (selectedSubjects.length > 0) {
      numPages = Math.floor((selectedSubjects.length - 1) / 10) + 1;
    }
    var lastPage = $("<li>");
    if (currentPage == numPages) {
      lastPage.addClass("disabled").append($("<span>").append("&raquo;"));
    } else {
      lastPage.append($("<a>").attr("href", "#").append("&raquo;").click(function () {
        currentPage = numPages;
        fillSubjects();
      }));
    }
    $("ul.pagination").append(firstPage);
    for (var i = 1; i <= numPages; i++) {
      var page = $("<li>");
      if (i == currentPage) {
        page.addClass("active");
        page.append($("<span>").append("" + i + " ").append($("<span>").addClass("sr-only").append("(current)")));
      } else {
        page.append($("<a>").attr("href", "#").attr("data-page", "" + i).append("" + i).click(function () {
          currentPage = parseInt($(this).attr("data-page"));
          fillSubjects();
        }));
      }
      $("ul.pagination").append(page);
    }
    $("ul.pagination").append(lastPage);
  }

  function fillModal (subject) {
    var dt = new Date(Date.parse(subject.birthDate));
    $("#citizen-name").val(subject.name);
    $("#citizen-gender-male").prop("checked", subject.gender == "Mees");
    $("#citizen-gender-female").prop("checked", subject.gender == "Naine");
    $("#citizen-birth").val(("00" + dt.getDate()).slice(-2) + "." + ("00" + (dt.getMonth() + 1)).slice(-2) + "." + dt.getFullYear());
    $("#citizen-address").val(subject.address);
  }

  function fillSubjects () {
    updateSelectedSubjects();
    updatePagination();
    var startIndex = ((currentPage - 1) * 10);
    $("#subjects").find("tbody").empty();
    $.each(selectedSubjects.slice(startIndex, startIndex + 10), function (i, row) {
      var dt = new Date(Date.parse(row.birthDate));
      $("<tr>").append($("<td>").append($("<img>").addClass("img-rounded").attr("data-src", "holder.js/100x100").attr("alt", "Pilt")))
               .append($("<td>").append(
                  $("<div>").addClass("dropdown")
                            .append($("<a>").attr("href", "#")
                                            .addClass("dropdown-toggle")
                                            .attr("data-toggle", "dropdown")
                                            .append(row.name + " ")
                                            .append($("<strong>").addClass("caret")))
                            .append($("<ul>").addClass("dropdown-menu")
                                             .append($("<li>").append($("<a>").attr("href", "#").attr("data-index", (startIndex + i)).addClass("modify-citizen").append("Muuda andmeid")))
                                             .append($("<li>").append($("<a>").attr("href", "#").append("Tee kodaniku kohta uus kaebus"))))))
               .append($("<td>").text(("00" + dt.getDate()).slice(-2) + "." + ("00" + (dt.getMonth() + 1)).slice(-2) + "." + dt.getFullYear()))
               .append($("<td>").text(row.gender))
               .append($("<td>").text(row.address))
               .appendTo($("#subjects").find("tbody"));
      Holder.run();
    });
    $("#subjects td a.modify-citizen").click(function () {
      var myIndex = parseInt($(this).attr("data-index"));
      $modal = $("#citizen-form-modal");
      if ($modal.length < 1) {
        $.get('partial/citizen-form.htm', function (data) {
          $('body').append(data);
          $("#select-date").datepicker({
            language: "et",
            startView: 2,
            autoclose: true,
            endDate: new Date()
          }).on("changeDate", function (e) {
            $("#citizen-birth").val(e.format());
            $("form#citizen-form").valid();
          });
          fillModal(selectedSubjects[myIndex]);
          setupValidation();
          $("#citizen-form-modal").modal();
        });
      } else {
        fillModal(selectedSubjects[myIndex]);
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
    source: filters,
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
                                                        fillSubjects();
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
                                                                           fillSubjects();
                                                                           return false;
                                                                         })))
                                      .before(" ");
      fillSubjects();
    }
  }).typeahead();
});
