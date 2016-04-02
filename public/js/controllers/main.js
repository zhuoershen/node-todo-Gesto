angular.module('foodController', [])

	// inject the Food and History service factory into our controller
	.controller('mainController', ['$scope','$http','Foods','Histories', function($scope, $http, Foods, Histories) {
		$scope.formData = {};
		$scope.loading = true;
		
		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the foods
		Foods.get1()
				.success(function(data) {
					$scope.loading = false;
					$scope.foods = data;
		});
		
		$scope.getAll = function() {
			Foods.get1()
				.success(function(data) {
					$scope.loading = false;
					$scope.foods = data;
				});
		};	
		// GET =====================================================================
		// when “Total” button is pressed, send the total prices in the cart
		$scope.getTotal = function() {
			Foods.get2()
				.success(function(data){
					$scope.total = data;
					$scope.loading = false;
				});
		};
		
		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createFood = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if (($scope.formData.text != undefined) && ($scope.formData.value != undefined)) {
				$scope.loading = false;

				// call the create function from our service (returns a promise object)
				Foods.create($scope.formData)

					// if successful creation, call our get function to get all the new foods
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.foods = data; 
					}
				);
			}
		};

		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteFood = function(id) {
			$scope.loading = true;

			Foods.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = true;
					$scope.foods = data;
				});
		};
		
		// GET =====================================================================
		// when “History” button is pressed on history.html, send the submitted orders
		$scope.getHistory = function(){
			$scope.loading = true;
			Histories.get()
				.success(function(data) {
					$scope.loading = false;
					$scope.histories = data;
				});
		};
	}]);