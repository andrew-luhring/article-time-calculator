(function(){
  'use strict';

  function setTimeProperties(textLength){
    this.minutesToRead = textLength / this.wordsPerMinute;
    this.formattedTime = this.formatTimeFn(this.minutesToRead);
  }

  function pluralizeFn(prop, amount){
    return (amount > 1 || amount === 0) ? prop + 's' : prop;
  }

  class ArticleReader{
    constructor(configObj){
      let _configObj = (typeof configObj === 'object' && configObj !== null && !Array.isArray(configObj)) ? configObj : {};
      //average wpm is 200
      this.wordsPerMinute = _configObj.wordsPerMinute || 200;
      this.nameForMinute = _configObj.nameForMinute || 'minute';
      this.nameForSecond = _configObj.nameForSecond || 'second';
      this.pluralizeInterceptor = _configObj.nameForSecond || pluralizeFn;

      this.formatTimeFn = _configObj.formatTime || function(timeInMinutes){
        let minutes = Math.floor(timeInMinutes)
        , secondsAsPercentOfMinute = Math.round((timeInMinutes % minutes) * 100) / 100
        , seconds = (isNaN(secondsAsPercentOfMinute)) ? 0 : Math.round(secondsAsPercentOfMinute * 60)
        , minuteWord = this.pluralizeInterceptor(this.nameForMinute, minutes)
        , secondWord = this.pluralizeInterceptor(this.nameForSecond, seconds);

        return minutes + ' ' + minuteWord + ' ' + seconds + ' ' + secondWord;
      }
    }

    getLengthBasedOnWordCount(num){
      setTimeProperties.call(this, num);
      return this.formattedTime;
    }

  }

  class DOMArticleReader extends ArticleReader{
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
      return ArticleReader;
    });
  }
// Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js.
    if (moduleExports) {
      freeModule.exports = ArticleReader;
    }
    // Export for CommonJS support.
    freeExports.ArticleReader = ArticleReader;
  }
  else {
    // Export to the global object.
    root.ArticleReader = freeWindow ? DOMArticleReader : ArticleReader;
  }
})();
