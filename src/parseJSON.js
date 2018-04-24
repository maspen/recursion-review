// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  // your code goes here
  /*
    need to account for all data types
    object
    {}
    { members }
    members
        pair
        pair , members
    pair
        string : value
    array
        []
        [ elements ]
    elements
        value 
        value , elements
    value
        string
        number
        object
        array
        true
        false
        null
        
    * need method that will make available to 'next char'
    * need object 'type' that will use keys for the different types, and values
    for the methods that can handle those types
    * need methods to handle all the types
  */
  
  var index = 0;
  var char;
  var next = function() {
    index++;
    return json.charAt(index);
  };
  
  // error message function
  var errorMessage = function(msg) {
    console.log(msg);
    throw undefined;
  };
  
  
  // control/special characters
  var controlCharacters = {
    '\"': '\"',
    '\\': '\\',
    '\/': '\/',
    'b': '\b',
    'f': '\f',
    'n': '\n',
    'r': '\r',
    't': '\t'
  };
  
  // type function that determines which function to call depending on 'char'
  var type = function() {
    console.log('----- type char: ' + char);
    var types = {
      '[': array,
      '{': object,
      '\"': string,
      ' ': empty,
      'n': nullTrueFalse,
      't': nullTrueFalse,
      'f': nullTrueFalse,
      '0': number,
      '1': number,
      '2': number,
      '3': number,
      '4': number,
      '5': number,
      '6': number,
      '7': number,
      '8': number,
      '9': number,
      '-': number
    };
    return types[char]();  
  };
  
  // * number
  // for numbers, want to get consecutive
  // * digits when we encounter a ngative sign '-'
  // * of a decimal place '.'
  var number = function() {
    var number = '';
    
    var getConsecutiveDigits = function() {
      while (char && char >= 0 && char <= 9) {
        number += char;
        next();
      }
    };
    
    // account for negative numbers
    if (char === '-') {
      number += char;
      next();
    }
    
    getConsecutiveDigits();
    
    // account for decimal places
    if (char === '.') {
      number += char;
      next();
      getConsecutiveDigits();
    }
    
    return Number(number);
  };
  
  // * null + true + false
  var nullTrueFalse = function() {
    var string = '';
    if (char === 'n') {
      // null
      var possible = json.substring(index, index + 4);
      console.log('possible ' + possible);
      if (possible === 'null') {
        // advance char
        _.times(4, function() {
          next();
        });
        return null;
      }
    } 
    if (char === 't') {
      // true
      var possible = json.substring(index, index + 4);
      if (possible === 'true') {
        // advance char
        _.times(4, function() {
          next();
        });
        return true;
      }
    }
    if (char === 'f') {
      var possible = json.substring(index, index + 5);
      if (possible === 'false') {
        // advance char
        _.times(5, function() {
          next();
        });
        return false;
      }
    }
  };
  
  // * string
  var quotesOpen = false;
  var string = function() {
    var string = '';
    // could be a space, eg: "boolean, true": true,^"boolean, false"
    if (char === ' ' && !quotesOpen) {
      next();
    }
    // first quote of a string
    if (char !== '\"') {
      errorMessage('a string should start with \"');
    }
    
    next(); // removes the opening quote
    quotesOpen = true;
    //console.log('----- string char BEFORE while loop ' + char);
    while (char) {
      if (char === '\"') {
        quotesOpen = false;
        next();
        console.log('----- string returning string: ' + string);
        return string;
      }
      
      // escape characters?
      if (char === '\\') {
        next();
        // check to see if we have matching control character
        if (controlCharacters.hasOwnProperty(char)) {
          // add it to the string
          string += controlCharacters[char];
        } else {
          string += char;
        }
      } else {
        string += char;
      }
      
      next();
    }
  };
  
  // * object
  var object = function() {
    var object = {};
    if (char !== '{') {
      errorMessage('an object should start with an opening curly bracket \'{\'');
    }
    if (next() === '}') {
      next();
      return object;
    }
    
    do {
      // could have nested object so "},{" and current character is '{'
      if (char === '{') {
        type();
      }
      var key = string();
      if (char !== ':') {
        errorMessage('object key value divider expected \":\"');
      }
      next();

      object[key] = type();

      if (char === '}' || json.charAt(index + 1) === '}') {
        next();
        return object;
      } else {
        if (char === '}') {
          next();
        }
      }
    } while (char && char === ',' && next());
  };
  
  // * array
  var array = function() {
    var array = [];
    // char should be at the opening bracket '['
    if (char !== '[') {
      errorMessage('an array should start with an opening bracket \'[\'');
    }
    if (next() === ']') {
      // return an empty array
      // need to increment next() in case of '[]'
      next();
      return array;
    }
    
    do {
      array.push(type());
      if (char === ']') {
        // got to end of array
        next();
        return array;
      }
    } while (char && char === ',' && next());
  };
  
  // * empty
  var empty = function() {
    next();
    return type();
  };
  
  char = json.charAt(index);
  console.log('calling type()');
  return type();
  
};
