class DiagramElement extends Backbone.Model
  defaults:
    x: 0
    y: 0
    width: 40
    height: 100

class Class extends DiagramElement
  defaults:
    name: ""
    super_classes: []
    public_methods: []
    private_methods: []

  has_super: =>
    @get("super_classes").length > 0

  get_all_members: =>
    result = []
    name = @get("name")
    if @get("super_classes").length > 0
      name += " : "
      name += @get("super_classes").join(",")
    result.push name
    _.each @get("public_methods"), (n) ->
      result.push n

    _.each @get("private_methods"), (n) ->
      result.push n

    result

  get_super_classes: =>
    return (@collection.find_by_name(name) for name in @get("super_classes"))

  get_inheritance_depth: =>
    if @get("super_classes").length > 0
      supers_depth = (s.get_inheritance_depth() for s in @get_super_classes())
      supers_max = Math.max supers_depth...
      return supers_max + 1
    0

class ClassDiagram extends Backbone.Collection
  model: Class
  source: ""
  get_classes: =>
    (model.get 'name' for model in @models)

  find_by_name: (name) =>
    # TODO use the Backbone.Collection find method
    for m in @models
      if m.get("name") is name
        return m
    null

exports = this
exports.Class = Class
exports.current_diagram = new ClassDiagram