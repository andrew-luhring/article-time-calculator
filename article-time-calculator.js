(function(){
  'use strict';

  /**
   * @desc Sets minutesToRead and formattedTime on object that calls this function.
   * Do not call this directly, you should invoke it with .call or .apply from an object that has a formatTimeFn.
   *
   * @param {number} textLength - the length of the text to calculate the reading time of.
   */
  function setTimeProperties(textLength){
    this.minutesToRead = textLength / this.wordsPerMinute;
    this.formattedTime = this.formatTimeFn(this.minutesToRead);
  }

  /**
   * @desc returns a word that is pluralized according to the english language. Intended use is for the words
   * "minute" and "second".
   *
   * @param {string} word - the word being pluralized
   * @param {number} amount - the number of words to compare against.
   * @returns {string}
   */
  function pluralizeFn(word, amount){
    return (amount > 1 || amount === 0) ? word + 's' : word;
  }

  /**
   * @desc a function that returns the time formatted thusly: (x) minutes (y) seconds.
   * @param {number|string} minutes - the number of minutes.
   * @param {string} nameForMinutes - the word used to represent minutes.
   * @param {number|string} seconds - the number of seconds.
   * @param {string} nameForSeconds - the word used to represent seconds.
   * @returns {string}
   */
  function formatResult(minutes, nameForMinutes, seconds, nameForSeconds ){
    return minutes + ' ' + nameForMinutes + ' ' + seconds + ' ' + nameForSeconds;
  }

  /**
   * @desc A class that calculates the amount of time it takes to a number of words. defaults to 200 words per second.
   *
   * @property {Object} [configObj] - a configuration object that defaults to formatting the time thusly: "(x) minute/s (y) second/s".
   * @proprety {number} [configObj.wordsPerMinute]  - configure the reading speed for calculations. defaults to 200.
   * @proprety {string} [configObj.nameForMinute]   - the word used to represent minutes. defaults to 'minute'.
   * @proprety {string} [configObj.nameForSecond]   - the word used to represent seconds. defaults to 'second'.
   * @proprety {function} [configObj.pluralizeInterceptor]   - a function that returns words implementing the rules to use to pluralize the "nameForMinute" and "nameForSecond" parameters. Must accept parameters in the form of (singularVersionOfWord, totalNumberOfWords) and MUST return a string.
   * @proprety {function} [configObj.formatResultInterceptor]- a function that returns the way you want the results formatted. Must accept parameters in the form of (numberOfMinutes, nameRepresentingMinutes, numberOfSeconds, nameRepresentingSeconds) and should return a string (or else whats the point)
   *
   * @constructor
   */
  class WordReader{
    constructor(configObj){
      let _configObj = (typeof configObj === 'object' && configObj !== null && !Array.isArray(configObj)) ? configObj : {};
      this.wordsPerMinute = _configObj.wordsPerMinute || 200;
      this.nameForMinute = _configObj.nameForMinute || 'minute';
      this.nameForSecond = _configObj.nameForSecond || 'second';
      this.pluralizeInterceptor = _configObj.pluralizeInterceptor || pluralizeFn;
      this.formatResultInterceptor = _configObj.formatResultInterceptor || formatResult;
    }

    formatTimeFn(timeInMinutes){
      let minutes = Math.floor(timeInMinutes)
      , secondsAsPercentOfMinute = Math.round((timeInMinutes % minutes) * 100) / 100
      , seconds = (isNaN(secondsAsPercentOfMinute)) ? 0 : Math.round(secondsAsPercentOfMinute * 60)
      , minuteWord = this.pluralizeInterceptor(this.nameForMinute, minutes)
      , secondWord = this.pluralizeInterceptor(this.nameForSecond, seconds);

      return this.formatResultInterceptor(minutes, minuteWord, seconds, secondWord);
    }

    getLengthBasedOnWordCount(num){
      setTimeProperties.call(this, num);
      return this.formattedTime;
    }

  }

  /**
   * @desc a class with methods that calculates the amount of time it will take to read a given element in a DOM. Will not be accessible if the context is not a Window.
   * @extends WordReader
   * @constructor
   */
  class DOMArticleReader extends WordReader{
    constructor(configObj){
      super(configObj);
    }
    getLengthBasedOnSelector(selector){
      let elem = document.querySelector(selector);
      if(!elem){
        throw new Error('there was no element with the selector: ' + selector);
      }
      let text = elem.textContent.split(' ');
      return this.getLengthBasedOnWordCount(text.length);
    }

    getLengthBasedOnElement(elem){
      let text = elem.textContent.split(' ');
      return this.getLengthBasedOnWordCount(text.length);
    }
  }

  /**
   * NOTE: Everything after this (the whole exporting thing) is taken from lodash (https://github.com/lodash/lodash)
   * and has been slightly modified to fit this Object (didn't see the point in adding a 15k line dependency for 50 lines).
   */

  var objectTypes = {
    'function': true,
    'object': true
  };

  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : undefined;

  var checkGlobal = (value)=>{
    return (value && value.Object === Object) ? value : null;
  }
  /** Detect free variable `module`. */
  var freeModule = (objectTypes[typeof module] && module && !module.nodeType) ? module : undefined;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = (freeModule && freeModule.exports === freeExports) ? freeExports : undefined;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

  /** Detect free variable `self`. */
  var freeSelf = checkGlobal(objectTypes[typeof self] && self);

  /** Detect free variable `window`. */
  var freeWindow = checkGlobal(objectTypes[typeof window] && window);

  /** Detect `this` as the global object. */
  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal ||
             ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
             freeSelf || thisGlobal || Function('return this')();


// Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define(function() {
      return WordReader;
    });
  }
// Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js.
    if (moduleExports) {
      freeModule.exports = WordReader;
    }
    // Export for CommonJS support.
    freeExports.ArticleReader = WordReader;
  }
  else {
    // Export to the global object.
    root.ArticleReader = freeWindow ? DOMArticleReader : WordReader;
  }
})();
