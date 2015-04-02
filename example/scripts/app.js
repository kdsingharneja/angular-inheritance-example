var app = angular.module('MyApp', []);

app.factory('StateFactory', function(StateEventInfo) {
  return {
    create: function(stateName) {
      return new StateEventInfo(stateName);
    }
  };
});

//Super level factory
app.factory('StateInfo', function($http) {
  var apiBaseUrl = 'http://openstates.org/api/v1/';

  // instantiate our object
  var StateInfo = function(stateName) {
    this.stateName = stateName;
    this.stateData = null
  };

  //Default method
  StateInfo.prototype.getStateInfo = function() {
    var self = this;
    return $http.get(apiBaseUrl + 'metadata/' + this.stateName, {
      params: {
        apikey: "9d15f869c69543e8b0da511e9c389811"
      }
    }).then(function(response) {
      self.stateData = response.data
      return response;
    });
  };
  return StateInfo;
});

//Factory that borrows from StateInfo
app.factory('StateEventInfo', function($http, StateInfo) {
  var apiBaseUrl = 'http://openstates.org/api/v1/';

  var StateEventInfo = function(state) {
    StateInfo.apply(this, arguments); //<--inherintance
  };

  // super's object prototype
  StateEventInfo.prototype = new StateInfo(); //<--inherintance

  //somthing unique this child class does.
  function getStateEvents() {
    var self = this;
    return $http.get(apiBaseUrl + 'events/', {
      params: {
        apikey: "9d15f869c69543e8b0da511e9c389811",
        state: this.stateData.id
      }
    }).then(function(response) {
      self.stateData.noOfEvents = response.data.length;
      return response;
    });
  }

  // override the parents method
  StateEventInfo.prototype.getStateInfo = function() {

    // first call the super's getStateInfo method
    var originalGetProfile = StateInfo.prototype.getStateInfo.apply(this, arguments);

    // then once profile fetched, add some more state data
    var self = this;
    return originalGetProfile.then(function() {

      // call our private method, binding "this" to "self";
      return getStateEvents.call(self);
    });
  };
  return StateEventInfo;
});
