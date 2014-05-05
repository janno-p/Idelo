$(document).ready(function () {
    initNavbar();
    $.get(templateName, function (data) {
        $('#container').prepend(data);
        Holder.run();
    });
});
