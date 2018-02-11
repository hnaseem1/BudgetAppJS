// Budget controller
var budgetController = (function() {

    var Expense = function(id, description, amount) {
      this.id = id;
      this.description = description;
      this.amount = amount;
      this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome)

    {
      if (totalIncome > 0) {

      this.percentage = Math.round((this.amount / totalIncome) * 100)

    } else {

      this.percentage = -1;
    }

    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, amount) {
      this.id = id;
      this.description = description;
      this.amount = amount;
    };

    var calculateTotal = function(type) {
      var sum = 0;
      data.allItems[type].forEach(function(cur) {
        sum += cur.amount;
      });

      data.totals[type] = sum;
    };


    var allExpenses = [];
    var allIncomes = [];
    var totalExpenses = 0;
 
    // JSON.stringify() to be used for downloading this data in JSON future! 

    var data = {
        allItems: {
          exp: [],
          inc: []
        },
        totals: {
          exp: 0,
          inc: 0
        },
        budget: 0,
        percentage: -1

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

    deleteItem: function(type, id) {
      var ids, index;

      // id = 3
      ids = data.allItems[type].map(function(current) {
          return current.id;
      });

      index = ids.indexOf(id);


      if (index !== -1) {

        data.allItems[type].splice(index, 1);


      }


    },

    calculateBudget: function() {

      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage of income that we spent
      if (data.totals.inc > 0) {

          data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

      } else {

          data.percentage = -1;

      }




    },

    calculatePercentages: function() {

      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });

    },

    getPercentages: function() {

      var allPerc = data.allItems.exp.map(function(cur) {

        return cur.getPercentage();

      });

        return allPerc;

    },

    getBudget: function() {

      return {
          budget: data.budget,
          totalInc: data.totals.inc,
          totalExp: data.totals.exp,
          percentage: data.percentage

      }


    },

    testing: function() {
      console.log(data);
    }

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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container:'.container',
        expensesPercLebel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };

    var formatNumber = function(num, type) {
      var numSplit, int, dec, type;

      /*
        + or - before number
        exactly 2 decimal points
        coma seperating the thousands
      */

      num = Math.abs(num);
      num = num.toFixed(2);

      numSplit = num.split('.');
      int = numSplit[0];

      if (int.length > 3) {
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // input 2210 - output 2,310
      }

      dec = numSplit[1];

      return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach = function(list, callback) {

      for(var i = 0; i < list.length; i++) {
        callback(list[i], i);
      }
    };


    return {

// function key to make a private function public that could be called in another IIFE (Immidiately invoked function expression)
      getinput: function() {

        return {
          type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
          description: document.querySelector(DOMstrings.inputDesc).value,
          value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
        };
      },

// another function key
      addListItem: function(obj, type) {
        var html, newHtml, element;
            // create html string with placeholder text
        if (type === 'inc') {

          element = DOMstrings.incomeContainer;

          html =  '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix">  <div class="item__value">%value%</div> <div class="item__delete">  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        } else if (type === 'exp') {

          element = DOMstrings.expensesContainer;


          html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix">  <div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete">  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }

          newHtml = html.replace('%id%', obj.id);
          newHtml = newHtml.replace('%description%', obj.description);
          newHtml = newHtml.replace('%value%', formatNumber(obj.amount, type));

            //insert the html into the DOM
          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

      },

      deleteListItem : function(selectorID) {

        var el = document.getElementById(selectorID)

        el.parentNode.removeChild(el);


      },

      clearFields: function() {

          var fields, fieldsArr;

          fields = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputValue);

          fieldsArr = Array.prototype.slice.call(fields);

          fieldsArr.forEach(function(current, index, array) {
            current.value = "";

          });

          fieldsArr[0].focus();
      },

      displayBudget: function(obj) {
        var type

        obj.budget > 0 ? type = 'inc' : type = 'exp';

        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');


        if (obj.percentage > 0) {

            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";

        } else {

            document.querySelector(DOMstrings.percentageLabel).textContent = "-- %";
        }

      },

      displayPercentages: function(percentages) {

        var fields = document.querySelectorAll(DOMstrings.expensesPercLebel);



        nodeListForEach(fields, function(current, index) {

          if (percentages[index] > 0 ) {

            current.textContent = percentages[index] + '%';

          } else {

            current.textContent = "-- %";

          }

        });


      },

      displayMonth: function() {
        var now, year, month, months;

        now = new Date();

        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        month = months[now.getMonth()];
        year = now.getFullYear();

        document.querySelector(DOMstrings.dateLabel).textContent = month + ' ' +year;

      },

      changedType: function() {

        var fields = document.querySelectorAll(
          DOMstrings.inputType + ',' + DOMstrings.inputDesc + ',' + DOMstrings.inputValue
        )

        nodeListForEach(fields, function(cur) {

          cur.classList.toggle('red-focus');


        });

        document.querySelector(DOMstrings.inputBtn).classList.toggle('red')

      },

      getDOMstrings: function() {
        return DOMstrings;
      }
    }



})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {

      var DOM = UICtrl.getDOMstrings();
      var setupEventListeners = function() {
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {

          if (event.keycode === 13 || event.which === 13) {

            ctrlAddItem();

          }

        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

      };

      var updateBudget = function() {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
       var budget = budgetCtrl.getBudget();

        // 3. Display the Budget to the UI
        UICtrl.displayBudget(budget)
      };

      var updatePercentages = function() {

        //1. calculate percentages
        budgetCtrl.calculatePercentages();

        //2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        //3. update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
      };


      var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get field input data
        input = UICtrl.getinput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

          // 2. add item to the budget controller
          newItem = budgetCtrl.addItem(input.type, input.description, input.value);

          // 3. Add the new item to the UI
          UICtrl.addListItem(newItem, input.type);

          // 4. Clear the field
          UICtrl.clearFields();

          // 5. calculate and update budget
          updateBudget();

          //6. calculate and update percentages
          updatePercentages();

        }

      };
      var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, iD;

          itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
          if (itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            iD = parseInt(splitID[1]);

            // 1. Delete item from the data structutre
            budgetCtrl.deleteItem(type, iD);

            // 2. Delete item from user interface
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

            //4. calculate and update percentages
            updatePercentages();

          }
      };
      return {
        init: function() {

          UICtrl.displayMonth();
          UICtrl.displayBudget({
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: -1
          });
          setupEventListeners();
        }
      };

})(budgetController, UIController);

// Application Starts from here!

controller.init();
