// Generated by CoffeeScript 1.3.1
var User, UserCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

User = (function(_super) {

  __extends(User, _super);

  User.name = 'User';

  function User() {
    return User.__super__.constructor.apply(this, arguments);
  }

  User.prototype.url = "/user";

  User.prototype.username = function() {
    return this.get("_id").replace(/^user\./, "");
  };

  User.prototype.passwordIsValid = function(password) {
    return this.get("password") === password;
  };

  User.prototype.isAdmin = function() {
    return this.username() === "admin";
  };

  User.prototype.login = function() {
    $.cookie('current_user', this.username());
    $("#user").html(this.username());
    $('#district').html(this.get("district"));
    $("a[href=#logout]").show();
    $("a[href=#login]").hide();
    if (this.isAdmin()) {
      $("#manage-button").show();
    } else {
      $("#manage-button").hide();
    }
    if (this.username() === "reports") {
      $("#top-menu").hide();
      $("#bottom-menu").hide();
    }
    return User.currentUser = this;
  };

  User.prototype.refreshLogin = function() {
    return this.login();
  };

  return User;

})(Backbone.Model);

User.isAuthenticated = function(options) {
  var user;
  if ($.cookie('current_user') != null) {
    user = new User({
      _id: "user." + ($.cookie('current_user'))
    });
    return user.fetch({
      success: function() {
        user.refreshLogin();
        return options.success(user);
      },
      error: function() {
        return options.error();
      }
    });
  } else {
    return options.error();
  }
};

User.logout = function() {
  $.cookie('current_user', "");
  $("#user").html("");
  $('#district').html("");
  $("a[href=#logout]").hide();
  $("a[href=#login]").show();
  return User.currentUser = null;
};

UserCollection = (function(_super) {

  __extends(UserCollection, _super);

  UserCollection.name = 'UserCollection';

  function UserCollection() {
    return UserCollection.__super__.constructor.apply(this, arguments);
  }

  UserCollection.prototype.model = User;

  UserCollection.prototype.url = '/user';

  return UserCollection;

})(Backbone.Collection);
