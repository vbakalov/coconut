// Generated by CoffeeScript 1.6.2
var Client,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Client = (function() {
  function Client(options) {
    this.fetchResults = __bind(this.fetchResults, this);
    this.resultsAsArray = __bind(this.resultsAsArray, this);
    this.toJSON = __bind(this.toJSON, this);    this.clientID = options != null ? options.clientID : void 0;
    if (options != null ? options.results : void 0) {
      this.loadFromResultDocs(options.results);
    }
    this.questions = [];
  }

  Client.prototype.loadFromResultDocs = function(resultDocs) {
    var _this = this;

    this.clientResults = resultDocs;
    return _.each(resultDocs, function(resultDoc) {
      var _ref;

      if (resultDoc.toJSON != null) {
        resultDoc = resultDoc.toJSON();
      }
      if (resultDoc.question) {
        if ((_ref = _this.clientID) == null) {
          _this.clientID = resultDoc["caseid"];
        }
        _this.questions.push(resultDoc.question);
        if (_this[resultDoc.question] == null) {
          _this[resultDoc.question] = [];
        }
        return _this[resultDoc.question].push(resultDoc);
      } else {
        return console.log(resultDoc);
      }
    });
  };

  Client.prototype.fetch = function(options) {
    var _this = this;

    return $.couch.db(Coconut.config.database_name()).view("" + (Coconut.config.design_doc_name()) + "/clients", {
      key: this.clientID,
      include_docs: true,
      success: function(result) {
        _this.loadFromResultDocs(_.pluck(result.rows, "doc"));
        return options != null ? options.success() : void 0;
      },
      error: function() {
        return options != null ? options.error() : void 0;
      }
    });
  };

  Client.prototype.toJSON = function() {
    var returnVal,
      _this = this;

    returnVal = {};
    _.each(this.questions, function(question) {
      return returnVal[question] = _this[question];
    });
    return returnVal;
  };

  Client.prototype.flatten = function(questions) {
    var returnVal,
      _this = this;

    if (questions == null) {
      questions = this.questions;
    }
    returnVal = {};
    _.each(questions, function(question) {
      var type;

      type = question;
      return _.each(_this[question], function(value, field) {
        if (_.isObject(value)) {
          return _.each(value, function(arrayValue, arrayField) {
            return returnVal["" + question + "-" + field + ": " + arrayField] = arrayValue;
          });
        } else {
          return returnVal["" + question + ":" + field] = value;
        }
      });
    });
    return returnVal;
  };

  Client.prototype.LastModifiedAt = function() {
    return _.chain(this.toJSON()).map(function(question) {
      return question.lastModifiedAt;
    }).max(function(lastModifiedAt) {
      return lastModifiedAt != null ? lastModifiedAt.replace(/[- :]/g, "") : void 0;
    }).value();
  };

  Client.prototype.Questions = function() {
    return _.keys(this.toJSON()).join(", ");
  };

  Client.prototype.resultsAsArray = function() {
    var _this = this;

    return _.chain(this.possibleQuestions().map(function(question) {
      return _this[question];
    }).flatten().compact().value());
  };

  Client.prototype.fetchResults = function(options) {
    var count, results,
      _this = this;

    results = _.map(this.resultsAsArray(), function(result) {
      var returnVal;

      returnVal = new Result();
      returnVal.id = result._id;
      return returnVal;
    });
    count = 0;
    _.each(results, function(result) {
      return result.fetch({
        success: function() {
          count += 1;
          if (count >= results.length) {
            return options.success(results);
          }
        }
      });
    });
    return results;
  };

  return Client;

})();