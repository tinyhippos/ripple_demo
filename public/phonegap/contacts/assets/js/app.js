// 
//  --- our app behavior logic ---
//
run(function () {
    // a little inline controller
    when('#welcome');
    when('#contact');
    when('#contacts', function () {
        // fill in the dom with a contact's info
        // append a contact to the list
        function append(contact) {
            function displayContact() {
                display("#contact");
                x$('.contact_name')[0].innerHTML = contact.displayName || contact.name.formatted;
                x$('.contact_email')[0].innerHTML = contact.emails.length > 0 ?
                    contact.emails[0].value : "No emails";
            }

            var d = document.createElement("div");
            d.setAttribute("class", "contact_list_item");
            d.removeEventListener('touchstart', displayContact);
            d.addEventListener('touchstart', displayContact);
            d.innerHTML = contact.displayName || contact.name.formatted;
            node.appendChild(d);
        }

        var node = document.getElementById("contact_list"),
            findOptions = new ContactFindOptions();

        // set some filters
        findOptions.limit = 10;
        findOptions.multiple = true;

        // get some contacts!
        navigator.service.contacts.find(["displayName", "name", "emails"], function (contacts) {
            var i;
            if (contacts.length > 0) {
                node.innerHTML = "";
                for (i = 0; i < contacts.length; i++) {
                    append(contacts[i]);
                }
            } else {
                node.innerHTML = "No Contacts";
            }
        }, function (e) {
            node.innerHTML = typeof e === "object" && e.message ? e.message : e;
        }, findOptions);
    });
});
