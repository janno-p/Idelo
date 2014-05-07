function setupRegistration() {
    $.validator.addMethod("checkUserExists", function (value, element) {
        var isSuccess = false;
        var username = $('#register-email').val();
        $.ajax({
            url: 'Kasutaja/Otsi?username='+ encodeURI(username),
            success: function (data) {
                var result = eval("x=" + data);
                isSuccess = result.total == 0;
            },
            async:   false
        });
        return isSuccess;
    }, "Valitud e-posti aadress on juba kasutajaks registreeritud.");

    $("form#register-form").validate({
        rules: { "register-email": { checkUserExists: true } },

        showErrors: function (errorMap, errorList) {
            $.each(this.validElements(), function (index, element) {
                $(element).closest('.form-group').removeClass("has-error");
                $(element).closest('.col-sm-5').data("title", "").tooltip("destroy");
            });

            $.each(errorList, function (index, error) {
                $(error.element).closest('.form-group').addClass("has-error");
                $(error.element).closest('.col-sm-5').tooltip("destroy").data("title", error.message).tooltip({ placement: "right", trigger: "manual", container: "body" }).tooltip("show");
            });
        },

        submitHandler: function (form) {
            var username = $('#register-email').val();
            var password = $('#register-password').val();

            $.ajax({
                url: 'Kasutaja/Salvesta?username=' + encodeURI(username) + '&password=' + encodeURI(password),
                async: false
            });

            window.location.href = "?page=register_success&email=" + encodeURI(username);
            return false;
        }
    });

    $('form#register-form input').blur(function () {
        $(this).valid();
    });

    $("#register-email").focus();
}

$(document).ready(function () {
    initNavbar(function () {
        $.get(templateName, function (data) {
            $('#container').prepend(data);
            setupRegistration();
        });
    });
});
