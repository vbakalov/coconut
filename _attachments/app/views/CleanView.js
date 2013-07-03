// Generated by CoffeeScript 1.6.2
var CleanView, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CleanView = (function(_super) {
  __extends(CleanView, _super);

  function CleanView() {
    this.render = __bind(this.render, this);    _ref = CleanView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  CleanView.prototype.initialize = function() {
    return this.question = new Question();
  };

  CleanView.prototype.el = '#content';

  CleanView.prototype.render = function(args) {
    var rc,
      _this = this;

    this.args = args;
    if (this.args === "undo") {
      if (User.currentUser.username() !== "admin") {
        throw "Must be admin";
      }
      rc = new ResultCollection();
      rc.fetch({
        include_docs: true,
        success: function() {
          var changed_results;

          changed_results = rc.filter(function(result) {
            return (result.get("user") === "reports") && (result.get("question") === "Household Members");
          });
          return _.each(changed_results, function(result) {
            return $.couch.db(Coconut.config.database_name()).openDoc(result.id, {
              revs_info: true
            }, {
              success: function(doc) {
                return $.couch.db(Coconut.config.database_name()).openDoc(result.id, {
                  rev: doc._revs_info[1].rev
                }, {
                  success: function(previousDoc) {
                    var newDoc;

                    newDoc = previousDoc;
                    newDoc._rev = doc._rev;
                    return result.save(newDoc);
                  }
                });
              }
            });
          });
        }
      });
      return;
    }
    this.total = 0;
    this.$el.html("      <h1>The following data requires cleaning</h1>      <h2>Duplicates (<span id='total'></span>)</h2>      <a href='#clean/apply_duplicates'<button>Apply Recommended Duplicate Fixes</button></a>      <div id='duplicates'>        <table>          <thead>            <th>Duplicates</th>          </thead>          <tbody>        </table>      </div>      <h2>Dates (<span id='total'></span>)</h2>      <a href='#clean/apply_dates'<button>Apply Recommended Date Fixes</button></a>      <div id='dates'>        <table>        </table>      </div>      <h2>CaseIDS (<span id='total'></span>)</h2>      <a href='#clean/apply_caseIDs'<button>Apply Recommended CaseID Fixes</button></a>      <div id='caseIDs'>        <table>          <thead>            <th>Current</th>            <th>Recommendation</th>          </thead>          <tbody>        </table>      </div>    ");
    this.resultCollection = new ResultCollection;
    return this.resultCollection.fetch({
      include_docs: true,
      success: function() {
        _this.searchForDates();
        return _this.searchForManualCaseIDs();
      }
    });
  };

  CleanView.prototype.searchForDuplicates = function() {
    var dupes, found;

    dupes = [];
    found = {};
    console.log("Downloading all notifications");
    return $.couch.db(Coconut.config.database_name()).view("" + (Coconut.config.design_doc_name()) + "/notifications", {
      include_docs: true,
      success: function(result) {
        var dupeTargets, i;

        console.log("Searching " + result.rows.length + " results");
        dupeTargets = ["WAMBA,SALEH", "WAMBA,MUHD OMI", "WAMBAA,KHAMIS ALI", "WAMBAA,KHALIDI MASOUD", "JUNGANI,HIDAYA MKUBWA", "CHANGAWENI,IBRAHIM KASIM", "WAMBAA,WAHIDA MBAROUK", "WAMBAA,KADIRU SULEIMAN", "SHUMBA MJIN,SHARIF", "MIZINGANI,SAADA MUSSA", "CHANGAWENI,HALIMA BAKAR", "WAMBAA,ALI JUMA KHAMIS", "WAMBAA,SLEIMAN KHAMIS", "MBUGUANI,AMINA ALI HAJI", "WAMBAA,SLEIMAN USSI", "SHAURIMOYO,KHAIRAT HAJI KHAMIS", "CHANGAWENI,MUSSA KASSIM", "KIPAPO,HAITHAM HAJI", "MICHENZANI,BIKOMBO HAKIMU", "MICHENZANI,ARAFA KHATIB", "CHANGAWENI,SAMIRA MKUBWA", "MICHENZANI,SALEH ABDALLA", "WAMBAA,MUHD OMI", "KUNGUNI,ZULEKHA", "KUNGUNI,RAYA", "KUNGUNI,SALAMA", "KUNGUNI,TALIB", "AMANI,ZAINAB HAROUB", "SHAKANI,JANET", "SHAKANI,PAULINA", "NDAGONI,ASHA", "KINUNI,ALI ABDALLA", "NYERERE,JUMA", "KUNGUNI,AWENA", "KUNGUNI,INAT", "KUNGUNI,ALI", "KIEMBE SAMAKI,NEILA SALUM ABDALLA", "KIEMBE SAMAKI,NEILA", "TONDOONI,SAID", "MSEWENI,ZAHARANI", "KUNGUNI,FAHD", "KUNGUNI,ALI", "KUNGUNI,YASIR", "CHONGA,FATMA", "KIUNGONI,ABDUL", "DONGE  MCHANGANI,KHADIJA", "KIPANGE,IHIDINA", "CHEJU,KHAMIS", "UTAANI,RAHMA", "TUMBE MASHARIKI,OMAR SAID OMAR", "MAGOGONI,FATMA  SLEIMAN", "NDAGONI,ARKAM", "MWANAKWEREKWE,MUKTAR MOHD", "TUNGUU,FADHIL", "KISAUNI,FERUZ", "NDAGONI,NAOMBA", "TUMBE MASHARIKI,RUMAIZA ALI KHAMIS", "KARANGE,SALUM", "MNYIMBI,HAMAD", "MNYIMBI,FATUMA", "MCHANGANI,MOHD", "M/KIDATU,MWANAISHA SALEH ALI", "KONDE,BIMKASI", "TUMBE MASHARIKI,ALI SHAURI HAJI", "KARANGE,MUKRIM", "MTMBILE,LAILATI", "MTAMBILE,YUSSUF", "MTAMBILE,MACHANO", "VIJIBWENI,IBAHIM", "MTAMBILE,HAWA", "MTAMBILE,ZUHURA", "MELI NNE,RASULI", "NGAMBWA,MKWABI", "DONGE  MCHANGANI,MAKAME", "OLE,OMI", "MKOKOTONI,SEMENI", "SHAKANI,HALIMA", "SHAKANI,FAUZIA", "BWELEO,MWINJUMA", "BWELEO,HALIMA", "MSUKA,SAID SALUM", "KANDWI,IBRAHIM", "KIUNGONI,HAITHAM", "SHARIF MSA,ZAINAB ADAMU AMIRI", "TONDOONI,MAKAME FAKI", "KIBONDENI,HAIRATI", "D. MCHANGANI,RIZIKI", "D. MCHANGANI,YUSRA", "UPENJA,JUMA", "SHAKANI,TUKENA", "NDAGONI,ASYA", "SHAKANI,KIHENGA", "MTAMBWE KASKAZINI,HAWA MALIK", "DUNGA K,SULEIMAN", "MIHOGONI,YUSSUF", "MAKANGALE,AISHA", "KIDANZINI,JOGHA", "KIDANZINI,SABRINA", "TUNGUU,ERNEST", "KIBONDENI,ASHRAK", "KINUNI,YUSSUF", "KISAUNI,MOHD OMAR KHAIID", "KITUMBA,HIDAYA SULEIMAN SAIDI", "PIKI,ISMAIL MSHAMATA", "KANDWI,KAZIJA", "K UPELE,HAJI", "K/UPELE,HAJI", "JENDELE,HAJI", "MWAKAJE,EMANUEL LUCAS", "CHUKWANI,MAIMUNA HASSAN", "MTANGANI,IDRISA", "MCHANGANI,RAMADHAN", "CHUWINI,AISAR", "CHIMBA,KHATIB ALI KHATIB", "JENDELE,TATU", "MAJENZI,KHALFANI ALI MASOUD", "JADIDA,TIME", "KIUYU MBUYUNI,BIKOMBO SALIM RASHID", "VITONGOJI,MAUA", "GOMBANI,HAFIDH", "MIZINGANI,KOMBO", "MWERA,RASHID", "M WERA,IDRISA", "KONDE,MARYAM", "CHUKWANI,ALI MZEE SALEH", "WAMBAA,MKASI KHATIB", "WAMBAA,SAID BARAKA", "WAMBAA,KADIRU SLEIMAN", "WAMBAA,IDRISA OTHMAN", "TUMBE MASHARIKI,HELENA MAULID MTAWA", "WAMBAA,MUHD OMI", "WAMBAA,IDRISA OTHMAN", "MFENESINI,AZIZ SULEIMAN", "WAMBAA,FATMA HIMID OMAR", "WAMBAA,FATMA HIMID OMAR", "WAMBAA,FATMA HIMID OMAR"];
        _.each(result.rows, function(row) {
          return _.each(dupeTargets, function(value) {
            var name, shehia, _ref1;

            _ref1 = value.split(","), shehia = _ref1[0], name = _ref1[1];
            if (row.doc.shehia === shehia && row.doc.name === name) {
              if (found[value]) {
                return dupes.push(row.doc);
              } else {
                console.log("saving copy of " + (JSON.stringify(row.doc)));
                return found[value] = true;
              }
            }
          });
        });
        console.log(dupes);
        i = 0;
        return _.each(dupes, function(dupe) {
          i++;
          return $.couch.db(Coconut.config.database_name()).removeDoc(dupe);
        });
      }
    });
  };

  CleanView.prototype.searchForManualCaseIDs = function() {
    var _this = this;

    return this.resultCollection.each(function(result) {
      return _.each(_.keys(result.attributes), function(key) {
        var caseID, recommendedChange;

        if (key.match(/MalariaCaseID/i)) {
          caseID = result.get(key);
          if (caseID != null) {
            if (!caseID.match(/[A-Z][A-Z][A-Z]\d\d\d/)) {
              recommendedChange = caseID.replace(/[\ \.\-\/_]/, "");
              recommendedChange = recommendedChange.toUpperCase();
              if (recommendedChange.match(/[A-Z][A-Z][A-Z]\d\d\d/)) {
                if (_this.args === "apply_caseIDs") {
                  if (User.currentUser.username() !== "admin") {
                    throw "Must be admin";
                  }
                  result.save(key, recommendedChange);
                }
              } else {
                recommendedChange = "Fix manually";
              }
              return $("#caseIDs tbody").append("                <tr>                  <td>" + caseID + "</td>                  <td>" + recommendedChange + "</td>                </tr>              ");
            }
          }
        }
      });
    });
  };

  CleanView.prototype.searchForDates = function() {
    var _this = this;

    return this.resultCollection.each(function(result) {
      return _.each(_.keys(result.attributes), function(key) {
        var cleanedDate, date;

        if (key.match(/date/i)) {
          date = result.get(key);
          if (date != null) {
            _this.total++;
            cleanedDate = _this.cleanDate(date);
            if (cleanedDate[1] !== "No action recommended") {
              $("#dates table").append("                <tr>                  <td><a href='#show/case/" + (result.get("MalariaCaseID")) + "'>" + (result.get("MalariaCaseID")) + "</a></td>                  <td>" + key + "</td>                  <td>" + date + "</td>                  <td>" + cleanedDate[0] + "</td>                  <td>" + cleanedDate[1] + "</td>                </tr>              ");
              if (_this.args === "apply_dates" && cleanedDate[0]) {
                if (User.currentUser.username() !== "admin") {
                  throw "Must be admin";
                }
                return result.save(key, cleanedDate[0]);
              }
            }
          }
        }
      });
    });
  };

  CleanView.prototype.cleanDate = function(date) {
    var dateMatch, day, first, month, second, third, year;

    dateMatch = date.match(/^(\d+)([ -/])(\d+)([ -/])(\d+)$/);
    if (dateMatch) {
      first = dateMatch[1];
      second = dateMatch[3];
      third = dateMatch[5];
      if (second.match(/201\d/)) {
        return [null, "Invalid year"];
      }
      if (first.match(/201\d/)) {
        year = first;
        if (dateMatch[2] !== "-") {
          day = second;
          month = third;
          return [this.format(year, month, day), "Non dash separators, not generated by tablet, can assume yy,dd,mm"];
        } else {
          return [null, "No action recommended"];
        }
      } else if (third.match(/201\d/)) {
        day = first;
        month = second;
        year = third;
        return [this.format(year, month, day), "Year last, not generated by tablet, can assume dd,mm,yy"];
      } else {
        return [null, "Can't find a date"];
      }
    } else {
      return [null, "Can't find a date"];
    }
  };

  CleanView.prototype.format = function(year, month, day) {
    year = parseInt(year, 10);
    month = parseInt(month, 10);
    day = parseInt(day, 10);
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return "" + year + "-" + month + "-" + day;
  };

  return CleanView;

})(Backbone.View);

/*
//@ sourceMappingURL=CleanView.map
*/