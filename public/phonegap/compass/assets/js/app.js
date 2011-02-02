// 
//  --- our app behavior logic ---
//
run(function () {
    // --- a little inline controller
    when("#compass", function () {
        var view = x$("#compass .info");
        navigator.compass.getCurrentHeading(function (heading) {
            view.html(heading);
        }, function () {
            view.html("Error!");
        });
    });
});
