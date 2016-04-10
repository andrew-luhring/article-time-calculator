'use strict';
//var ReadingGuesstimator = require('./article-time-calculator');
var instance = new ReadingGuesstimator({debug: true});

function constructDomTest(id, amt){
  function populateElemWithNumberOfWords(elem, num){
    var str = '';
    let i = 0;

    for(; i < num; i++){
      str += ' derp';
    }
    elem.textContent = str;
  }
  let dom = document.body;
  let testP = document.createElement('p');
  testP.id = id;
  populateElemWithNumberOfWords(testP, amt);
  dom.appendChild(testP);
}

constructDomTest('testparagraph', 200);
console.assert(instance.guessTimeToReadSelector('#testparagraph') === "1 minute 0 seconds");
constructDomTest('otherp', 500);
console.assert(instance.guessTimeToReadSelector('#otherp') === "2 minutes 30 seconds");
constructDomTest('anotherp', 550);
console.assert(instance.guessTimeToReadSelector('#anotherp') === "2 minutes 45 seconds");
console.assert(instance.guessBasedOnWordCount(200) === "1 minute 0 seconds");
console.assert(instance.guessBasedOnWordCount(300) === "1 minute 30 seconds");
console.assert(instance.guessBasedOnWordCount(400) === "2 minutes 0 seconds");
console.assert(instance.guessBasedOnWordCount(0) === "0 minutes 0 seconds");
console.assert(instance.guessBasedOnWordCount(404) === "2 minutes 1 second");
console.assert(instance.guessBasedOnWordCount(10) === "0 minutes 3 seconds");
console.assert(instance.guessBasedOnWordCount(11) === "0 minutes 3 seconds");
console.assert(instance.guessBasedOnWordCount(12) === "0 minutes 4 seconds");

instance.wordsPerMinute = 60;
console.assert(instance.guessBasedOnWordCount(49) === "0 minutes 49 seconds");



let rg = new ReadingGuesstimator({
    wordsPerMinute : 400 // because fast readers.
  ,	nameForMinute : 'minuto'
  ,	nameForSecond : 'segundo'
});

console.assert( rg.guessBasedOnWordCount(600) === "1 minuto 30 segundos");

rg = new ReadingGuesstimator({
  pluralizationInterceptor: function(word, amount){
    return (amount > 1 || amount === 0) ? word + 'z' : word;
  }
});

console.assert( rg.guessBasedOnWordCount(402) === '2 minutez 1 second');

rg = new ReadingGuesstimator({
  formatResultInterceptor: function(minutes, nameForMinutes, seconds, nameForSeconds ){
    return 'roughly ' + minutes + ' ' + nameForMinutes + ' and ' + seconds + ' ' + nameForSeconds + " if you read at an average speed." ;
  }
});

console.assert( rg.guessBasedOnWordCount(402) === 'roughly 2 minutes and 1 second if you read at an average speed.');
// logs: roughly 2 minutes and 1 second if you read at an average speed.

rg = new ReadingGuesstimator({
  wordsPerMinute: 400
, nameForMinute: 'm'
, nameForSecond: 's'
, pluralizationInterceptor: function(word){
    return word;
  }
, formatResultInterceptor: function(min, nameM, sec, nameS){
    return "You wasted: " + min + nameM + " and " + sec + nameS + " of your life reading this crap."
  }
});

console.assert( rg.guessBasedOnWordCount(404) === "You wasted: 1m and 1s of your life reading this crap.");