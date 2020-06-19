const Fertilized_product = require("../models/fertilized_product.model");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Place everything under the Solver Name Space
var Solver = function () {
  "use strict";
  //-------------------------------------------------------------------
  // I'm putting an object inside of this function to house
  // all private methods
  //-------------------------------------------------------------------
  var obj = {};

  // Expose the obj to the world for testing; Maybe remove from production
  this._helpers = obj;

  //-------------------------------------------------------------------
  // Function: max
  // Puprose: Iterate over a 1d array to find its max
  //
  // Example: obj.max([1,3,4,5,6]) === 6
  //-------------------------------------------------------------------
  obj.max = function (ary) {
    var i,
      tmp = -1e99,
      len = ary.length;

    for (i = 0; i < len; i++) {
      tmp = ary[i] > tmp ? ary[i] : tmp;
    }
    return tmp;
  };

  //-------------------------------------------------------------------
  // Function: min
  // Puprose: Iterate over a 1d array to find its min
  //-------------------------------------------------------------------
  obj.min = function (ary) {
    var i,
      tmp = 1e99,
      len = ary.length;

    for (i = 0; i < len; i++) {
      tmp = ary[i] < tmp ? ary[i] : tmp;
    }
    return tmp;
  };

  // Quick and dirty method to round numbers
  obj.round = function (num, precision) {
    return (
      Math.round(num * Math.pow(10, precision - 0)) /
      Math.pow(10, precision - 0)
    );
  };

  // Method to quickly transpose a 2d array
  obj.transpose = function (a) {
    return Object.keys(a[0]).map(function (c) {
      return a.map(function (r) {
        return r[c];
      });
    });
  };

  /****************************************************
   * Method to get the intersecting keys from 2 Objects
   * todo: benchmark this against other methods
   * **************************************************
   */
  obj.shared = function (a, b) {
    a = Object.keys(a);
    b = Object.keys(b);

    return a.filter(function (d) {
      return b.indexOf(d) !== -1;
    });
  };

  // Function to see if a number is an integer or not
  obj.isInt = function (num, precision) {
    precision = precision || 5;
    return Math.round(num) === obj.round(num, precision);
  };

  // Function to check the intregrality of the solution
  obj.integral = function (model, solution, precision) {
    var i,
      keys = obj.shared(model.ints, solution);
    for (i = 0; i < keys.length; i = i + 1) {
      if (!obj.isInt(solution[keys[i]], precision)) {
        return false;
      }
    }
    return true;
  };

  // Function to find the most fractional variable of the 'ints' constraints
  obj.frac = function (model, solution) {
    var best = 10,
      split = "",
      key;
    for (key in model.ints) {
      if (model.ints.hasOwnProperty(key)) {
        if (best > Math.abs((solution[key] % 1) - 0.5)) {
          best = Math.abs((solution[key] % 1) - 0.5);
          split = key;
        }
      }
    }
    return split;
  };

  //-------------------------------------------------------------------
  // Function: spread
  // Puprose: creates a 1d Array of 'l' length filled with '0's except
  //          at position 'p' which becomes 'num'
  //-------------------------------------------------------------------
  obj.spread = function (l, p, num) {
    return new Array(l)
      .join()
      .split(",")
      .map(function (e, i) {
        return i === p ? num : 0;
      });
  };

  //-------------------------------------------------------------------
  // Function: slack
  // Purpose: Create the base tableau from a 2d Array of Variables
  //
  //          *note* The objective row is being pre populated with
  //          "0" values so we don't have to worry about creating
  //          it later
  //-------------------------------------------------------------------
  obj.slack = function (tbl) {
    var len = tbl.length,
      base,
      p,
      i;

    for (i = 0; i < len; i = i + 1) {
      base = i !== len - 1 ? 1 : 0;
      p = i !== len - 1 ? 0 : 1;

      tbl[i] = [p].concat(tbl[i].concat(this.spread(len, i, base)));
    }
  };

  //-------------------------------------------------------------------
  // Function: pivot
  // Purpose: Execute pivot operations over a 2d array,
  //          on a given row, and column
  //-------------------------------------------------------------------
  obj.pivot = function (tbl, row, col, tracker, transposed) {
    var target = tbl[row][col],
      length = tbl.length,
      width = tbl[0].length,
      rowEl,
      i,
      j;

    tracker[row] = col - 1;
    // Divide everything in the target row by the element @
    // the target column
    for (i = 0; i < width; i = i + 1) {
      tbl[row][i] = tbl[row][i] / target;
    }

    // for every row EXCEPT the target row,
    // set the value in the target column = 0 by
    // multiplying the value of all elements in the objective
    // row by ... yuck... just look below; better explanation later
    for (i = 0; i < length; i = i + 1) {
      if (i !== row) {
        rowEl = tbl[i][col];
        for (j = 0; j < width; j = j + 1) {
          tbl[i][j] = -rowEl * tbl[row][j] + tbl[i][j];
        }
      }
    }
  };
  //-------------------------------------------------------------------
  // Function: phase1
  // Purpose: Convert a non standard form tableau
  //          to a standard form tableau by eliminating
  //          all negative values in the right hand side
  //-------------------------------------------------------------------
  obj.phase1 = function (tbl) {
    var rhs, row, col;
    console.log("phase 1");
    // Sloppy method for finding the smallest value in the Right Hand Side
    rhs = obj.transpose(tbl).slice(-1)[0].slice(0, -1);

    row = obj.min(rhs);

    // If nothing is less than 0; we're done with phase 1.
    if (row >= 0) {
      return true;
    } else {
      row = rhs.indexOf(row);
      col = obj.min(tbl[row].slice(0, -1));
      if (col >= 0) {
        return true;
      } else {
        col = tbl[row].indexOf(col);
        return {
          row: row,
          col: col,
        };
      }
    }
  };

  //-------------------------------------------------------------------
  // Function: phase2
  // Purpose: Convert a non standard form tableau
  //          to a standard form tableau by eliminating
  //          all negative values in the right hand side
  //-------------------------------------------------------------------
  obj.phase2 = function (tbl) {
    var col,
      row,
      quotient,
      length = tbl.length,
      width = tbl[0].length,
      objRow,
      min,
      i,
      dividend;
    console.log("phase 2");
    // Step 1. Identify the smallest entry in the objective row
    objRow = tbl.slice(-1)[0].slice(0, -1);
    min = obj.min(objRow);

    // Step 2a. If its non-negative, stop. A solution has been found
    if (min >= 0) {
      return true;
    } else {
      // Step 2b. Otherwise, we have our pivot column
      col = objRow.indexOf(min);

      // Step 3a. If all entries in the pivot column are <= 0;
      // stop. The solution is unbounded;

      quotient = [];
      for (i = 0; i < length - 1; i = i + 1) {
        if (tbl[i][col] > 0.001) {
          quotient.push(tbl[i][width - 1] / tbl[i][col]);
        } else {
          quotient.push(1e99);
        }
      }
      dividend = obj.min(quotient);
      row = quotient.indexOf(dividend);

      if (dividend > -1 && dividend < 1e99) {
        return {
          row: row,
          col: col,
        };
      } else {
        return false;
      }
    }
  };

  //-------------------------------------------------------------------
  // Function: optimize
  // Purpose: Convert a non standard form tableau
  //          to a standard form tableau by eliminating
  //          all negative values in the right hand side
  //-------------------------------------------------------------------
  obj.optimize = function (tbl) {
    var tracker = [],
      results = {},
      counter,
      test;

    // Create a transposition of the array to track changes;

    // Execute Phase 1 to Normalize the tableau;
    for (counter = 0; counter < 1000; counter = counter + 1) {
      test = obj.phase1(tbl);
      if (test === true) {
        break;
      } else {
        obj.pivot(tbl, test.row, test.col, tracker);
      }
    }

    // Execute Phase 2 to Finish;
    for (counter = 0; counter < 1000; counter = counter + 1) {
      test = obj.phase2(tbl);
      if (typeof test === "object") {
        obj.pivot(tbl, test.row, test.col, tracker);
      } else {
        if (test === true) {
          break;
        } else if (test === false) {
          results.feasible = false;
          break;
        }
      }
    }
    for (counter = 0; counter < tracker.length; counter = counter + 1) {
      results[tracker[counter]] = tbl[counter].slice(-1)[0];
    }

    results.result = tbl.slice(-1)[0].slice(-1)[0];
    results.feasible =
      obj.min(obj.transpose(tbl).slice(-1)[0].slice(0, -1)) > -0.001
        ? true
        : false;
    return results;
  };

  //-------------------------------------------------------------------
  //Function: Solve
  //Detail: Main function, linear programming solver
  //-------------------------------------------------------------------
  obj.Solve = function (model) {
    var tableau = [], //The LHS of the Tableau
      rhs = [], //The RHS of the Tableau
      cstr = Object.keys(model.constraints), //Array with name of each constraint type
      vari = Object.keys(model.variables), //Array with name of each Variable
      opType = model.opType === "max" ? -1 : 1,
      hsh,
      len,
      z = 0,
      i,
      j,
      x,
      constraint,
      variable,
      rslts;

    //Give all of the variables a self property of 1
    for (variable in model.variables) {
      model.variables[variable][variable] = 1;
      //if a min or max exists in the variables;
      //add it to the constraints
      if (typeof model.variables[variable].max !== "undefined") {
        model.constraints[variable] = model.constraints[variable] || {};
        model.constraints[variable].max = model.variables[variable].max;
      }

      if (typeof model.variables[variable].min !== "undefined") {
        model.constraints[variable] = model.constraints[variable] || {};
        model.constraints[variable].min = model.variables[variable].min;
      }
    }

    cstr = Object.keys(model.constraints); //Array with name of each constraint type
    vari = Object.keys(model.variables); //Array with name of each Variable

    //Load up the RHS
    for (constraint in model.constraints) {
      if (typeof model.constraints[constraint].max !== "undefined") {
        tableau.push([]);
        rhs.push(model.constraints[constraint].max);
      }

      if (typeof model.constraints[constraint].min !== "undefined") {
        tableau.push([]);
        rhs.push(-model.constraints[constraint].min);
      }
    }

    //Load up the Tableau
    for (i = 0; i < cstr.length; i = i + 1) {
      constraint = cstr[i];

      if (typeof model.constraints[constraint].max !== "undefined") {
        for (j = 0; j < vari.length; j = j + 1) {
          tableau[z][j] =
            typeof model.variables[vari[j]][constraint] === "undefined"
              ? 0
              : model.variables[vari[j]][constraint];
        }
        z = z + 1;
      }

      if (typeof model.constraints[constraint].min !== "undefined") {
        for (j = 0; j < vari.length; j = j + 1) {
          tableau[z][j] =
            typeof model.variables[vari[j]][constraint] === "undefined"
              ? 0
              : -model.variables[vari[j]][constraint];
        }
        z = z + 1;
      }
    }

    //Add an array to the tableau for the Objective Function
    tableau.push([]);

    //Add the Objective Function
    for (j = 0; j < vari.length; j = j + 1) {
      tableau[tableau.length - 1][j] =
        typeof model.variables[vari[j]][model.optimize] === "undefined"
          ? 0
          : opType * model.variables[vari[j]][model.optimize];
    }

    //Add Slack Variables to the Tableau
    obj.slack(tableau);

    //Add on the Right Hand Side variables
    len = tableau[0].length;
    for (x in rhs) {
      tableau[x][len - 1] = rhs[x];
    }

    rslts = obj.optimize(tableau);
    hsh = {
      feasible: rslts.feasible,
    };

    for (x in rslts) {
      if (typeof vari[x] !== "undefined") {
        if (rslts[x] < 0) {
          hsh.feasible = false;
        }
        hsh[vari[x]] = rslts[x];
      }
    }

    hsh.result = -opType * rslts.result;
    return hsh;
  };

  //-------------------------------------------------------------------
  // Function: MILP
  // Detail: Main function, my attempt at a mixed integer linear programming
  //         solver
  // Plan:
  //      What we're aiming at here is to
  //-------------------------------------------------------------------
  obj.MILP = function (model, precision) {
    obj.models = [];
    obj.priors = {};
    console.log("MLP");
    var y = 0,
      minmax = model.opType === "min" ? -1 : 1,
      solution = {},
      key,
      iHigh,
      iLow,
      branch_a,
      branch_b,
      tmp;

    // This is the default result
    // If nothing is both *integral* and *feasible*
    obj.best = {
      result: -1e99 * minmax,
      feasible: false,
    };

    // And here...we...go!

    // 1.) Load a model into the queue
    obj.models.push(model);

    // If all branches have been exhausted, or we've been piddling around
    // for too long, one of these 2 constraints will terminate the loop
    while (obj.models.length > 0 && y < 1200) {
      // Get a model from the queue
      model = obj.models.pop();
      // Solve it
      solution = obj.Solve(model);

      // Is the model both integral and feasible?
      if (obj.integral(model, solution, precision) && solution.feasible) {
        // Is the new result the best that we've ever had?
        if (solution.result * minmax > obj.best.result * minmax) {
          // Store the solution as the best
          obj.best = solution;
        }
      } else if (
        solution.feasible &&
        solution.result * minmax > minmax * obj.best.result
      ) {
        // Find out where we want to split the solution
        key = obj.frac(model, solution);

        // Round up
        iHigh = Math.ceil(solution[key]);
        // Copy the old model into the new branch_a variable
        branch_a = JSON.parse(JSON.stringify(model));
        // If there was already a constraint on this variable, keep it; else add one
        branch_a.constraints[key] = branch_a.constraints[key] || {};
        // Set the new constraint on this variable
        branch_a.constraints[key].min = iHigh || 1;

        tmp = JSON.stringify(branch_a);
        if (!obj.priors[tmp]) {
          obj.priors[tmp] = 1;
          obj.models.push(branch_a);
        }

        iLow = Math.floor(solution[key]);
        branch_b = JSON.parse(JSON.stringify(model));
        branch_b.constraints[key] = branch_b.constraints[key] || {};
        branch_b.constraints[key].max = iLow || 0;

        tmp = JSON.stringify(branch_b);
        if (!obj.priors[tmp]) {
          obj.priors[tmp] = 1;
          obj.models.push(branch_b);
        }

        y = y + 1;
      }
    }
    return obj.best;
  };

  /*************************************************************
   * Method: Solve
   * Scope: Public:
   **************************************************************/
  this.Solve = function (model, precision) {
    // Make sure we at least have a model
    if (!model) {
      throw new Error("Solver requires a model to operate on");
    }

    precision = precision || 5;
    if (model.ints) {
      return obj.MILP(model, precision);
    } else {
      return obj.Solve(model);
    }
  };
};

