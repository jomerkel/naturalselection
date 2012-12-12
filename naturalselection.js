Maps = new Meteor.Collection("maps");

height = 970;
width = 970;

session_map = "ns2_veil.png";

if (Meteor.isClient) {

	var dataset = "";
	
	Template.page.maps = function () {
		return Maps.find({}, {sort: {name: 1}});
	};
	
	
	var coordsRelativeToElement = function (element, event) {
	  var offset = $(element).offset();
	  var x = event.pageX - offset.left;
	  var y = event.pageY - offset.top;
	  return { "x": x, "y": y };
	};
	
	var drawMap = function () {
		dataset = Maps.findOne(Session.get("selected_map"));
		console.log(Session.get("selected_map").detail);
		
		var svg = d3.select("svg")
					.attr("height",height)
					.attr("width",width);

		var image = svg.select("image")
					.attr("xlink:xlink:href",dataset.detail)
					.attr("height",height)
					.attr("width",width);
					
		var circles = svg.selectAll("circle")
			.data(dataset.hive)
			
		var updateCircles = function (group) {
			group.attr("cx", function (d) { return d.x; })
			.attr("cy", function (d) { return d.y; })
			.attr("r", 130)
			.attr("class", "ARC")
			.style('opacity', 0.5);
		}

			
		updateCircles(circles.enter().append("circle"));
		updateCircles(circles.transition().duration(250).ease("cubic-out"));
		circles.exit().transition().duration(250).attr("r", 0).remove();
		
	};

	Template.canvas.events({
	  'click .bg': function (event, template) {
		var coords = coordsRelativeToElement(event.currentTarget, event);
		console.log(coords);
		}
	})

	Template.canvas.rendered = function() {		  
		drawMap();

	}
	
	Template.map.events({
	  'click .map_name': function () {
		Session.set("selected_map", this._id)
		drawMap()
		console.log(Session.get("selected_map"));
		}
	})
	
	Template.map.selected = function () {
		return Session.equals("selected_map", this._id) ? "selected" : '';
	};
}

// On server startup, create some players if the database is empty.
 //                  'ns2_mineshaft',
 //                  'ns2_tram',
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Maps.find().count() === 0) {
        Maps.insert({name: "ns2_veil", detail: "ns2_veil.png", hive: [{"x":167.5,"y":679},{"x":530.5,"y":843},{"x":879.5,"y":665}] });
		Maps.insert({name: "ns2_refinery", detail: "ns2_refinery.png", hive: [{"x":348.5,"y":107},{"x":809.5,"y":249},{"x":673.5,"y":755},{"x":146.5,"y":469}] });
    }
  });
}