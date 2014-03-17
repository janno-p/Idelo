var users = (function () {
  var users = null;
  $.ajax({
    'async': false,
    'global': false,
    'url': 'data/users.json',
    'dataType': 'json',
    'success': function (data) {
      users = data;
    }
  });
  return users;
})();

function setupValidation() {
  $("form#login").validate({
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
                        .tooltip({ placement: "bottom" });
      });
    },

    submitHandler: function (form) {
      var $email = $(form).find("input[type='email']");
      var emailValue = $email.val();
      if (emailValue == users[0].email) {
        window.location.href = "index-citizen.htm";
        return false;
      }
      if (emailValue == users[1].email) {
        window.location.href = "index-official.htm";
        return false;
      }
      $email.parent()
            .addClass("has-error");
      $email.tooltip("destroy")
            .data("title", "Kasutaja sisselogimine ebaõnnestus!")
            .tooltip({ placement: "bottom" });
      $email.focus();
      return false;
    }
  });
}

$(document).ready(function () {
  $.get('partial/navbar.htm', function (data) {
    $('body').prepend(data);
    $.get('partial/navbar-login.htm', function (data) {
      $('#navbar-container').append(data);
      setupValidation();
      $("form#login").find("input[type='email']").focus();
    });
  });
});
