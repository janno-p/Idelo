
$(document).ready(function () {
    initNavbar();

    $.get(templateName, function (data) {
        $('#container').prepend(data);
        Holder.run();

        var resultSet = null; /*Idelo.execute('Subject/FindComplaint', {
            user: $.cookie('user-id'),
            getrows: Idelo.pageSize
        });*/

        if (resultSet && resultSet.total > 0) {
            $.get('app/views/citizen/results.htm', function(content) {
                $('#container h1').after(content);
                fillComplaints(resultSet);
                updatePager(resultSet, 1);
                initSorting();
            })
        } else {
            $.get('app/views/citizen/no-results.htm', function(content) {
                $('#container h1').after(content);
            })
        }
    });
});
