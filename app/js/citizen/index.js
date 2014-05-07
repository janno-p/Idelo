
function fillComplaints (resultSet) {
    var $container = $("#complaints").find("tbody").empty();
    $.each(resultSet.items, function (index, complaint) {
        var dt = new Date(Date.parse(complaint.time));
        var datePart = ("00" + dt.getDate()).slice(-2) + "." + ("00" + (dt.getMonth() + 1)).slice(-2) + "." + dt.getFullYear();
        var timePart = ("00" + dt.getHours()).slice(-2) + ":" + ("00" + dt.getMinutes()).slice(-2);

        var $tags = $("<td>");

        var subjectName = null;
        $.ajax({
            url: 'Kodanik/Otsi?id=' + complaint.subject,
            async: false,
            success: function(content) {
                var resultSet = eval('x=' + content);
                if (resultSet.total > 0) {
                    subjectName = resultSet.items[0].name;
                }
            }
        });

        $.each(complaint.tags, function (jndex, tag) {
            if (jndex > 0) {
                $tags.append(" ");
            }
            $tags.append($("<span>").addClass("label label-info").append(tag));
        });

        var $title = $('<td>').append(complaint.title);
        if (complaint.created_at) {
            var createdAt = new Date(Date.parse(complaint.created_at));
            var within24h = new Date();
            within24h.setDate(within24h.getDate() - 1);
            if (within24h < dt) {
                $title.prepend(' ').prepend($('<span>').addClass('label label-success').append('Uus'));
            }
        }

        $("<tr>").append($title)
                 .append($("<td>").append(datePart + " - " + timePart))
                 .append($("<td>").append(subjectName))
                 .append($tags)
                 .appendTo($container);
    });
}

$(document).ready(function () {
    initNavbar();

    $.get(templateName, function (data) {
        $('#container').prepend(data);
        Holder.run();

        var result = [];
        $.ajax({
            url: 'Kaebus/Otsi?user=' + $.cookie('user-id'),
            async: false,
            success: function(data) {
                result = eval('x=' + data);
            }
        });

        if (result && result.total > 0) {
            $.get('app/views/citizen/complaints.htm', function(content) {
                $('#container h1').after(content);
                fillComplaints(result);
            })
        } else {
            $.get('app/views/citizen/no-complaints.htm', function(content) {
                $('#container h1').after(content);
            })
        }
    });
});
