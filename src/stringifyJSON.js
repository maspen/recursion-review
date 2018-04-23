// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {

  if(typeof obj === 'string') {
    return '\"' + obj + '\"';
  }
  if (typeof obj === 'boolean') {
    return '' + obj;
  }
  if (typeof obj === 'number') {
    return '' + obj;
  }
  if (_.isDate(obj)) {
    return '' + obj.toISOString();
  }
  if (obj === null) {
    return '' + null;
  }
  if (_.isUndefined(obj) || _.isFunction(obj) || obj === Infinity || _.isNaN(obj) || typeof obj === 'symbol') {
    return null;
  }
  

  if(Array.isArray(obj)) {
    return '[' +
      obj.map(function(element){
        return stringifyJSON(element);
      }).join(',')
      + ']';
  }
  if(typeof obj === 'object') {
    var arrayResult = [];
    Object.keys(obj).forEach(function(key){
      var value = stringifyJSON(obj[key]);
      if(value === undefined) {
        arrayResult.push('{}');
      }
      if(null !== value) {
        arrayResult.push('\"' + key + '\":' + value);
      }
    });
    return '{' + arrayResult.join(',') + '}';
  }

  
};
