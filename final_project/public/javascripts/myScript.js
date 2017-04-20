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
}
$(document).ready(function() {
    $(".edit-button").click(function(event) {
        var contactID = event.target.id;
        console.log(contactID);
        $.ajax({url: "/update",
            data: {"id" : contactID},
            success: function(result){
                console.log(result);
            }});
    });
});