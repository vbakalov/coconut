// Generated by CoffeeScript 1.3.1
var Help,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Help = (function(_super) {

  __extends(Help, _super);

  Help.name = 'Help';

  function Help() {
    return Help.__super__.constructor.apply(this, arguments);
  }

  Help.prototype.initialize = function() {};

  Help.prototype.url = "/help";

  return Help;

})(Backbone.Model);
