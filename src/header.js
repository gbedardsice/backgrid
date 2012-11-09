/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2012 Jimmy Yuen Ho Wong
  Licensed under the MIT @license.
*/

var HeaderCell = Backgrid.HeaderCell = Backbone.View.extend({

  tagName: "th",

  events: {
    "click a": "triggerSort"
  },

  direction: null,

  initialize: function (options) {
    this.parent = options.parent;
    this.column = options.column;
    if (!this.column instanceof Column) {
      this.column = new Column(this.column);
    }
  },

  toggle: function (columnName, direction) {
    var $label = this.$el.find("a");
    $label.removeClass("ascending descending");

    if (columnName === this.column.get("name")) {
      if (direction) {
        $label.addClass(direction);
      }
      this.direction = direction;
    }
    else {
      this.direction = null;
    }
  },

  triggerSort: function (e) {
    e.preventDefault();

    var self = this;

    var columnName = self.column.get("name");
    
    if (this.direction === "ascending") {
      self.trigger("sort", function (left, right) {
        var leftVal = left.get(columnName);
        var rightVal = right.get(columnName);
        if (leftVal === rightVal) {
          return 0;
        }
        else if (leftVal > rightVal) { return -1; }
        return 1;
      }, columnName, "descending");
    }
    else if (this.direction === "descending") {
      self.trigger("sort", null, columnName, null);
    }
    else {
      self.trigger("sort", function (left, right) {
        var leftVal = left.get(columnName);
        var rightVal = right.get(columnName);
        if (leftVal === rightVal) {
          return 0;
        }
        else if (leftVal < rightVal) { return -1; }
        return 1;
      }, columnName, "ascending");
    }
  },

  render: function () {
    this.$el.empty();
    var $label = $("<a>").text(this.column.get("label")).append("<b class='sort-caret'></b>");
    this.$el.append($label);
    return this;
  }

});

var Header = Backgrid.Header = Backbone.View.extend({

  tagName: "thead",

  initialize: function (options) {
    var self = this;

    self.parent = options.parent;
    self.columns = options.columns;
    if (!(self.columns instanceof Backbone.Collection)) {
      self.columns = new Columns(self.columns);
    }
    self.cells = self.columns.map(function (column) {
      var cell = new HeaderCell({
        parent: self,
        column: column
      });

      cell.on("sort", self.dispatchSortEvent, self);
      
      return cell;
    });

  },

  dispatchSortEvent: function (comparator, sortByColName, direction) {
    this.parent.sort(comparator);
    _.each(this.cells, function (cell) {
      cell.toggle(sortByColName, direction);
    });
  },

  render: function () {
    var self = this;
    self.$el.empty();
    _.each(self.cells, function (cell) {
      self.$el.append(cell.render().$el);
    });
    return self;
  }

});