/**
 * User: udibauman
 * Date: 2/2/12
 * Time: 7:22 PM
 */


var ClassDiagramDrawer = {
    svg: null,
    current_offset: 0,
    default_class_width: 150,
    default_member_height: 20,
    default_member_spacing: 20,
    class_containers: {},

    init: function() {
        var w = 675,
            h = 360;

        var pack = d3.layout.pack()
            .size([w - 4, h - 4])
            .value(function (d) {
                return d.size;
            });

        this.svg = d3.select("#chart").append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("class", "pack")
            .append("g")
            .attr("transform", "translate(2, 2)");        
    },
    
    draw_class: function(model) {
        var data = model.get_all_members(),
            x = this.current_offset,
            y = 50,
            margin = 10;

        var g = this.svg.append('g')
            .attr("x", x)
            .attr("y", y);
        this.class_containers[model.get('name')] = g;

        g.append('rect')
            .attr("x", x)
            .attr("y", y)
            .attr("width", this.default_class_width)
            .attr("height", data.length * this.default_member_height);

        var that = this;
        g.selectAll("text")
             .data(data)
           .enter().append("text")
             .attr("x", x + margin)
             .attr("y", function(d, i) { return y + margin + i * that.default_member_height; })
             .attr("dy", ".35em") // vertical-align: middle
             .text(String);

        g.append("line")
            .attr("x1", x)
            .attr("y1", y + this.default_member_height)
            .attr("x2", x + this.default_class_width)
            .attr("y2", y + this.default_member_height);

        this.current_offset += this.default_class_width + this.default_member_spacing;
    }

};

var drawer = ClassDiagramDrawer;