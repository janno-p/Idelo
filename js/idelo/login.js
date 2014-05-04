function setupLoginValidation() {
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
                        .tooltip({ placement: "bottom", trigger: "manual" })
                        .tooltip("show");
      });
    },

    submitHandler: function (form) {
      var $email = $(form).find("input[type='email']");
      var $password = $(form).find("input[type='password']");
      var emailValue = $email.val();
      var password = $password.val();
      var location = '';
      $.ajax({
        url: 'Otsi?table=t0&f0=' + encodeURI(emailValue) + '&f1=' + encodeURI(password),
        success: function (data) {
          var result = eval("x=" + data);
          if (!result || result.length < 1) {
            $.removeCookie('username');
            $.removeCookie('role');
            location = '?page=login-failure';
          } else {
            $.cookie('username', result[0].f0);
            $.cookie('role', result[0].f2);
            location = '?page=index';
          }
        },
        async: false
      });
      window.location.href = location;
      return false;
    }
  });
}

function initializeLogin(callback) {
  $.get('partial/navbar.htm', function (data) {
    $('body').prepend(data);
    $.get('partial/navbar-login.htm', function (data) {
      $('#navbar-container').append(data);
      setupLoginValidation();
      $("form#login").find("input[type='email']").focus();
      if (callback) {
        callback();
      }
    });
  });
}