// Determine the environment we're in.
(function () {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = new Solver();
  } else if (typeof define === "function") {
    define([], function () {
      return Solver;
    });
  }
})();

let optimize = (req, res) => {
  let ctr = req.params.id;
  let arr = [];
  Fertilized_product.find(
    { country: { $in: [ctr] } },
    (err, Fertilized_product) => {
      if (err) {
        res.send("an error has occured " + err);
      } else if (!Fertilized_product) res.status(404).send("Product not found");
      else {
        let data = {};
        for (let i = 0; i < Fertilized_product.length; i++) {
          data[Fertilized_product[i]._id] = {
            N: Fertilized_product[i].N,
            P: Fertilized_product[i].P,
            K: Fertilized_product[i].K,
            cost: Fertilized_product[i].prix,
          };
        }
        // console.log("data", data);
        model = {
          optimize: "cost",
          opType: "min",
          constraints: {
            N: {
              min: req.body.N,
            },
            P: {
              min: req.body.P,
            },
            K: {
              min: req.body.K,
            },
          },
          variables: data,
        };

        var solver = new Solver(),
          results,
          results = solver.Solve(model);
        res.send(results);
        console.log(results);
      }
    }
  );
};
let getRProduct = (req, res) => {
  Fertilized_product.find(
    {
      _id: { $in: req.body.ids },
    },
    function (err, docs) {
      // console.log(docs);
      res.send(docs);
    }
  );
};

module.exports = {
  optimize,
  getRProduct,
};
