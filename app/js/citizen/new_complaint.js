
function setupNewComplaintValidations() {
    $('form#new-complaint-form').validate({
        showErrors: function (errorMap, errorList) {
            $.each(this.validElements(), function (index, element) {
                $(element).closest('.form-group').removeClass("has-error");
                $(element).closest('.col-sm-5').data("title", "").tooltip("destroy");
            });

            $.each(errorList, function (index, error) {
                $(error.element).closest('.form-group').addClass("has-error");
                $(error.element).closest('.col-sm-5').tooltip("destroy").data("title", error.message).tooltip({ placement: "right", trigger: "manual", container: "body" }).tooltip("show");
            });
        },

        submitHandler: function (form) {
            var data = {
                title: $('#complaint-title').val(),
                subject: $('#complaint-subject-id').val(),
                time: $('#complaint-time').val(),
                lat: $('#complaint-location-lat').val(),
                lng: $('#complaint-location-lng').val(),
                tags: $('#complaint-types').val(),
                description: $('#complaint-description').val(),
                user: $.cookie('user-id')
            }

            var photoId = 1;
            $('input[id^="complaint-photo-"]').each(function(i, e) {
                if ($(e).val().length > 0) {
                    data['photo' + photoId] = $(e).val();
                    photoId += 1;
                }
            });

            var url = 'Kaebus/Salvesta?';
            for (var key in data) {
                url += '' + key + '=' + data[key] + '&';
            }

            var id = null;
            $.ajax({
                url: url,
                async: false,
                success : function(result) {
                    id = eval('x=' + result).$oid;
                }
            });

            window.location.href = "?page=index&highlight=" + encodeURI(id);

            return false;
        }
    });

    $('form#new-complaint-form input, form#new-complaint-form textarea').blur(function () {
        $(this).valid();
    });

    $("#complaint-title").focus();
}

function updatePhotosButton() {
    var numPhotos = $('#new-complaint-form input[id^="complaint-photo-"]').length;
    if (numPhotos < 5) {
        $('#complaint-add-photo-help').text('Võid veel lisada kuni ' + (5 - numPhotos) + ' pilti.');
    } else {
        $('#complaint-add-photo-help').text('Maksimaalne piltide arv on saavutatud.');
    }
    if (numPhotos > 4) {
        $('#complaint-add-photo').hide();
    } else {
        $('#complaint-add-photo').show();
    }
}

function addPhotoInput(i) {
    var $button = $('<button>').addClass('btn btn-default').append($('<i>').addClass('fa fa-fw fa-times'));
    var $input = $('<div>').addClass('input-group input-group-sm')
                           .append($('<input>').attr('type', 'text')
                                               .addClass('form-control')
                                               .attr('id', 'complaint-photo-' + i)
                                               .attr('name', 'complaint-photo-' + i)
                                               .attr('placeholder', 'Link fotole'))
                           .append($('<span>').addClass('input-group-btn').append($button));
    $('#complaint-add-photo').before($input);
    $input.find('input').focus();
    $button.click(function() {
        $input.remove();
        $('#new-complaint-form input[id^="complaint-photo-"]').each(function(i, ph) {
            $(ph).attr('id', 'complaint-photo-' + (i + 1)).attr('name', 'complaint-photo-' + (i + 1));
        });
        updatePhotosButton();
        return false;
    });
}

function fillMap() {
    var $modal = $('#map-dialog');
    var mapOptions = {
        center: new google.maps.LatLng(59.43701835253617, 24.75363627076149),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDoubleClickZoom: true
    };
    var map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
    var marker = new google.maps.Marker();
    marker.setMap(map);
    google.maps.event.addListener(map, 'dblclick', function(event) {
        $modal.attr('data-lat', event.latLng.d);
        $modal.attr('data-lng', event.latLng.e);
        marker.setPosition(event.latLng);
        map.panTo(event.latLng);
        $modal.find('.btn-primary').removeAttr('disabled');
    });
    $modal.on('shown.bs.modal', function () {
        google.maps.event.trigger(map, "resize");
    });
    $modal.on('hidden.bs.modal', function() {
        $('#complaint-location').unbind('focus')
                                .focus()
                                .bind('focus', initLocation)
                                .valid();
    });
    $modal.find('.btn-primary').click(function() {
        $modal.modal('hide');
        $('#complaint-location').val('(' + $modal.attr('data-lat') + '; ' + $modal.attr('data-lng') + ')')
                                .valid();
        $('#complaint-location-lat').val($modal.attr('data-lat'));
        $('#complaint-location-lng').val($modal.attr('data-lng'));
    });
    $modal.modal();
}

