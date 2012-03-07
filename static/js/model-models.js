/**
 * User: udibauman
 * Date: 2/2/12
 * Time: 7:00 PM
 */

var DiagramElement = Backbone.Model.extend({
    defaults: {
        "x": 0,
        "y": 0,
        "width": 40,
        "height": 100
    }
});

var Class = DiagramElement.extend({
    defaults: {
        "name": "",
        "super_classes": [],
        "public_methods": [],
        "private_methods": []
    },
    get_all_members: function () {
        var result = [];
        var name = this.get('name');
        if (this.get('super_classes').length > 0) {
            name += " : ";
            name += this.get('super_classes').join(",")
        }
        result.push(name);
        _.each(this.get('public_methods'), function(n) { result.push(n); });
        _.each(this.get('private_methods'), function(n) { result.push(n); });
        return result;
    }
});


var ClassDiagram = Backbone.Collection.extend({
    model: Class,
    source: "",
    get_classes: function() {
        var result = [];
        _.each(this.models, function(model) {
            result.push(model.get("name"));
        });
        return result;
    }
});

var current_diagram = new ClassDiagram();
