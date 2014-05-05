function setupLogin() {
    $("form#login").validate({
        showErrors: function (errorMap, errorList) {
            $.each(this.validElements(), function (index, element) {
                $(element).parent().removeClass("has-error");
                $(element).data("title", "").tooltip("destroy");
            });

            $.each(errorList, function (index, error) {
                $(error.element).parent().addClass("has-error");
                $(error.element).tooltip("destroy").data("title", error.message).tooltip({ placement: "bottom", trigger: "manual" }).tooltip("show");
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
                        $.removeCookie('name');
                        location = '?page=login_failure';
                    } else {
                        $.cookie('username', result[0].f0);
                        $.cookie('role', result[0].f2);
                        $.cookie('name', result[0].f3);
                        location = '?page=index';
                    }
                },
                async: false
            });

            window.location.href = location;
            return false;
        }
    });

    $("form#login").find("input[type='email']").focus();
}

function clearSession() {
    $.removeCookie('username');
    $.removeCookie('name');
    $.removeCookie('role');
}

function initNavbar(initCallback) {
    $.get('app/views/navbar.htm', function(data) {
        $('body').prepend(data);
        var role = $.cookie('username') ? ($.cookie('role') == 'official' ? 'official' : 'citizen') : 'anonymous';
        $.get('app/views/' + role + '/navbar.htm', function(content) {
            $('#navbar-container').append(content);
            switch (role) {
                case 'official':
                case 'citizen':
                    var $username = $('#button-username');
                    var $children = $username.children();
                    $username.text('');
                    $username.append($children);
                    $username.find('span').after(' ' + ($.cookie('name') || $.cookie('username').substring(0, $.cookie('username').indexOf('@'))) + ' ');

                    $('#button-logout').click(function() {
                        clearSession();
                    });
                    break;
                default:
                    setupLogin();
                    break;
            }
            if (initCallback) {
                initCallback();
            }
        });
    });
}
