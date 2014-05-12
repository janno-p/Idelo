
function setPage(pageNum) {
    $('#tags').attr('data-page', pageNum);
}

function refreshTagsView() {
    var $table = $('#tags');
    var pageNum = $table.attr('data-page');
    var resultSet = Idelo.execute('Tags/Find', {
        getrows: Idelo.pageSize,
        fromrow: ((pageNum - 1) * Idelo.pageSize),
        order: $table.attr('data-sort-field'),
        direction: $table.attr('data-sort-direction')
    });
    fillTags(resultSet);
    updatePager(resultSet, pageNum);
}

function createPagerItem(selectedPage, i) {
    if (selectedPage == i) {
        return $('<li>').addClass('active').append($('<span>').append('' + i + ' ').append($('<span>').addClass('sr-only').append('(current)')))
    }
    return $('<li>').append($('<a>').attr('href', '#').attr('data-page', ''+ i).append('' + i).click(function() {
        setPage(i);
        refreshTagsView();
        return false;
    }));
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

function updatePager(resultSet, currentPage) {
    var $pager = $('#tags-pager');
    var $list = $pager.find('ul').empty();

    $list.append(
        currentPage == 1
            ? ($('<li>').addClass('disabled').append($('<span>').append('&laquo;')))
            : ($('<li>').append($('<a>').attr('href', '#').append('&laquo;').click(function() {
                setPage(1);
                refreshTagsView();
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
                refreshTagsView();
                return false;
            })))
            );

    if ($list.find('li').length > 3) {
        $pager.show();
    } else {
        $pager.hide();
    }
}

function fillTags (resultSet) {
    var $container = $("#tags").find("tbody").empty();
    $.each(resultSet.items, function (index, tag) {
        $("<tr>").append($('<td>').append(tag.Name))
                 .append($('<td>').append($('<a>').attr('href', '#')
                                                  .attr('data-id', tag._id.$oid)
                                                  .addClass('btn btn-xs')
                                                  .addClass(tag.Forbidden ? 'btn-danger' : 'btn-success')
                                                  .click(function() {
                                                        var tag = Idelo.execute('Tags/Enable', {
                                                            enable: ($(this).text() == 'Lubatud' ? 'false' : 'true'),
                                                            id: $(this).attr('data-id')
                                                        });
                                                        if (tag) {
                                                            $(this).removeClass('btn-danger btn-success')
                                                                   .addClass(tag.Forbidden ? 'btn-danger' : 'btn-success')
                                                                   .text(tag.Forbidden ? 'Keelatud' : 'Lubatud');
                                                        }
                                                  })
                                                  .append(tag.Forbidden ? 'Keelatud' : 'Lubatud')))
                 .append($('<td>').append(tag.CreatedAt ? formatDate(new Date(tag.CreatedAt.$date), true) : '-'))
                 .appendTo($container);
    });
}

function initSorting() {
    var $table = $('#tags');
    $table.find('.tag-sort').click(function() {
        var sortField = $(this).attr('data-id');
        var currentField = $table.attr('data-sort-field');
        var sortDirection = 'asc';
        if (sortField == currentField) {
            sortDirection = ($table.attr('data-sort-direction') == 'asc') ? 'desc' : 'asc';
        }
        $table.attr('data-sort-field', sortField).attr('data-sort-direction', sortDirection);
        $table.find('.tag-sort i').removeClass('fa-sort-asc fa-sort-desc').addClass('fa-sort');
        $(this).find('i').removeClass('fa-sort').addClass(sortDirection == 'asc' ? 'fa-sort-desc' : 'fa-sort-asc');
        setPage(1);
        refreshTagsView();
        return false;
    });
}

$(document).ready(function () {
    initNavbar();

    $.get(templateName, function (data) {
        $('#container').prepend(data);
        Holder.run();

        var resultSet = Idelo.execute('Tags/Find', {});

        if (resultSet && resultSet.total > 0) {
            $.get('app/views/official/tags-table.htm', function(content) {
                $('#container h1').after(content);
                fillTags(resultSet);
                updatePager(resultSet, 1);
                initSorting();
            })
        } else {
            $.get('app/views/official/no-tags.htm', function(content) {
                $('#container h1').after(content);
            })
        }
    });
});
