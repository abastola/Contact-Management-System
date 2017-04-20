var message = "";
var latilong = { latitude: 41.0573188, longitude: -74.1409771 };
var map;
var marker;
liIdNumber = 0;
function initMap() {
    map = new google.maps.Map(document.getElementById('myMap'), {
        center: { lat: latilong.latitude, lng: latilong.longitude },
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    document.getElementById("myBtn").addEventListener("click", function () {
        var message = document.getElementsByTagName("input")[0].value;
        var liIdName = "liElement";
        console.log("myfunction");
        $.getJSON({
            url: 'https://maps.googleapis.com/maps/api/geocode/json',
            data: {
                sensor: false,
                address: message
            },
            success: function (json) {
                var latitude = json.results[0].geometry.location.lat;
                var longitude = json.results[0].geometry.location.lng;
                latilong.latitude = latitude;
                latilong.longitude = longitude;
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(latilong.latitude, latilong.longitude),
                    map: map
                });
                $("ul").append('<li id=' + liIdName + liIdNumber + '  data-lat=' + latilong.latitude + ' data-lon=' + latilong.longitude + '>' + message + '</li>');
                map.setCenter({ lat: latilong.latitude, lng: latilong.longitude });
                var idfornewLi = liIdName + liIdNumber;
                $('#' + idfornewLi).click(function () {
                    map.setCenter({ lat: $(this).data('lat'), lng: $(this).data('lon') });
                });
                liIdNumber++;
            }
        });
    });
}
