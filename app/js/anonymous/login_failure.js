$(document).ready(function () {
    initNavbar();
    $.get(templateName, function (data) {
        $('#container').prepend(data);
        Holder.run();
        $.get('app/views/anonymous/login_failure.htm', function(content) {
            $('div.jumbotron').before(content);
        });
    });
});
