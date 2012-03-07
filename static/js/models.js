(function() {
  var Class, ClassDiagram, DiagramElement, exports,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  DiagramElement = (function(_super) {

    __extends(DiagramElement, _super);

    function DiagramElement() {
      DiagramElement.__super__.constructor.apply(this, arguments);
    }

    DiagramElement.prototype.defaults = {
      x: 0,
      y: 0,
      width: 40,
      height: 100
    };

    return DiagramElement;

  })(Backbone.Model);

  Class = (function(_super) {

    __extends(Class, _super);

    function Class() {
      this.get_inheritance_depth = __bind(this.get_inheritance_depth, this);
      this.get_super_classes = __bind(this.get_super_classes, this);
      this.get_all_members = __bind(this.get_all_members, this);
      this.has_super = __bind(this.has_super, this);
      Class.__super__.constructor.apply(this, arguments);
    }

    Class.prototype.defaults = {
      name: "",
      super_classes: [],
      public_methods: [],
      private_methods: []
    };

    Class.prototype.has_super = function() {
      return this.get("super_classes").length > 0;
    };

    Class.prototype.get_all_members = function() {
      var name, result;
      result = [];
      name = this.get("name");
      if (this.get("super_classes").length > 0) {
        name += " : ";
        name += this.get("super_classes").join(",");
      }
      result.push(name);
      _.each(this.get("public_methods"), function(n) {
        return result.push(n);
      });
      _.each(this.get("private_methods"), function(n) {
        return result.push(n);
      });
      return result;
    };

    Class.prototype.get_super_classes = function() {
      var name;
      return (function() {
        var _i, _len, _ref, _results;
        _ref = this.get("super_classes");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          _results.push(this.collection.find_by_name(name));
        }
        return _results;
      }).call(this);
    };

    Class.prototype.get_inheritance_depth = function() {
      var s, supers_depth, supers_max;
      if (this.get("super_classes").length > 0) {
        supers_depth = (function() {
          var _i, _len, _ref, _results;
          _ref = this.get_super_classes();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            s = _ref[_i];
            _results.push(s.get_inheritance_depth());
          }
          return _results;
        }).call(this);
        supers_max = Math.max.apply(Math, supers_depth);
        return supers_max + 1;
      }
      return 0;
    };

    return Class;

  })(DiagramElement);

  ClassDiagram = (function(_super) {

    __extends(ClassDiagram, _super);

    function ClassDiagram() {
      this.find_by_name = __bind(this.find_by_name, this);
      this.get_classes = __bind(this.get_classes, this);
      ClassDiagram.__super__.constructor.apply(this, arguments);
    }

    ClassDiagram.prototype.model = Class;

    ClassDiagram.prototype.source = "";

    ClassDiagram.prototype.get_classes = function() {
      var model, _i, _len, _ref, _results;
      _ref = this.models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        _results.push(model.get('name'));
      }
      return _results;
    };

    ClassDiagram.prototype.find_by_name = function(name) {
      var m, _i, _len, _ref;
      _ref = this.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        m = _ref[_i];
        if (m.get("name") === name) return m;
      }
      return null;
    };

    return ClassDiagram;

  })(Backbone.Collection);

  exports = this;

  exports.Class = Class;

  exports.current_diagram = new ClassDiagram;

}).call(this);
