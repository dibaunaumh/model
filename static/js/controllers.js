(function() {
  var create_parser;

  create_parser = function() {
    var add_class, add_current_class, current_class, current_super_classes, members_map, previous_source,
      _this = this;
    previous_source = "";
    current_class = "";
    current_super_classes = [];
    members_map = {
      "+": [],
      "-": []
    };
    add_class = function(cls) {
      var existing_class;
      existing_class = current_diagram.find(function(c) {
        return c.get("name") === cls.name;
      });
      if (existing_class) {
        return existing_class.set(cls);
      } else {
        return current_diagram.add(cls);
      }
    };
    add_current_class = function() {
      var cls, sc, _i, _len;
      cls = new Class({
        name: current_class,
        super_classes: _.clone(current_super_classes),
        public_methods: _.clone(members_map["+"]),
        private_methods: _.clone(members_map["-"])
      });
      for (_i = 0, _len = current_super_classes.length; _i < _len; _i++) {
        sc = current_super_classes[_i];
        add_class({
          name: sc
        });
      }
      add_class(cls);
      current_class = "";
      current_super_classes = [];
      members_map["+"] = [];
      return members_map["-"] = [];
    };
    return function() {
      var lines, source;
      source = $("#source_input").val();
      if (source !== previous_source) {
        current_diagram.reset();
        previous_source = source;
        lines = source.split("\n");
        _.each(lines, function(line) {
          var first_char, parts;
          if (line.trim().length === 0) return;
          first_char = line.charAt(0);
          if (members_map[first_char]) {
            return members_map[first_char].push(line.substr(1));
          } else {
            if (current_class !== "") add_current_class();
            if (line.indexOf(":") >= 0) {
              parts = line.split(":");
              current_class = parts[0].trim();
              return current_super_classes = parts[1].trim().split(",");
            } else {
              return current_class = line;
            }
          }
        });
        return add_current_class();
      }
    };
  };

  $(function() {
    var parse;
    parse = create_parser();
    return $("a[data-toggle=\"tab\"]").on("shown", function(e) {
      return parse();
    });
  });

}).call(this);
