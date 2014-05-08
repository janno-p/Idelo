
function setComplaintsPage(pageNum) {
    var resultSet = Idelo.query('Kaebus', {
        user: $.cookie('user-id'),
        getrows: Idelo.pageSize,
        fromrow: ((pageNum - 1) * Idelo.pageSize)
    });

    fillComplaints(resultSet);
    updatePager(resultSet, pageNum);
}

function createPagerItem(selectedPage, i) {
    if (selectedPage == i) {
        return $('<li>').addClass('active').append($('<span>').append('' + i + ' ').append($('<span>').addClass('sr-only').append('(current)')))
    }
    return $('<li>').append($('<a>').attr('href', '#').attr('data-page', ''+ i).append('' + i).click(function() {
        setComplaintsPage(i);
        return false;
    }));
}

function updatePager(resultSet, currentPage) {
    var $pager = $('#complaints-pager');
    var $list = $pager.find('ul').empty();

    $list.append(
        currentPage == 1
            ? ($('<li>').addClass('disabled').append($('<span>').append('&laquo;')))
            : ($('<li>').append($('<a>').attr('href', '#').append('&laquo;').click(function() {
                setComplaintsPage(1);
                return false;
            })))
            );

    var numPages = Math.floor((resultSet.total - 1) / Idelo.pageSize) + 1;
    for (var i = 1; i <= numPages; i++) {
        $list.append(createPagerItem(currentPage, i));
    }

    $list.append(
        currentPage == numPages
            ? ($('<li>').addClass('disabled').append($('<span>').append('&raquo;')))
            : ($('<li>').append($('<a>').attr('href', '#').append('&raquo;').click(function() {
                setComplaintsPage(numPages);
                return false;
            })))
            );

    if ($list.find('li').length > 0) {
        $pager.show();
    } else {
        $pager.hide();
    }
}

function fillComplaints (resultSet) {
    var $container = $("#complaints").find("tbody").empty();
    $.each(resultSet.items, function (index, complaint) {
        var dt = new Date(Date.parse(complaint.time));
        var datePart = ("00" + dt.getDate()).slice(-2) + "." + ("00" + (dt.getMonth() + 1)).slice(-2) + "." + dt.getFullYear();
        var timePart = ("00" + dt.getHours()).slice(-2) + ":" + ("00" + dt.getMinutes()).slice(-2);

        var $tags = $("<td>");

        var subjectName = Idelo.queryOne('Kodanik', { id: complaint.subject });

        $.each(complaint.tags, function (jndex, tag) {
            if (jndex > 0) {
                $tags.append(" ");
            }
            $tags.append($("<span>").addClass("label label-info").append(tag));
        });

        var $title = $('<td>').append(complaint.title);
        if (complaint.created_at) {
            var createdAt = new Date(Date.parse(complaint.created_at));
            var createdAtValidTo = new Date();
            createdAtValidTo.setDate(createdAt.getDate() + 1);
            if (new Date() < createdAtValidTo) {
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

        var resultSet = Idelo.query('Kaebus', {
            user: $.cookie('user-id'),
            getrows: Idelo.pageSize
        });

        if (resultSet && resultSet.total > 0) {
            $.get('app/views/citizen/complaints.htm', function(content) {
                $('#container h1').after(content);
                fillComplaints(resultSet);
                updatePager(resultSet, 1);
            })
        } else {
            $.get('app/views/citizen/no-complaints.htm', function(content) {
                $('#container h1').after(content);
            })
        }
    });
});
