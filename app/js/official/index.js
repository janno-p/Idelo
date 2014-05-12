
function setPage(pageNum) {
    $('#subjects').attr('data-page', pageNum);
}

function refreshSubjectsView() {
    var $table = $('#subjects');
    var pageNum = $table.attr('data-page');
    var resultSet = Idelo.execute('Subject/FindAll', {
        getrows: Idelo.pageSize,
        fromrow: ((pageNum - 1) * Idelo.pageSize),
        order: $table.attr('data-sort-field'),
        direction: $table.attr('data-sort-direction')
    });
    fillSubjects(resultSet);
    updatePager(resultSet, pageNum);
}

function createPagerItem(selectedPage, i) {
    if (selectedPage == i) {
        return $('<li>').addClass('active').append($('<span>').append('' + i + ' ').append($('<span>').addClass('sr-only').append('(current)')))
    }
    return $('<li>').append($('<a>').attr('href', '#').attr('data-page', ''+ i).append('' + i).click(function() {
        setPage(i);
        refreshSubjectsView();
        return false;
    }));
}

function updatePager(resultSet, currentPage) {
    var $pager = $('#subjects-pager');
    var $list = $pager.find('ul').empty();

    $list.append(
        currentPage == 1
            ? ($('<li>').addClass('disabled').append($('<span>').append('&laquo;')))
            : ($('<li>').append($('<a>').attr('href', '#').append('&laquo;').click(function() {
                setPage(1);
                refreshSubjectsView();
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
                setPage(numPages);
                refreshSubjectsView();
                return false;
            })))
            );

    if ($list.find('li').length > 3) {
        $pager.show();
    } else {
        $pager.hide();
    }
}

function formatDate(date, withTime) {
    if (date) {
        var datePart = ('00' + date.getDate()).slice(-2) + '.' + ('00' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
        if (withTime) {
            return datePart + " - " + ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2);
        } else {
            return datePart;
        }
    } else {
        return '-';
    }
}

function fillSubjects (resultSet) {
    var $container = $("#subjects").find("tbody").empty();
    $.each(resultSet.items, function (index, item) {
        var subject = item.Subject;
        var birthDate = subject.BirthDate ? new Date(subject.BirthDate.$date) : null;

        var $birthDate = $('<td>');
        if (birthDate) {
            $birthDate.append(formatDate(birthDate));
        } else {
            $birthDate.append('-');
        }

        var $gender = $('<td>');
        switch (subject.Gender) {
            case 'male': $gender.append('Mees'); break;
            case 'female': $gender.append('Naine'); break;
            default: $gender.append('-'); break;
        }

        $("<tr>").append($('<td>').append(subject.Name))
                 .append($birthDate)
                 .append($gender)
                 .append($('<td>').append(subject.Address ? subject.Address : '-'))
                 .append($('<td>').append('' + item.NumComplaints))
                 .append($('<td>').append(item.LatestComplaint ? formatDate(new Date(item.LatestComplaint.$date), true) : '-'))
                 .appendTo($container);
    });
}

function initSorting() {
    var $table = $('#subjects');
    $table.find('.subject-sort').click(function() {
        var sortField = $(this).attr('data-id');
        var currentField = $table.attr('data-sort-field');
        var sortDirection = 'asc';
        if (sortField == currentField) {
            sortDirection = ($table.attr('data-sort-direction') == 'asc') ? 'desc' : 'asc';
        }
        $table.attr('data-sort-field', sortField).attr('data-sort-direction', sortDirection);
        $table.find('.subject-sort i').removeClass('fa-sort-asc fa-sort-desc').addClass('fa-sort');
        $(this).find('i').removeClass('fa-sort').addClass(sortDirection == 'asc' ? 'fa-sort-desc' : 'fa-sort-asc');
        setPage(1);
        refreshSubjectsView();
        return false;
    });
}

$(document).ready(function () {
    initNavbar();

    $.get(templateName, function (data) {
        $('#container').prepend(data);
        Holder.run();

        var resultSet = Idelo.execute('Subject/FindAll', {});

        if (resultSet && resultSet.total > 0) {
            $.get('app/views/official/subjects.htm', function(content) {
                $('#container h1').after(content);
                fillSubjects(resultSet);
                updatePager(resultSet, 1);
                initSorting();
            })
        } else {
            $.get('app/views/official/no-subjects.htm', function(content) {
                $('#container h1').after(content);
            })
        }
    });
});
