class ClassView extends Backbone.View

  initialize: =>
    @model.on "change", @render
    @model.on "destroy", @remove

  set_context: (context) =>
    @svg = context.svg
    @offset = context.offset
    @default_class_width = context.default_class_width
    @default_member_height = context.default_member_height
    @default_member_spacing = context.default_member_spacing
    @class_views_by_name = context.class_views_by_name

  get_offset: (level) =>
    if not @offset[level]
      @offset[level] = 0
    @offset[level]

  set_offset: (level, offset) =>
    @offset[level] = offset

  render: =>
    data = @model.get_all_members()
    if data.length < 2
      data.push(" ")
      data.push(" ")
    level = @model.get_inheritance_depth()
    y = level * 120 + 20
    x = @get_offset(level)
    h = data.length * @default_member_height
    w = @default_class_width
    margin = 10
    @el = @svg.append("g")
      .attr("x", x)
      .attr("y", y)

    @el.append("rect")
      .attr("x", x)
      .attr("y", y)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("width", w)
      .attr("height", h)
    @el.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", x + margin)
      .attr("y", (d, i) => y + margin + i * @default_member_height)
      .attr("dy", ".35em")
      .text String
    @el.append("line")
      .attr("x1", x)
      .attr("y1", y + @default_member_height)
      .attr("x2", x + @default_class_width)
      .attr("y2", y + @default_member_height)
    @set_offset level, x + @default_class_width + @default_member_spacing

    @top_connect_point =
        x: x + w/2
        y: y

    @bottom_connect_point =
        x: x + w/2
        y: y + h

    if @model.has_super()
      for sc in @model.get "super_classes"
        super_view = @class_views_by_name[sc]
        points = []
        points[0] = x: @top_connect_point.x, y: @top_connect_point.y
        points[1] = x: super_view.bottom_connect_point.x, y: super_view.bottom_connect_point.y
        path_d = "M" + points[0].x + "," + points[0].y
        path_d += " C" + points[0].x + "," + (points[0].y-50)
        path_d += " " + points[1].x + "," + (points[1].y+50)
        path_d += " " + points[1].x + "," + points[1].y
        # TODO use d3.js helper functions
        @el.append("path")
          .attr("d", path_d)
          .attr("stroke", "black")
          .attr("stroke-width", "0.75px")
          .attr("fill", "none")
          .attr("marker-end", "url(#triangle)")

    return @

  destroy: =>
    @svg[0][0].removeChild(@el[0][0])


class ClassDiagramView extends Backbone.View
  svg: null
  class_views_by_name: {}
  current_offset: {}
  default_class_width: 150
  default_member_height: 20
  default_member_spacing: 20

  initialize: =>
    @render()
    current_diagram.on "reset", @clear
    current_diagram.on "add", @add_class

  render: =>
    w = 675
    h = 360
    pack = d3.layout.pack()
      .size([ w - 4, h - 4 ])
      .value((d) -> d.size)
    @svg = d3.select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("class", "pack")


    @svg.append("defs")
      .selectAll("marker")
      .data(["triangle"])
      .enter()
      .append("marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", -0.5)
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5")

    @svg = @svg.selectAll("g")
      .data(["root"]).enter()
      .append("g")
      .attr("transform", "translate(2, 2)")

  clear: =>
    view.destroy() for name, view of @class_views_by_name
    @class_views_by_name = {}
    @current_offset = {}

  add_class: (model) =>
    class_view = new ClassView(model: model)
    class_view.set_context
      svg:                    @svg
      offset:                 @current_offset
      default_class_width:    @default_class_width
      default_member_height:  @default_member_height
      default_member_spacing: @default_member_spacing
      class_views_by_name:    @class_views_by_name
    class_view.render()
    @current_offset = class_view.offset
    @class_views_by_name[model.get "name"] = class_view

view = new ClassDiagramView

