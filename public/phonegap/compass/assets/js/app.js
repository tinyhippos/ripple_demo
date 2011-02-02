// 
//  --- a very simple app ---
//
function headingToText(h) {
    var t;
    if (typeof h !== "number") {
        t = ''; 
    } else if (h >= 337.5 || (h >= 0 &&  h <= 22.5)) {
        t =  'N'; 
    } else if (h >= 22.5 && h <= 67.5) {
        t =  'NE'; 
    } else if (h >= 67.5 && h <= 112.5) {
        t =  'E'; 
    } else if (h >= 112.5 && h <= 157.5) {
        t =  'SE'; 
    } else if (h >= 157.5 && h <= 202.5) {
        t =  'S'; 
    } else if (h >= 202.5 && h <= 247.5) {
        t =  'SW'; 
    } else if (h >= 247.5 && h <= 292.5) {
        t =  'W'; 
    } else if (h >= 292.5 && h <= 337.5) {
        t =  'NW'; 
    } else {
        t =  t;
    }
    return t;
}

x$(document).on("deviceready", function () {
    var view = x$("#compass .info");

    function success(heading) {
        view.html(headingToText(heading));
    }

    function fail() {
        console.log("test");
        view.html("Error!");
    }

    navigator.compass.getCurrentHeading(success, fail);
    navigator.compass.watchHeading(success, fail, {frequency: 200});
});
