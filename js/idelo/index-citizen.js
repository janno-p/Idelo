function wireSearchFunc () {
  $("#search-form").find("button").click(function () {
    var searchText = $("#search-form").find("input").val();
    if (searchText == "ei leia") {
      window.location.href = "search-failure.htm";
    //} else if (searchText.contains("")) {
    //  window.location.href = "complex-search-results.htm";
    } else {
      window.location.href = "simple-search-results.htm";
    }
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
});
