// 
//  --- our app behavior logic ---
//
run(function () {
    // immediately invoked on first run
    var init = (function () {
        // load in some extra contacts
    })();
    
    // a little inline controller
    when('#welcome');
    when('#contacts', function () {
        var node = document.getElementById("contact_list");

        function append(name) {
            var d = document.createElement("div");
            d.setAttribute("class", "contact_list_item");
            d.innerHTML = name;
            node.appendChild(d);
        }

        // get some contacts!
        navigator.service.contacts.find(["name", "displayName"], function (list) {
            var i;
            if (list.length > 0) {
                for (i = 0; i < list.length; i++) {
                    append(list[i].name.formatted);
                }
            } else {
                node.html("No Contacts");
            }
        }, function (error) {
            node.html(error.message);
        });
    });
});
