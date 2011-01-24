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
        var node = document.getElementById("contact_list"),
            findOptions = new ContactFindOptions();

        function append(name) {
            var d = document.createElement("div");
            d.setAttribute("class", "contact_list_item");
            d.innerHTML = name;
            node.appendChild(d);
        }

        // set some filters
        findOptions.limit = 5;

        // get some contacts!
        navigator.service.contacts.find(["name"], function (contacts) {
            try {
                var i;
                if (contacts.length > 0) {
                    node.innerHTML = "";
                    alert("length: " + contacts.length);
                    for (i = 0; i < contacts.length; i++) {
                        alert(contacts[i].name);
                        append(contacts[i].name.formatted);
                    }
                } else {
                    node.innerHTML = "No Contacts";
                }
            } catch (e) {
                alert(e);
            }
        }, function (e) {
            node.innerHTML = typeof e === "object" && e.message ? e.message : e;
        }, findOptions);
    });
});
