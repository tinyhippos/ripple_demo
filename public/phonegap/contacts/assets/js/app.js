// 
//  --- our app behavior logic ---
//
run(function () {
    // a little inline controller
    when("#welcome");

    // append a found Contact in the display list
    function appendToList(contact, to) {
        var node = document.createElement("div");

        // display a contact info card from list
        function showContactInfo() {
            x$("#contact_info").html("");

            x$("#contact_name")
                .html(contact.name.formatted || contact.displayName);
            
            if (contact.emails.length > 0) {
                x$("#contact_email")
                    .css({display: "inline-block"})
                    .attr("href", "mailto:" + contact.emails[0].value)
                    .html(contact.emails[0].value);
            } else {
                x$("#contact_email").css({display: "none"});
            }

            if (contact.phoneNumbers.length > 0) {
                x$("#contact_phone")
                    .html(contact.phoneNumbers[0].type + ":" + contact.phoneNumbers[0].value)
                    .attr("href", contact.phoneNumbers[0].value)
                    .css({display: "inline-block"});
            } else {
                x$("#contact_phone").css({display: "none"});
            }

            display("#contact");
        }

        x$(node)
            .attr("class", "contact_list_item")
            .un("touchstart")
            .on("touchstart", showContactInfo)
            .html(contact.name.formatted);

        to.html('bottom', node);
    }

    when("#contact");
    when("#contacts", function () {
        // hide/show search fields and results list
        store.get("config", function (data) {
            data = data || {key: "config"};

            x$("#contact_list").html("");

            x$("#contacts_filter")
                .attr("value", data.filter || "Search All")
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
                    } else {
                        data.filter = this.value;
                        store.save(data);
                    }
                });
        });

        // on search find some contacts
        x$("#search_button").un("touchstart").on("touchstart", function () {
            var list = x$("#contact_list"),
                fields = ["displayName", "name", "emails", "phoneNumbers"], 
                options = new ContactFindOptions();

            // hide search fields
            x$(".contacts_search input, #search_button").css({display: "none"});

            // set some contactFindOptions
            options.filter = "";
            options.limit = 15;
            options.multiple = true;

            navigator.service.contacts.find(fields, function (contacts) {
                var i;
                if (contacts.length > 0) {
                    list.html("");
                    for (i = 0; i < contacts.length; i++) {
                        appendToList(contacts[i], list);
                    }
                } else {
                    list.html("No Contacts");
                }
            }, function (e) {
                list.html(typeof e === "object" && e.message ? e.message : e);
            }, options);
        });
    });
});
