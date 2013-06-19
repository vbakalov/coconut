// Generated by CoffeeScript 1.6.2
var Client,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Client = (function() {
  function Client(options) {
    this.mostRecentValueFromMapping = __bind(this.mostRecentValueFromMapping, this);
    this.mostRecentValue = __bind(this.mostRecentValue, this);
    this.fetchResults = __bind(this.fetchResults, this);
    this.resultsAsArray = __bind(this.resultsAsArray, this);
    this.toJSON = __bind(this.toJSON, this);
    this.sortResultArraysByCreatedAt = __bind(this.sortResultArraysByCreatedAt, this);    this.clientID = options != null ? options.clientID : void 0;
    if (options != null ? options.results : void 0) {
      this.loadFromResultDocs(options.results);
    }
    this.availableQuestionTypes = [];
  }

  Client.prototype.loadFromResultDocs = function(resultDocs) {
    var _this = this;

    this.clientResults = resultDocs;
    _.each(resultDocs, function(resultDoc) {
      var _ref, _ref1;

      if (resultDoc.toJSON != null) {
        resultDoc = resultDoc.toJSON();
      }
      if (resultDoc.question) {
        if ((_ref = _this.clientID) == null) {
          _this.clientID = resultDoc["caseid"];
        }
        _this.availableQuestionTypes.push(resultDoc.question);
        if (_this[resultDoc.question] == null) {
          _this[resultDoc.question] = [];
        }
        return _this[resultDoc.question].push(resultDoc);
      } else if (resultDoc.source) {
        if ((_ref1 = _this.clientID) == null) {
          _this.clientID = resultDoc["IDLabel"].replace(/-|\n/g, "");
        }
        _this.availableQuestionTypes.push(resultDoc["source"]);
        if (_this[resultDoc["source"]] == null) {
          _this[resultDoc["source"]] = [];
        }
        return _this[resultDoc["source"]].push(resultDoc);
      }
    });
    return this.sortResultArraysByCreatedAt();
  };

  Client.prototype.sortResultArraysByCreatedAt = function() {
    var _this = this;

    return _.each(this.availableQuestionTypes, function(resultType) {
      return _this[resultType] = _.sortBy(_this[resultType], function(result) {
        return result.createdAt;
      });
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
    _.each(this.availableQuestionTypes, function(question) {
      return returnVal[question] = _this[question];
    });
    return returnVal;
  };

  Client.prototype.flatten = function(availableQuestionTypes) {
    var returnVal,
      _this = this;

    if (availableQuestionTypes == null) {
      availableQuestionTypes = this.availableQuestionTypes;
    }
    returnVal = {};
    _.each(availableQuestionTypes, function(question) {
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

  Client.prototype.mostRecentValue = function(resultType, question) {
    var result, returnVal, _i, _len, _ref;

    returnVal = null;
    if (this[resultType] != null) {
      _ref = this[resultType];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        result = _ref[_i];
        if (result[question] != null) {
          returnVal = result[question];
          break;
        }
      }
    }
    return returnVal;
  };

  Client.prototype.mostRecentValueFromMapping = function(mappings) {
    var map, returnVal, _i, _len;

    returnVal = null;
    for (_i = 0, _len = mappings.length; _i < _len; _i++) {
      map = mappings[_i];
      returnVal = this.mostRecentValue(map.resultType, map.question);
      console.log(returnVal);
      if (returnVal != null) {
        if (map.postProcess != null) {
          returnVal = map.postProcess(returnVal);
        }
        break;
      }
    }
    return returnVal;
  };

  Client.prototype.hasClientDemographics = function() {
    return (this["Client Demographics"] != null) && this["Client Demographics"].length > 0;
  };

  Client.prototype.hasTblDemography = function() {
    return (this['tblDemography'] != null) && this['tblDemography'].length > 0;
  };

  Client.prototype.hasDemographicResult = function() {
    window.b = this;
    console.log(this.hasClientDemographics());
    console.log(this.hasTblDemography());
    return this.hasClientDemographics() || this.hasTblDemography();
  };

  Client.prototype.initialVisitDate = function() {
    var postProcess;

    postProcess = function(value) {
      return moment(value).format(Coconut.config.get("date_format"));
    };
    return this.mostRecentValueFromMapping([
      {
        resultType: "Client Demographics",
        question: "createdAt",
        postProcess: postProcess
      }, {
        resultType: "tblDemography",
        question: "fDate",
        postProcess: postProcess
      }
    ]);
  };

  Client.prototype.dateFromDateQuestions = function(resultType, postfix) {};

  Client.prototype.calculateAge = function(birthDate, onDate) {
    var age, currentMonth;

    if (onDate == null) {
      onDate = new Date();
    }
    birthDate = new Date("" + yearOfBirth + "-" + monthOfBirth + "-" + dayOfBirth);
    age = onDate.getFullYear() - birthDate.getFullYear();
    currentMonth = onDate.getMonth() - birthDate.getMonth();
    if (currentMonth < 0 || (currentMonth === 0 && onDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  Client.prototype.currentAge = function() {
    var age, birthDate, dayOfBirth, monthOfBirth, yearOfBirth;

    if (this.hasDemographicResult()) {
      yearOfBirth = this.mostRecentValue("Client Demographics", "Whatisyouryearofbirth");
      monthOfBirth = this.mostRecentValue("Client Demographics", "Whatisyourmonthofbirth");
      dayOfBirth = this.mostRecentValue("Client Demographics", "Whatisyourdayofbirth");
      age = this.mostRecentValue("Client Demographics", "Whatisyourage");
      if (yearOfBirth != null) {
        if (monthOfBirth == null) {
          monthOfBirth = "June";
          dayOfBirth = "1";
        }
        if (dayOfBirth == null) {
          dayOfBirth = "15";
        }
        return this.calculateAge(new Date("" + yearOfBirth + "-" + monthOfBirth + "-" + dayOfBirth));
      } else {
        return age;
      }
    }
    if (this.hasTblDemography()) {
      birthDate = this.mostRecentValue("tblDemography", "DOB");
      if (birthDate != null) {
        return this.calculateAge(new Date(birthDate));
      } else {
        return this.mostRecentValue("tblDemography", "Age");
      }
    }
  };

  Client.prototype.hivStatus = function() {
    return this.mostRecentValueFromMapping([
      {
        resultType: "Clinical Visit",
        question: "ResultofHIVtest"
      }, {
        resultType: "Clinical Visit",
        question: "WhatwastheresultofyourlastHIVtest"
      }, {
        resultType: "tblSTI",
        question: "HIVTestResult"
      }
    ]);
  };

  Client.prototype.lastBloodPressure = function() {
    return "" + (this.mostRecentValue("Clinical Visit", "SystolicBloodPressure")) + "/" + (this.mostRecentValue("Clinical Visit", "DiastolicBloodPressure"));
  };

  return Client;

})();

/*
//@ sourceMappingURL=Client.map
*/
