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
                url: 'User/Auth?email=' + encodeURI(emailValue) + '&password=' + encodeURI(password),
                success: function (data) {
                    var user = eval("x=" + data);
                    if (user) {
                        $.cookie('username', user.Email);
                        $.cookie('role', user.Role);
                        $.cookie('name', user.Name);
                        $.cookie('user-id', user._id.$oid);
                        location = '?page=index';
                    } else {
                        for (var key in $.cookie()) { $.removeCookie(key); }
                        location = '?page=login_failure';
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
            var page = getParameter('page');
            if (!page || page == 'index') {
                $("#navbar-container > div > ul > li > a[href='index.htm']").parent().addClass("active");
            } else {
                $("#navbar-container > div > ul > li > a[href='index.htm?page=" + page + "']").parent().addClass("active");
            }
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
