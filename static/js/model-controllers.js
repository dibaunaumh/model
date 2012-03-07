/**
 * User: udibauman
 * Date: 2/3/12
 * Time: 8:08 AM
 */


var SourceParser = {

    parse: function() {
        var previous_source = "",
            current_class = "",
            current_super_classes = [];

        var members_map = {
            "+": [],
            "-": []
        };

        var add_class = function() {
            var cls = new Class({
                "name": current_class,
                "super_classes": _.clone(current_super_classes),
                "public_methods": _.clone(members_map["+"]),
                "private_methods": _.clone(members_map["-"])
            });
            var existing_class = current_diagram.find(function(c) { return c.get('name') == cls.name});
            if (existing_class) {
                existing_class.set(cls);
            }
            else {
                current_diagram.add(cls);
            }
            current_class = "";
            current_super_classes = [];
            members_map["+"] = [];
            members_map["-"] = [];
        };

        return function() {
            var source = $("#source_input").val();
            if (source != previous_source) {
                previous_source = source;
                var lines = source.split("\n");
                _.each(lines, function(line) {
                    if (line.trim().length == 0) return;
                    var first_char = line.charAt(0);
                    if (members_map[first_char]) {
                        members_map[first_char].push(line.substr(1));
                    }
                    else {
                        if (current_class != "") {
                            add_class();
                        }
                        if (line.indexOf(":") >= 0) {
                            var parts = line.split(":");
                            current_class = parts[0].trim();
                            current_super_classes = parts[1].trim().split(",");
                        }
                        else {
                            current_class = line;
                        }
                    }
                });
                add_class();
            }
        }
    }


};


$(function () {
    drawer.init();

    var parse = SourceParser.parse();

    $('a[data-toggle="tab"]').on('shown', function (e) {
        parse();
    });

    current_diagram.on("add", drawer.draw_class, drawer);
});

