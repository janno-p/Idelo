
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
            /*
            var username = $('#register-email').val();
            var password = $('#register-password').val();

            $.ajax({
                url: 'Salvesta?table=t0&f0=' + encodeURI(username) + '&f1=' + encodeURI(password),
                async: false
            });


            window.location.href = "?page=register_success&email=" + encodeURI(username);*/
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
        $('#complaint-location').val('' + $modal.attr('data-lat') + ';' + $modal.attr('data-lng'))
                                .valid();
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
