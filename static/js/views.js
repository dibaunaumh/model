(function() {
  var ClassDiagramView, ClassView, view,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ClassView = (function(_super) {

    __extends(ClassView, _super);

    function ClassView() {
      this.destroy = __bind(this.destroy, this);
      this.render = __bind(this.render, this);
      this.set_offset = __bind(this.set_offset, this);
      this.get_offset = __bind(this.get_offset, this);
      this.set_context = __bind(this.set_context, this);
      this.initialize = __bind(this.initialize, this);
      ClassView.__super__.constructor.apply(this, arguments);
    }

    ClassView.prototype.initialize = function() {
      this.model.on("change", this.render);
      return this.model.on("destroy", this.remove);
    };

    ClassView.prototype.set_context = function(context) {
      this.svg = context.svg;
      this.offset = context.offset;
      this.default_class_width = context.default_class_width;
      this.default_member_height = context.default_member_height;
      this.default_member_spacing = context.default_member_spacing;
      return this.class_views_by_name = context.class_views_by_name;
    };

    ClassView.prototype.get_offset = function(level) {
      if (!this.offset[level]) this.offset[level] = 0;
      return this.offset[level];
    };

    ClassView.prototype.set_offset = function(level, offset) {
      return this.offset[level] = offset;
    };

    ClassView.prototype.render = function() {
      var data, h, level, margin, path_d, points, sc, super_view, w, x, y, _i, _len, _ref,
        _this = this;
      data = this.model.get_all_members();
      if (data.length < 2) {
        data.push(" ");
        data.push(" ");
      }
      level = this.model.get_inheritance_depth();
      y = level * 120 + 20;
      x = this.get_offset(level);
      h = data.length * this.default_member_height;
      w = this.default_class_width;
      margin = 10;
      this.el = this.svg.append("g").attr("x", x).attr("y", y);
      this.el.append("rect").attr("x", x).attr("y", y).attr("rx", 5).attr("ry", 5).attr("width", w).attr("height", h);
      this.el.selectAll("text").data(data).enter().append("text").attr("x", x + margin).attr("y", function(d, i) {
        return y + margin + i * _this.default_member_height;
      }).attr("dy", ".35em").text(String);
      this.el.append("line").attr("x1", x).attr("y1", y + this.default_member_height).attr("x2", x + this.default_class_width).attr("y2", y + this.default_member_height);
      this.set_offset(level, x + this.default_class_width + this.default_member_spacing);
      this.top_connect_point = {
        x: x + w / 2,
        y: y
      };
      this.bottom_connect_point = {
        x: x + w / 2,
        y: y + h
      };
      if (this.model.has_super()) {
        _ref = this.model.get("super_classes");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sc = _ref[_i];
          super_view = this.class_views_by_name[sc];
          points = [];
          points[0] = {
            x: this.top_connect_point.x,
            y: this.top_connect_point.y
          };
          points[1] = {
            x: super_view.bottom_connect_point.x,
            y: super_view.bottom_connect_point.y
          };
          path_d = "M" + points[0].x + "," + points[0].y;
          path_d += " C" + points[0].x + "," + (points[0].y - 50);
          path_d += " " + points[1].x + "," + (points[1].y + 50);
          path_d += " " + points[1].x + "," + points[1].y;
          this.el.append("path").attr("d", path_d).attr("stroke", "black").attr("stroke-width", "0.75px").attr("fill", "none").attr("marker-end", "url(#inheritance-arrow)");
        }
      }
      return this;
    };

    ClassView.prototype.destroy = function() {
      return this.svg[0][0].removeChild(this.el[0][0]);
    };

    return ClassView;

  })(Backbone.View);

  ClassDiagramView = (function(_super) {

    __extends(ClassDiagramView, _super);

    function ClassDiagramView() {
      this.add_class = __bind(this.add_class, this);
      this.clear = __bind(this.clear, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      ClassDiagramView.__super__.constructor.apply(this, arguments);
    }

    ClassDiagramView.prototype.svg = null;

    ClassDiagramView.prototype.class_views_by_name = {};

    ClassDiagramView.prototype.current_offset = {};

    ClassDiagramView.prototype.default_class_width = 150;

    ClassDiagramView.prototype.default_member_height = 20;

    ClassDiagramView.prototype.default_member_spacing = 20;

    ClassDiagramView.prototype.initialize = function() {
      this.render();
      current_diagram.on("reset", this.clear);
      return current_diagram.on("add", this.add_class);
    };

    ClassDiagramView.prototype.render = function() {
      var h, pack, w;
      w = 675;
      h = 360;
      pack = d3.layout.pack().size([w - 4, h - 4]).value(function(d) {
        return d.size;
      });
      this.svg = d3.select("#chart").append("svg").attr("width", w).attr("height", h).attr("class", "pack");
      this.svg.append("defs").selectAll("marker").data(["inheritance-arrow"]).enter().append("marker").attr("id", String).attr("viewBox", "0 -5 10 10").attr("refX", 10).attr("refY", -0.5).attr("markerWidth", 10).attr("markerHeight", 10).attr("orient", "auto").append("svg:path").attr("d", "M0,-5L10,0L0,5");
      return this.svg = this.svg.selectAll("g").data(["root"]).enter().append("g").attr("transform", "translate(2, 2)");
    };

    ClassDiagramView.prototype.clear = function() {
      var name, view, _ref;
      _ref = this.class_views_by_name;
      for (name in _ref) {
        view = _ref[name];
        view.destroy();
      }
      this.class_views_by_name = {};
      return this.current_offset = {};
    };

    ClassDiagramView.prototype.add_class = function(model) {
      var class_view;
      class_view = new ClassView({
        model: model
      });
      class_view.set_context({
        svg: this.svg,
        offset: this.current_offset,
        default_class_width: this.default_class_width,
        default_member_height: this.default_member_height,
        default_member_spacing: this.default_member_spacing,
        class_views_by_name: this.class_views_by_name
      });
      class_view.render();
      this.current_offset = class_view.offset;
      return this.class_views_by_name[model.get("name")] = class_view;
    };

    return ClassDiagramView;

  })(Backbone.View);

  view = new ClassDiagramView;

}).call(this);
