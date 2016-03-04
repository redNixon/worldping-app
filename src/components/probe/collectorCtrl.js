define([
  'lodash',
  '../../module'
],
function (_, module) {
  'use strict';

  module.controller('CollectorCtrl', function($scope, $http, $location, $filter, backendSrv) {
    $scope.pageReady = false;
    $scope.statuses = [
      {label: "Online", value: {online: true, enabled: true}, id: 2},
      {label: "Offline", value: {online: false, enabled: true}, id: 3},
      {label: "Disabled", value: {enabled: false}, id: 4},
    ];

    $scope.init = function() {
      $scope.filter = {tag: "", status: ""};
      $scope.sort_field = "name";
      $scope.collectors = [];
      $scope.getCollectors();
    };

    $scope.collectorTags = function() {
      var map = {};
      _.forEach($scope.collectors, function(collector) {
        _.forEach(collector.tags, function(tag) {
          map[tag] = true;
        });
      });
      return Object.keys(map);
    };

    $scope.setCollectorFilter = function(tag) {
      $scope.filter.tag = tag;
    };
    $scope.statusFilter = function(actual) {
      if (!$scope.filter.status) {
        return true;
      }
      var res = $filter('filter')([actual], $scope.filter.status);
      return res.length > 0;
    };
    $scope.getCollectors = function() {
      backendSrv.get('api/plugin-proxy/worldping/api/collectors').then(function(collectors) {
        $scope.pageReady = true;
        $scope.collectors = collectors;
      });
    };

    $scope.remove = function(loc) {
      backendSrv.delete('api/plugin-proxy/worldping/api/collectors/' + loc.id).then(function() {
        $scope.getCollectors();
      });
    };

    $scope.gotoDashboard = function(collector) {
      $location.path("/dashboard/db/worldping-collector-summary").search({"var-collector": collector.slug, "var-endpoint": "All"});
    };

    $scope.init();
  });
});