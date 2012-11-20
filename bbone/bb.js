(function ($) {
    var Tree = Backbone.Model.extend({
        defaults: function () {
            return {
                name: "Generic Tree",
                scientificName: "Generic Latin Name",
                height: ["tall"],
                spread: ["medium"],
                growth: ["justmoderate"],
                foliage: ["evergreen"],
                fruit: "not showy",
                bloom: "not showy",
                wateringneeds: ["justmoderate"],
                treecareneeds: ["justmoderate"],
                droughttolerant: "yes",
                soiltype: "anysoiltype",
                toleratesshade: "yes",
                toleratessalt: "no",
                windtolerance: "yes",
                url: "#",
                thumbnail: "http://fuf.mightyminnow.com/wp-content/plugins/treepress/img/tree.png",
                blurb: "#",
                notabletraits: "###",
                shown: true
            };
        },
        initialize: function () {}
    });

    var TreeList = Backbone.Collection.extend({
        model: Tree,

        initialize: function () {
            this.sortVar = 'name';
        },

        comparator: function (tree) {
            return tree.get("name");
        },

        sortByType: function (type) {
            this.sortKey = type;
            this.sort();
        }


    });

    var Trees = new TreeList;
    var TreesScientific = Trees.sortBy(function (tree) {
        return tree.get("scientificName");
    });


    var TreeView = Backbone.View.extend({
        tagName: "div",

        initialize: function () {
            this.model.bind('change', this.render, this);
            this.model.bind('change:shown', this.showhide, this);

            // Hovers
            $('a.hoveroverme').hover(

            function () {
                $(this).children('div').css('display', 'block');
            },

            function () {
                $(this).children('div').css('display', 'none');
            });
        },

        showhide: function () {
            showItOrNot = this.model.attributes.shown;
            if (showItOrNot == false) {
                return this.$el.fadeTo("fast", 0.00).slideUp({
                    duration: 200,
                    easing: "swing"
                });
            } else {
                this.$el.fadeTo("fast", 1.00);
            }
        },

        render: function (tree) {
            visible = tree.get("shown");
            // Necessary for redraw?
            /*if (!visible) {
return this;
}*/

            name = tree.get("name");
            scientificName = tree.get("scientificName");
            url = tree.get("url");
            linkopen = '<a class="hoveroverme" href="' + url + '">';
            span1 = '<span>';
            span2 = '<span class="secondcolumn">';
            spanclose = '</span>';

            popupopen = '<div class="hoverImage" style="display: none;">';

            popupimg = '<img width="960" src="' + tree.get("thumbnail");
            popupimg = popupimg + '" alt="tree" class="attachment-post-thumbnail wp-post-image"/>';
            popuphed = '<h3>' + tree.get("name") + '</h3>';
            popupblurb = '<p class="treeblurb">' + tree.get("notabletraits") + '</p>';
            popupclose = '</div>';

            popup = popupopen + popupimg + popuphed + popupblurb + popupclose;

            outputString = span1 + linkopen + name + popup + '</a>' + spanclose + span2 + linkopen + '<em>' + scientificName + '</em>' + popup + '</a>' + spanclose;

            this.$el.html(outputString);
            return this;
        },
    });

    var AppView = Backbone.View.extend({
        // #Treeapp is a wrapper for the entire application
        el: $('#treeapp'),

        events: {
            "change input": "formEvent",
                "change select": "formEvent",

            // Pulldown bars get one too
        },

        initialize: function () {
            Trees.bind('reset', this.reDraw, this);


        },

        reDraw: function () {
            this.$('#treetable').fadeOut();
            this.$('#treetable').empty();
            this.addAll();
            this.$('#treetable').fadeIn();
        },

        render: function () {
            Trees.each(this.addOne);
        },

        addOne: function (tree) {
            var view = new TreeView({
                model: tree
            });
            this.$('#treetable').append(view.render(tree).el);
        },

        addAll: function () {
            Trees.each(this.addOne);
        },

        formEvent: function () {
            eventType = event.target.type;
            switch (eventType) {
                case "checkbox":
                    classArray = event.target.classList;
                    key = classArray[0];
                    value = classArray[1];
                    this.toggleShown(key, value, "checkbox");
                    break;
                case "radio":
                    this.sortThingsByColumn(event.target.className);
                    return this;
                    break;
                case "select-one":
                    console.log(event);
                    value = event.target.value;
                    if (value == "doesn't matter") return this;
                    key = event.target.classList[0];
                    this.toggleShown(key, value, "pulldown");
                    break;
                default:
                    alert(eventType);
                    break;
            }



        },

        sortThingsByColumn: function (className) {
            Trees.sortByType(className);
        },

        toggleSort: function () {

        },

        toggleShown: function (key, value, type) {
            var mustBePresent;
            type == "checkbox" ? mustBePresent == true : mustBePresent == false;

            Trees.each(function (tree) {
                quality = tree.get(key);
                present = _.indexOf(quality, value)
                if (mustBePresent) {
                    if (present > -1) {
                        treeBoolean = tree.get('shown');
                        tree.set({
                            shown: !treeBoolean
                        });
                    }
                } else {
                    if (present < 0) {
                        treeBoolean = tree.get('shown');
                        tree.set({
                            shown: !treeBoolean
                        });
                    }
                }

            });
        }
    });


    var PopulateWithTreeData = function () {
        // Load a little test data here...
        var tree1 = new Tree;
        var tree2 = new Tree;
        var tree3 = new Tree;
        var tree4 = new Tree;
        tree1.set({
            name: 'Xyzzy Tree'
        });
        tree2.set({
            name: 'John\'s Tree'
        });
        tree3.set({
            name: 'Claudia\'s Tree'
        });
        tree2.set({
            height: ['medium']
        });
        Trees.add(tree1);
        Trees.add(tree2);
        Trees.add(tree3);
        Trees.add(tree4);
    };

    PopulateWithTreeData();

    var App = new AppView;

    App.render();

    // Our form, part of the App View, will cause actions to happen along the lines of
    // App.toggleShown("height","tall");
    // This will require a number of simple bindings. Let's do a test version.



})(jQuery);