$(document).ready(function () {
    initNavbar();

    $.get(templateName, function (data) {
        $('#container').prepend(data);
        Holder.run();

        var result = [];
        $.ajax({
            url: 'Kaebus/Otsi',
            async: false,
            success: function(data) {
                result = eval('x=' + data);
            }
        });

        if (result && result.total > 0) {
            $.get('app/views/official/complaints.htm', function(content) {
                $('#container h1').after(content);
            })
        } else {
            $.get('app/views/official/no-complaints.htm', function(content) {
                $('#container h1').after(content);
            })
        }
    });
});
