'use strict';

(function() {

    var app = angular.module('beeGame', ['ngRoute']);

    app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

            $locationProvider.hashPrefix('');

            $routeProvider.when('/game', {
                templateUrl: 'views/game.html',
                controller: 'gameCtrl'
            })
            .otherwise({
                redirectTo: '/',
                 templateUrl: 'views/default.html'
             });

        }

    ]);

    app.service('beeService', function($timeout) {

        // Bees control
        var bees = [];

        var _addBee = function(newObj) {
            bees.push(newObj);
        };

        var _getBees = function() {
            return bees;
        };

        var _resetBees = function() {
            bees.length = 0;
        }

        return {addBee: _addBee, getBees: _getBees, resetBees: _resetBees};

    });

    function singleBee(type) {

        switch (type) {

            case 'queen':
                return {'type': type, 'maxlifespan': 100, 'lifespan': 100, 'hitpoints': 8};

            case 'worker':
                return {'type': type, 'maxlifespan': 75, 'lifespan': 75, 'hitpoints': 10};

            case 'drone':
                return {'type': type, 'maxlifespan': 50, 'lifespan': 50, 'hitpoints': 12};

            default:
                throw new Error('No type of bee specified');
        }

    };

    function createBees(service) {

        var i;
        service.addBee(singleBee('queen'));

        for (i = 0; i < 5; i++) {
            service.addBee(singleBee('worker'));
        }

        for (i = 0; i < 8; i++) {
            service.addBee(singleBee('drone'));
        }

    };

    app.controller('gameCtrl', function($scope, $timeout, beeService) {

        var previousBeeList = [];

        var updatePreviousList = function(newBeeList) {
            angular.copy(newBeeList, previousBeeList);
        };

        var updateClass = function(index) {

            $('.m-game__bee--' + index).addClass('active');

            $timeout( function(){
                $('.m-game__bee--' + index).removeClass('active');
            }, 400)

        };

        updatePreviousList($scope.beeList);

        $scope.initFunction = function() {

            $scope.beesInit = createBees(beeService);

            $scope.beeList = beeService.getBees();

            updatePreviousList($scope.beeList);

        };

        $scope.$watch('beeList', function(newVal, oldVal, scope) {

            if (newVal !== oldVal) {

                for (var i = 0; i < newVal.length; i++) {

                    if (angular.equals(newVal[i], previousBeeList[i]))
                        continue;

                    var changedBee = newVal[i],
                        index = newVal.indexOf(changedBee);

                    updatePreviousList(newVal);
                    updateClass(index);

                }

            }

        }, true);

        function hitRandom() {

            var random = Math.floor((Math.random() * $scope.beeList.length));

            if ($scope.beeList[random].lifespan > 0) {

                $scope.beeList[random].lifespan -= $scope.beeList[random].hitpoints;
                if ($scope.beeList[random].lifespan < 0) {

                    $scope.beeList[random].lifespan = 0;

                }

                if ($scope.beeList[random].lifespan === 0 && $scope.beeList[random].type === 'queen') {

                    beeService.resetBees();

                    $scope.beesInit = createBees(beeService);

                }

            } else {

                hitRandom();

            }

        }

        $scope.hitRandom = hitRandom;

    });

    app.filter('capitalize', function() {
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    });

})();