function initLocation() {
    var $modal = $('#map-dialog');
    if ($modal.length > 0) {
        $modal.modal();
    } else {
        $.get('app/views/citizen/map-dialog.htm', function(content) {
            $('body').append(content);
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=fillMap';
            document.body.appendChild(script);
        });
    }
}

function formatDate(date) {
    var dateValue = new Date(Date.parse(date));
    var day = ("00" + dateValue.getDate()).slice(-2);
    var month = ("00" + (dateValue.getMonth() + 1)).slice(-2);
    var year = dateValue.getFullYear();
    return day + "." + month + "." + year;
}

function showCitizenList(resultSet) {
    var $lg = $('#user-dialog .list-group');
    if ($lg.length < 1) {
        $lg = $('<div>').addClass('list-group vspace-10');
        $('#user-dialog .modal-body').append($lg);
    }
    var $info = $('#user-dialog .alert-info').hide();
    for (var i = 0; i < resultSet.items.length; i++) {
        $lg.empty();
        var item = resultSet.items[i];
        var $a = $('<a>').attr('href', '#')
                         .addClass('list-group-item')
                         .append($('<h4>').addClass('list-group-item-heading')
                                          .text(item.name + ' (sünd. ' + formatDate(item.birth_date) + ')'));
        if (item.address && item.address.length > 0) {
            $a.append($('<p>').addClass('list-group-item-text').text(item.address));
        }
        $a.click(function() {
            $('#complaint-subject').val('' + item.name);
            $('#complaint-subject-id').val('' + item._id.$oid);
            $('#user-dialog').modal('hide');
            $('#complaint-subject').valid();
            return false;
        });
        $lg.append($a);
    }
    $lg.show();
}

function showMissingCitizenAlert() {
    var $lg = $('#user-dialog .list-group').empty().hide();
    var $info = $('#user-dialog .alert-info');
    if ($info.length < 1) {
        $info = $('<div>').addClass('alert alert-info vspace-10')
                          .append('Otsingutingimustele vastavat isikut ei leitud. Kas soovid ')
                          .append($('<a>').attr('href', '#').addClass('alert-link').text('lisada uut isikut'))
                          .append('?');
        $('#user-dialog .modal-body').append($info);
    }
    $info.show();
}

function initUser() {
    var $modal = $('#user-dialog');
    if ($modal.length > 0)
        return $modal.modal();
    $.get('app/views/citizen/user-dialog.htm', function(content) {
        $('body').append(content);
        $('#user-dialog').on('shown.bs.modal', function () {
            $('#search-user-form input').focus();
        });
        $('#user-dialog').on('hidden.bs.modal', function() {
            $('#complaint-subject').unbind('focus')
                                   .focus()
                                   .bind('focus', initUser)
                                   .valid();
        });
        $('#search-user-form').submit(function() {
            var query = $('#search-user-form input').val();
            var resultSet = null;
            $.ajax({
                async: false,
                url: 'Kodanik/Otsi?order=name&direction=asc' + (query.length > 0 ? ('&name=' + encodeURI(query)) : ''),
                success: function(data) {
                    resultSet = eval('x=' + data);
                }
            });

            if (resultSet && resultSet.total > 0) showCitizenList(resultSet);
            else showMissingCitizenAlert();

            return false;
        });
        initUser();
    });
}

$(document).ready(function () {
    initNavbar();
    $.get(templateName, function (data) {
        $('#container').prepend(data);
        Holder.run();

        $(".form_datetime").datetimepicker({
            autoclose: true,
            todayHighlight: true,
            language: "ee",
            endDate: new Date()
        }).on("changeDate", function (e) {
            $("#complaint-time-text").valid();
        });

        $('#complaint-location').focus(initLocation);
        $('#complaint-location').next().find('span.glyphicon').click(initLocation);

        $('#complaint-subject').focus(initUser)
                               .next()
                               .find('span.glyphicon')
                               .click(initUser);

        setupNewComplaintValidations();

        $('#complaint-add-photo').click(function() {
            var x = $('#new-complaint-form input[id^="complaint-photo-"]');
            var numPhotos = x.length + 1;
            if (numPhotos < 6) {
                addPhotoInput(numPhotos);
            }
            updatePhotosButton();
            return false;
        });
    });
});
