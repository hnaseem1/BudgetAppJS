// Budget controller
var budgetController = (function() {

    var Expense = function(id, description, amount) {
      this.id = id;
      this.description = description;
      this.amount = amount;
    };
    var Income = function(id, description, amount) {
      this.id = id;
      this.description = description;
      this.amount = amount;
    };

    var allExpenses = [];
    var allIncomes = [];
    var totalExpenses = 0;
    var data = {
        allItems: {
          exp: [],
          inc: []
        },
        totals: {
          exp: 0,
          inc: 0
        }

    };

  return {
    addItem: function(type, des, val) {
        var newItem, iD;

        // create new iD
        if (data.allItems[type].length > 0) {

          iD = data.allItems[type][data.allItems[type].length - 1].id + 1;

        } else {
          iD = 0;
        }

        //create new item based on 'inc' or 'exp' type
        if (type === 'exp') {
                  newItem = new Expense(iD, des, val);
        } else {
          newItem = new Income(iD, des, val)
        }
      // Push it into our data structure
      data.allItems[type].push(newItem);

      // return the new element
      return newItem;
    },

  }

})();
// UI Controller
var UIController = (function() {

// to avoid bugs and repetitive string writing this obhect has been created
    var DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }

    return {

// function key to make a private function public that could be called in another IIFE (Immidiately invoked function expression)
      getinput: function() {

        return {
          type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
          description: document.querySelector(DOMstrings.inputDesc).value,
          value: document.querySelector(DOMstrings.inputValue).value
        };
      },

// another function key
      addListItem: function(obj, type) {
        var html, newHtml, element;
            // create html string with placeholder text
        if (type === 'inc') {

          element = DOMstrings.incomeContainer;

          html =  '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix">  <div class="item__value">%value%</div> <div class="item__percentage"></div> <div class="item__delete">  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>  </div>';
          } else if (type === 'exp')

          element = DOMstrings.expensesContainer;

          {
          html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix">  <div class="item__value">%value%</div> <div class="item__percentage"></div> <div class="item__delete">  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>  </div>';
          }

          newHtml = html.replace('%id%', obj.id);
          newHtml = newHtml.replace('%description%', obj.description);
          newHtml = newHtml.replace('%value%', obj.amount);

            //insert the html into the DOM
          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      },

      getDOMstrings: function() {
        return DOMstrings;
      }
    }



})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {

      var setupEventListeners = function() {
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {

          if (event.keycode === 13 || event.which === 13) {

            ctrlAddItem();

          }

        });
      }
      var DOM = UICtrl.getDOMstrings();
      var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get field input data
        input = UICtrl.getinput();


        // 2. add item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the new item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. Calculate the budget

        
        

        // 5. Display the budget

      }

      return {
        init: function() {
          console.log('Application has started. ');
          setupEventListeners();
        }
      };

})(budgetController, UIController);

// Application Starts from here!

controller.init();
