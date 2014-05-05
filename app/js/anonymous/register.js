function setupRegistration() {
    $.validator.addMethod("checkUserExists", function (value, element) {
        var isSuccess = false;
        var username = $('#register-email').val();
        $.ajax({
            url: 'Otsi?table=t0&f0='+ encodeURI(username),
            success: function (data) {
                var result = eval("x=" + data);
                isSuccess = result.length == 0;
            },
            async:   false
        });
        return isSuccess;
    }, "Valitud e-posti aadress on juba kasutajaks registreeritud.");

    $("form#register-form").validate({
        rules: { "register-email": { checkUserExists: true } },

        showErrors: function (errorMap, errorList) {
            $.each(this.validElements(), function (index, element) {
                $(element).parent().removeClass("has-error");
                $(element).data("title", "").tooltip("destroy");
            });

            $.each(errorList, function (index, error) {
                $(error.element).parent().addClass("has-error");
                $(error.element).tooltip("destroy").data("title", error.message).tooltip({ placement: "right", trigger: "manual", container: "body" }).tooltip("show");
            });
        },

        submitHandler: function (form) {
            var username = $('#register-email').val();
            var password = $('#register-password').val();

            $.ajax({
                url: 'Salvesta?table=t0&f0=' + encodeURI(username) + '&f1=' + encodeURI(password),
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