// Generated by CoffeeScript 1.6.2
var ClientSummaryView, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ClientSummaryView = (function(_super) {
  __extends(ClientSummaryView, _super);

  function ClientSummaryView() {
    this.renderResult = __bind(this.renderResult, this);
    this.render = __bind(this.render, this);    _ref = ClientSummaryView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ClientSummaryView.prototype.el = '#content';

  ClientSummaryView.prototype.render = function() {
    var data,
      _this = this;

    console.log(this.client);
    this.$el.html("      <h1>Client " + this.client.clientID + "</h1>      <a href='#new/result/Clinical%20Visit/" + this.client.clientID + "'><button>New clinical visit for " + this.client.clientID + "</button></a><br/>      <table>        " + (data = {
      "Initial Visit Date": this.client.initialVisitDate(),
      "Age": "",
      "HIV Status": this.client.hivStatus(),
      "On ART": "",
      "Last Blood Pressure": this.client.lastBloodPressure(),
      "Allergies": "",
      "Complaints at Previous Visit": "",
      "Treatment Given at Previous Visit": ""
    }, _.map(data, function(value, property) {
      return "              <tr>                <td>                  " + property + "                </td>                <td>                  " + value + "                </td>              </tr>            ";
    }).join("")) + "      </table>      <h2>Previous Visit Data</h2>      <br/>      " + (_.map(this.client.clientResults, function(result) {
      var date, id, question;

      date = result.createdAt || result.VisitDate || result.fDate;
      question = result.question || result.source;
      id = result._id || "";
      return "          " + question + ": " + date + "          <button onClick='$(\"#result-" + id + "\").toggle()' type='button'>View</button>          <a href='#edit/result/" + id + "'><button>Edit</button></a>          <div id='result-" + id + "' style='display: none'>            " + (_this.renderResult(result)) + "          </div>          ";
    }).join("")) + "    ");
    return $("button").button();
  };

  ClientSummaryView.prototype.renderResult = function(result) {
    return "      <pre style='font-size:50%'>" + (JSON.stringify(result, void 0, 2)) + "      </pre>    ";
  };

  return ClientSummaryView;

})(Backbone.View);

/*
//@ sourceMappingURL=ClientSummary.map
*/
