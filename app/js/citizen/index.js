$(document).ready(function () {
    initNavbar();

    $.get(templateName, function (data) {
        $('#container').prepend(data);
        Holder.run();

        var result = [];
        $.ajax({
            url: 'Otsi?table=t1&f0=' + $.cookie('username'),
            async: false,
            success: function(data) {
                result = eval('x=' + data);
            }
        });

        if (result && result.length > 0) {
            $.get('app/views/citizen/complaints.htm', function(content) {
                $('#container h1').after(content);
            })
        } else {
            $.get('app/views/citizen/no-complaints.htm', function(content) {
                $('#container h1').after(content);
            })
        }
    });
});
