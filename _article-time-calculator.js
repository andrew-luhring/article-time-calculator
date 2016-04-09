var ArticleReader = require('./ArticleReader');
var instance = new ArticleReader();





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
console.log(instance.guessTimeToReadElement('#testparagraph'));
console.assert(instance.guessTimeToReadElement('#testparagraph') === "1 minute 0 seconds");
constructDomTest('otherp', 500);
console.log(instance.guessTimeToReadElement('#otherp'));
console.assert(instance.guessTimeToReadElement('#otherp') === "2 minutes 30 seconds");
constructDomTest('anotherp', 550);
console.log(instance.guessTimeToReadElement('#anotherp'));
console.assert(instance.guessTimeToReadElement('#anotherp') === "2 minutes 45 seconds");
console.log(instance.guessTimeToReadElement('#fail'));

console.log(instance.guessBasedOnWordCount(200));
console.log(instance.guessBasedOnWordCount(300));
console.log(instance.guessBasedOnWordCount(400));
console.log(instance.guessBasedOnWordCount(0));
console.assert(instance.guessBasedOnWordCount(200) === "1 minute 0 seconds");
console.assert(instance.guessBasedOnWordCount(300) === "1 minute 30 seconds");
console.assert(instance.guessBasedOnWordCount(400) === "2 minutes 0 seconds");
console.assert(instance.guessBasedOnWordCount(0) === "0 minutes 0 seconds");
