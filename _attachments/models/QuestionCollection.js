// Generated by CoffeeScript 1.3.1
var QuestionCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

QuestionCollection = (function(_super) {

  __extends(QuestionCollection, _super);

  QuestionCollection.name = 'QuestionCollection';

  function QuestionCollection() {
    return QuestionCollection.__super__.constructor.apply(this, arguments);
  }

  QuestionCollection.prototype.model = Question;

  QuestionCollection.prototype.url = '/question';

  return QuestionCollection;

})(Backbone.Collection);
