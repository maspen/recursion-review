// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };
/*
You should use document.body, element.childNodes, and element.classList
*/

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className) {
  // your code here
  /*
    traverse html body from the top (document.body)
    see if it has element.classList name 'className' -> yes, add to array
                                                    -> no, has children?

    has children, send each "up" to the function
  */
  //console.log(document.body.element.classList);
  var matchArr = [];
  var searchNodes = function(node) {
    if (node.classList && node.classList.contains(className)) {
      matchArr.push(node);
    }

    if (node.hasChildNodes()) {
      for (var i = 0; i < node.childNodes.length; i++) {
        searchNodes(node.childNodes[i]);
      }
    }
  };

  searchNodes(document.body);
  
  //console.log('matchArr ' + matchArr);

  return matchArr;
};


