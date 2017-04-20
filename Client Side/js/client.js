var message = "";
var latilong = {
    latitude: 41.0573188,
    longitude: -74.1409771
};
var map;
var marker;
var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('myMap'), {
        center: {
            lat: latilong.latitude,
            lng: latilong.longitude
        },
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
}
$(document).ready(function() {
    $.ajax({
        url: "http://localhost:3000/",
        success: function(data) {
            for (var i = 0; i < data.length; i++) {
                var tr = "<tr onclick=centerMap(this) id=" + data[i]._id + " " + "data-lati=" + data[i].lati + " data-long=" + data[i].long + ">"
                tr = tr + ("<td>" + data[i].salutation + "</td>");
                tr = tr + ("<td>" + data[i].fname + "</td>");
                tr = tr + ("<td>" + data[i].lname + "</td>");
                tr = tr + ("<td>" + data[i].street + " " + data[i].city + " " + data[i].state + " " + data[i].zip + "</td>");
                tr = tr + ("<td>" + data[i].phone + "</td>");
                tr = tr + ("<td>" + data[i].email + "</td>");
                var contactBy = "";
                if (data[i].cmail) {
                    contactBy += "<img src=\"images/mail.jpg\" class=\"imgIcon\"/> &nbsp;";
                }
                if (data[i].cphone) {
                    contactBy += "<img src=\"images/phone.png\" class=\"imgIcon\"/> &nbsp;";
                }
                if (data[i].cemail) {
                    contactBy += "<img src=\"images/email.png\" class=\"imgIcon\"/> &nbsp;";
                }
                tr = tr + ("<td>" + contactBy + "</td>");
                tr = tr + ("<td>" + "<img onclick=editTR(this) data-oid=" + data[i]._id + " src=\"images/edit.png\" class=\"imgIcon editData\"/>" + "</td>");
                tr = tr + ("<td>" + "<img onclick=deleteTR(this) data-oid=" + data[i]._id + " src=\"images/delete.png\" class=\"imgIcon deleteData\"/>" + "</td>");
                tr = tr + "</tr>"

                $('#myTable tbody').append(tr);
                var infoWindow = new google.maps.InfoWindow({
                    content: data[i].street + " " + data[i].city + " " + data[i].state + " " + data[i].zip,
                });
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data[i].lati, data[i].long),
                    map: map
                });
                markers.push(marker);
                google.maps.event.addListener(marker, 'click', (function(mm, tt) {
                    return function() {
                        infoWindow.setContent(tt);
                        infoWindow.open(map, mm);
                    }
                })(marker, data[i].street + " " + data[i].city + " " + data[i].state + " " + data[i].zip));
            }

        }
    });
    //addRowHandlers();
});

function centerMap(row) {
    map.setCenter({
        lat: $(row).data('lati'),
        lng: $(row).data('long')
    });
}

// Adds a marker to the map and push to the array.
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function ResetMarkers() {
    // Deletes all markers in the array by removing references to them.
    deleteMarkers();

    $("tr").each(function() {
        var ToolTipText=$(this).find('td').eq(3).text();
        var infoWindow = new google.maps.InfoWindow({
            content: ToolTipText,
        });
        marker = new google.maps.Marker({
            position: new google.maps.LatLng($(this).data('lati'), $(this).data('long')),
            map: map
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', (function(mm, tt) {
            return function() {
                infoWindow.setContent(tt);
                infoWindow.open(map, mm);
            }
        })(marker, ToolTipText));
    });
}

function myFunction() {
    // Declare variables 
    var input1, input2, filter1, filter2, table, tr, td1, td2, i;
    input1 = document.getElementById("fname");
    input2 = document.getElementById("lname");
    filter1 = input1.value.toUpperCase();
    filter2 = input2.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td1 = tr[i].getElementsByTagName("td")[1];
        td2 = tr[i].getElementsByTagName("td")[2];
        if (td1 || td2) {
            if ((td1.innerHTML.toUpperCase().indexOf(filter1) > -1) && (td2.innerHTML.toUpperCase().indexOf(filter2) > -1)) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

$(document).ready(function() {
    $('[data-hello="tooltip"]').tooltip();
});

function deleteTR(row) {
    var id = $(row).data("oid");
    console.log(id);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/delete',
        data: {
            id: id
        }
    })
    .done(function(response) {
        console.log(response);
        $("#" + id).remove();
        ResetMarkers();

        map.setCenter({
            lat: 41.0573188,
            lng: -74.1409771
        });


    })
    .fail(function(data) {
        console.log(data);
    });
}

function editTR(row) {
    var id = $(row).data("oid");
    console.log(id);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/find',
        data: {
            id: id
        }
    })
    .done(function(response) {
        console.log(response);
        $('#formUpdate').trigger("reset");
        console.log();
        $("#firstname2").attr("value", response[0].fname);
        $("#lastname2").attr("value", response[0].lname);
        $("#street2").attr("value", response[0].street);
        $("#city2").attr("value", response[0].city);
        $("#zip2").attr("value", response[0].zip);
        $("#phone2").attr("value", response[0].phone);
        $("#email2").attr("value", response[0].email);
        if (response[0].cemail) {
            document.getElementById("checkbox_email2").checked = true;
        }
        if (response[0].cmail) {
            document.getElementById("checkbox_mail2").checked = true;
        }
        if (response[0].cphone) {
            document.getElementById("checkbox_phone2").checked = true;
        }
        $("#state2").val(response[0].state);
        $("#oid2").val(response[0]._id);
        $("#" + response[0].salutation).prop("checked", true);
        $("#UpdateContact").modal('show');

    })
    .fail(function(data) {

    });
}



