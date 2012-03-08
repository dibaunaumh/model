EXAMPLES = {}
EXAMPLES["simple"] = """
Class1 : BaseClass1
+method1
+method2
-method3

Class2 : BaseClass1
+method1
+method2
-method3

Class3 : Class2
+method1
+method2
-method3
"""

create_parser = ->
  previous_source = ""
  current_class = ""
  current_super_classes = []
  members_map =
    "+": []
    "-": []

  add_class = (cls) =>
    existing_class = current_diagram.find((c) ->
        c.get("name") is cls.name
    )
    if existing_class
      existing_class.set cls
    else
      current_diagram.add cls

  add_current_class = =>
    cls = new Class(
      name: current_class
      super_classes: _.clone(current_super_classes)
      public_methods: _.clone(members_map["+"])
      private_methods: _.clone(members_map["-"])
    )
    add_class(name: sc) for sc in current_super_classes
    add_class(cls)

    current_class = ""
    current_super_classes = []
    members_map["+"] = []
    members_map["-"] = []

  ->
    source = $("#source_input").val()
    unless source is previous_source
      current_diagram.reset()
      previous_source = source
      lines = source.split("\n")
      _.each lines, (line) ->
        return  if line.trim().length is 0
        first_char = line.charAt(0)
        if members_map[first_char]
          members_map[first_char].push line.substr(1)
        else
          add_current_class() unless current_class is ""
          if line.indexOf(":") >= 0
            parts = line.split(":")
            current_class = parts[0].trim()
            current_super_classes = parts[1].trim().split(",")
          else
            current_class = line

      add_current_class()

show_example = (which) ->
  $("#source_input").val(EXAMPLES[which])

$ ->
  parse = create_parser()
  $("a[data-toggle=\"tab\"]").on "shown", (e) ->
    parse()
  $("#load_simple_example").click((e) -> show_example("simple"))