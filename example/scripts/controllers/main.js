angular.module('MyApp').controller('DemoCtrl', function($scope, StateInfo, StateFactory) {

  $scope.states = [];

  $scope.fetchStateData = function() {
    $scope.states = [];
    var states = ['tx', 'ky', 'wy'];

    states.forEach(function(stateName) {
      var state = StateFactory.create(stateName);
      state.getStateInfo().then(function() {
        $scope.states.push(state);
      });
    });
  }
});