$(function() {
    // Get the form.
    var form = $('#formAdd');

    // Get the messages div.
    $(form).submit(function(event) {
        // Stop the browser from submitting the form.
        event.preventDefault();
        var formData = $(form).serialize();
        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData
        })
        .done(function(response) {
            console.log(response);
            var tr = "<tr onclick=centerMap(this) id=" + response._id + " " + "data-lati=" + response.lati + " data-long=" + response.long + ">"
            tr = tr + ("<td>" + response.salutation + "</td>");
            tr = tr + ("<td>" + response.fname + "</td>");
            tr = tr + ("<td>" + response.lname + "</td>");
            tr = tr + ("<td>" + response.street + " " + response.city + " " + response.state + " " + response.zip + "</td>");
            tr = tr + ("<td>" + response.phone + "</td>");
            tr = tr + ("<td>" + response.email + "</td>");
            var contactBy = "";
            if (response.cmail) {
                contactBy += "<img src=\"images/mail.jpg\" class=\"imgIcon\"/> &nbsp;";
            }
            if (response.cphone) {
                contactBy += "<img src=\"images/phone.png\" class=\"imgIcon\"/> &nbsp;";
            }
            if (response.cemail) {
                contactBy += "<img src=\"images/email.png\" class=\"imgIcon\"/> &nbsp;";
            }
            tr = tr + ("<td>" + contactBy + "</td>");
            tr = tr + ("<td>" + "<img onclick=editTR(this) data-oid=" + response._id + " src=\"images/edit.png\" class=\"imgIcon editData\"/>" + "</td>");
            tr = tr + ("<td>" + "<img onclick=deleteTR(this) data-oid=" + response._id + " src=\"images/delete.png\" class=\"imgIcon deleteData\"/>" + "</td>");
            tr = tr + "</tr>"

            $('#myTable tbody').append(tr);
            var infoWindow = new google.maps.InfoWindow({
                content: response.street + " " + response.city + " " + response.state + " " + response.zip,
            });
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(response.lati, response.long),
                map: map
            });
            markers.push(marker);
            google.maps.event.addListener(marker, 'click', (function(mm, tt) {
                return function() {
                    infoWindow.setContent(tt);
                    infoWindow.open(map, mm);
                }
            })(marker, response.street + " " + response.city + " " + response.state + " " + response.zip));
            
            
            $("#addContact").modal('hide');
        })
        .fail(function(data) {
            console.log(data);
            $("#addContact").modal('hide');
        });


        // TODO
    });

    // TODO: The rest of the code will go here...
});

$(function() {
    // Get the form.
    var form = $('#formUpdate');

    // Get the messages div.
    $(form).submit(function(event) {
        // Stop the browser from submitting the form.
        event.preventDefault();
        var formData = $(form).serialize();
        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData
        })
        .done(function(response) {
            console.log(response);
            var tr = "<tr onclick=centerMap(this) id=" + response._id + " " + "data-lati=" + response.lati + " data-long=" + response.long + ">"
            tr = tr + ("<td>" + response.salutation + "</td>");
            tr = tr + ("<td>" + response.fname + "</td>");
            tr = tr + ("<td>" + response.lname + "</td>");
            tr = tr + ("<td>" + response.street + " " + response.city + " " + response.state + " " + response.zip + "</td>");
            tr = tr + ("<td>" + response.phone + "</td>");
            tr = tr + ("<td>" + response.email + "</td>");
            var contactBy = "";
            if (response.cmail) {
                contactBy += "<img src=\"images/mail.jpg\" class=\"imgIcon\"/> &nbsp;";
            }
            if (response.cphone) {
                contactBy += "<img src=\"images/phone.png\" class=\"imgIcon\"/> &nbsp;";
            }
            if (response.cemail) {
                contactBy += "<img src=\"images/email.png\" class=\"imgIcon\"/> &nbsp;";
            }
            tr = tr + ("<td>" + contactBy + "</td>");
            tr = tr + ("<td>" + "<img onclick=editTR(this) data-oid=" + response._id + " src=\"images/edit.png\" class=\"imgIcon editData\"/>" + "</td>");
            tr = tr + ("<td>" + "<img onclick=deleteTR(this) data-oid=" + response._id + " src=\"images/delete.png\" class=\"imgIcon deleteData\"/>" + "</td>");
            tr = tr + "</tr>"

            console.log(tr);
            $('#' + response._id).replaceWith(tr);
            ResetMarkers();
            map.setCenter({
                lat: response.lati,
                lng: response.long
            });
            $("#UpdateContact").modal('hide');
        })
        .fail(function(data) {
            console.log(data);
            $("#UpdateContact").modal('hide');
        });


        // TODO
    });

    // TODO: The rest of the code will go here...
});