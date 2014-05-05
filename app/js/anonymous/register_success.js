$(document).ready(function () {
    initNavbar();
    $.get(templateName, function (data) {
        $('#container').prepend(data);
        Holder.run();
        $.get('app/views/anonymous/register_success.htm', function(content) {
            $('div.jumbotron').before(content);
            var emailAddress = getParameter('email');
            if (emailAddress) {
                $('strong.replace-email').text(emailAddress);
            }
        });
    });
});
