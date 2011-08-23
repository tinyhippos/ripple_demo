// 
//  --- our app behavior logic ---
//
run(function () {

    // --- some helper methods (controller is after)

    function searchContacts(filter) {
        // contact attributes to search for and return
        var fields = ["displayName", "name", "emails", "phoneNumbers"], 
            options = new ContactFindOptions();

        // hide search fields
        x$(".contacts_search input, #search_button").css({display: "none"});

        // set some contactFindOptions
        options.filter = (filter && filter !== "Search All") ? filter : "";
        options.limit = 15;
        options.multiple = true;

        navigator.contacts.find(fields, function (foundContacts) {
            var i, 
                contactList = x$("#contact_list");

            if (foundContacts.length > 0) {
                x$("#contact_list").html("");
                for (i = 0; i < foundContacts.length; i++) {
                    appendContactToList(foundContacts[i], contactList);
                }
            } else {
                contactList.html("<p>No Contacts</p>");
            }

            contactList.css({display: "block"});
        }, function (e) {
            contactList.html(typeof e === "object" && e.message ? e.message : e);
        }, options);
    }

    // append a contact item to a dom node
    function appendContactToList(contact, to) {
        var node = document.createElement("div");

        // display a contact's information
        function showContactInfo() {
            x$("#contact_name")
                .html(contact.name.formatted || contact.displayName || "Unknown Contact");
            
            // display first email found
            if (contact.emails && contact.emails.length > 0) {
                x$("#contact_email")
                    .css({display: "inline-block"})
                    .attr("href", "mailto:" + contact.emails[0].value)
                    .html(contact.emails[0].value.slice(0, 19) + "...");
            } else {
                x$("#contact_email").css({display: "none"});
            }

            // display first phone number found
            if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
                x$("#contact_phone")
                    .html(contact.phoneNumbers[0].type + ": " + contact.phoneNumbers[0].value)
                    .attr("href", "tel:" + contact.phoneNumbers[0].value)
                    .css({display: "inline-block"});
            } else {
                x$("#contact_phone").css({display: "none"});
            }

            display("#contact");
        }

        x$(node)
            .on("click", showContactInfo)
            .attr("class", "contact_list_item")
            .html(contact.name.formatted || contact.displayName || "Unknown Contact");

        to.html('bottom', node);
    }

    // --- a little inline controller
 
    when("#welcome");
    when("#contact");
    when("#contacts", function () {
        x$("#contact_list").html("");

        // show the search form
        x$("#contacts_filter")
            .attr("value", "Search All")
            .css({display: "inline-block"});
        x$("#search_button").css({display: "inline-block"});

        x$("#contacts_filter")
            .un("focus").on("focus", function () {
                if (this.value === "Search All") {
                    this.value = "";
                }
            })
            .un("blur").on("blur", function () {
                if (!this.value) {
                    this.value = "Search All";
                }
            });

        x$("#search_button").un("click").on("click", function () {
            x$("#contact_list").html("<p>Searching...</p>");
            searchContacts(x$("#contacts_filter")[0].value);
        });

        x$("#search_reset_button").un("click").on("click", function () {
            display("#contacts");
        });
    });

});
