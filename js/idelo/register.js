function setupRegisterValidation() {
  $("form#register-form").validate({
    rules: { "register-email": { checkUserExists: true } },

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
                        .tooltip({ placement: "right", trigger: "manual", container: "body" })
                        .tooltip("show");
      });
    },

    submitHandler: function (form) {
      var username = $('#register-email').val();
      var password = $('#register-password').val();
      $.ajax({
        url: 'http://localhost:8083/Salvesta?table=t0&f0=' + encodeURI(username) + '&f1=' + encodeURI(password),
        async: false
       });
      window.location.href = "?page=register-success&email=" + encodeURI(username);
      return false;
    }
  });

  $('form#register-form input').blur(function () {
    $(this).valid();
  });
}

$(document).ready(function () {
  $.validator.addMethod("checkUserExists", function (value, element) {
    var isSuccess = false;
    var username = $('#register-email').val();
    $.ajax({ url: 'http://localhost:8083/Otsi?table=t0&f0='+ encodeURI(username),
             success: function (data) {
                          var result = eval("x=" + data);
                          isSuccess = result.length == 0;
                      },
             async:   false
    });
    return isSuccess;
  }, "Valitud e-posti aadress on juba kasutajaks registreeritud.");

  initializeLogin(function () {
    $.get(templateName, function (data) {
      $('#container').prepend(data);
      setupRegisterValidation();
      $("#register-email").focus();
    });
  });
});
