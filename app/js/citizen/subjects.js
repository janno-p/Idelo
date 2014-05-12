var selectedFilters = [];

function initTagsAutoComplete() {
    $("#event-type-filter").typeahead({
        source: function(query, process) {
            $.ajax({
                url: 'Subject/Tags?q=' + query + '&count=8',
                success: function(data) {
                    var x = JSON.parse(data);
                    var xs = [];
                    for (var i = 0; i < x.length; i++) {
                        xs[i] = x[i]._id;
                    }
                    process(xs);
                }
            });
        },
        updater: function (item) {
            if ($.inArray(item, selectedFilters) >= 0) {
                return null;
            }
            if (selectedFilters.length < 1) {
                var activeFilters = $("<div>").attr("id", "active-filters")
                                              .addClass("vspace-5")
                                              .append($("<a>").attr("href", "#")
                                                              .addClass("remove-all")
                                                              .append($("<small>").append("Eemalda kõik filtrid"))
                                                                                  .click(function () {
                                                                                        $("#active-filters").remove();
                                                                                        selectedFilters = [];
                                                                                        refreshSubjectView();
                                                                                        return false;
                                                                                    }));
                $("#event-filter").append(activeFilters);
            }
            selectedFilters.push(item);
            $("#event-filter .remove-all").before($("<span>").addClass("label label-info")
                                                             .attr("data-value", item)
                                                             .append(item + " ")
                                                             .append($("<a>").attr("href", "#")
                                                                             .append("&times;")
                                                                             .click(function () {
                                                                                    var value = $(this).parent().attr("data-value");
                                                                                    selectedFilters.splice($.inArray(value, selectedFilters), 1);
                                                                                    $(this).parent().remove();
                                                                                    if (selectedFilters.length < 1) {
                                                                                        $("#active-filters").remove();
                                                                                    }
                                                                                    refreshSubjectView();
                                                                                    return false;
                                                                                })))
                                          .before(" ");
            refreshSubjectView();
        }
    }).typeahead();
}

function getSubjectSet() {
    var $table = $('#subjects');
    var pageNum = $table.attr('data-page') || 1;
    var sortField = $table.attr('data-sort-field');
    var sortDirection = $table.attr('data-sort-direction');
    return Idelo.execute('Subject/OfUser', {
        user: $.cookie('user-id'),
        tags: selectedFilters.toString(),
        getrows: Idelo.pageSize,
        fromrow: ((pageNum - 1) * Idelo.pageSize),
        order: sortField,
        direction: sortDirection
    });
}

function fillSubjectsTable(subjectSet) {
    var $container = $('#subjects').find('tbody').empty();
    if (subjectSet.total > 0) {
        $('#subjects').show();
        $('#no-subjects-alert').hide();
        $.each(subjectSet.items, function (index, subject) {
            var $name = $('<td>').append($('<div>').addClass('dropdown')
                                                   .append($('<a>').attr('href', '#')
                                                                   .addClass('dropdown-toggle')
                                                                   .attr('data-toggle', 'dropdown')
                                                                   .append(subject.Name + ' ')
                                                                   .append($('<strong>').addClass('caret')))
                                                   .append($('<ul>').addClass('dropdown-menu')
                                                                    .append($('<li>').append($('<a>').attr('href', 'index.htm?page=new_complaint&subject=' + subject._id.$oid)
                                                                                                     .addClass('modify-citizen')
                                                                                                     .append('Tee kodaniku kohta uus kaebus')))));
            var birthDate = subject.BirthDate ? new Date(subject.BirthDate.$date) : null;
            var gender = subject.Gender;
            if (gender == 'male') gender = 'Mees';
            if (gender == 'female') gender = 'Naine';
            $("<tr>").append($name)
                     .append($('<td>').append(("00" + birthDate.getDate()).slice(-2) + "." + ("00" + (birthDate.getMonth() + 1)).slice(-2) + "." + birthDate.getFullYear()))
                     .append($('<td>').append(gender))
                     .append($('<td>').append(subject.Address))
                     .appendTo($container);
        });
    } else {
        $('#subjects').hide();
        var $alert = $('#no-subjects-alert');
        if ($alert.length > 0) {
            $alert.show();
        } else {
            console.log("tere");
            $('<div>').attr('id', 'no-subjects-alert')
                      .addClass('alert alert-info')
                      .append($('<p>').append($('<i>').addClass('fa fa-info-circle fa-lg'))
                                      .append(' ')
                                      .append($('<strong>').append('Sellise sündmustega isikut ei leitud.'))
                                      .append(' Võta mõned filtrid maha.'))
                      .appendTo($('#container .row'));
        }
    }
    updatePager(subjectSet, $('#subjects').attr('data-page') || 1);
}

function createPagerItem(selectedPage, i) {
    if (selectedPage == i) {
        return $('<li>').addClass('active').append($('<span>').append('' + i + ' ').append($('<span>').addClass('sr-only').append('(current)')))
    }
    return $('<li>').append($('<a>').attr('href', '#').attr('data-page', ''+ i).append('' + i).click(function() {
        $('#subjects').attr('data-page', i);
        refreshSubjectView();
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
                $('#subjects').attr('data-page', 1);
                refreshSubjectView();
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
                $('#subjects').attr('data-page', numPages);
                refreshSubjectView();
                return false;
            })))
            );

    if ($list.find('li').length > 3) {
        $pager.show();
    } else {
        $pager.hide();
    }
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
        $table.attr('data-page', 1);
        refreshSubjectView();
        return false;
    });
}

function refreshSubjectView() {
    var subjectSet = getSubjectSet();
    var $table = $('#subjects');
    if ($table.length > 0) {
        fillSubjectsTable(subjectSet)
    }
    else if (subjectSet && subjectSet.total > 0) {
        $.get('app/views/citizen/subjects-table.htm', function(content) {
            $('#container h1').after(content);
            initSorting();
            initTagsAutoComplete();
            fillSubjectsTable(subjectSet);
        });
    } else {
        $.get('app/views/citizen/no-subjects.htm', function(content) {
            $('#container h1').after(content);
        });
    }
}

$(document).ready(function () {
    initNavbar();
    $.get(templateName, function (data) {
        $('#container').prepend(data);
        refreshSubjectView();
    });
});
