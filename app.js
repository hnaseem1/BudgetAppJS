// budget controller
var budgetController = (function() {

    // Some Code

})();

// UI Controller
var UIController = (function() {

// Code goes here


})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {

      var ctrlAddItem = function() {

        // 1. Get field input data
        // 2. add item to the budget controller
        // 3. Add the new item to the UI
        // 4. Calculate the budget
        // 5. Display the budget
        console.log("it works");

      }

      document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

      document.addEventListener('keypress', function(event) {

        if (event.keycode === 13 || event.which === 13) {

          ctrlAddItem();

        }

      console.log(event);

      });
})(budgetController, UIController);
