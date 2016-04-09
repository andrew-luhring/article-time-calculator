(function(){
  'use strict';
  function getElement(selector){
    return document.querySelector(selector);
  }

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
        , seconds = (isNaN(secondsAsPercentOfMinute)) ? 0 : secondsAsPercentOfMinute * 60
        , minuteWord = this.pluralizeInterceptor(this.nameForMinute, minutes)
        , secondWord = this.pluralizeInterceptor(this.nameForSecond, seconds);

        return minutes + ' ' + minuteWord + ' ' + seconds + ' ' + secondWord;
      }
    }

    getLengthBasedOnWordCount(num){
      setTimeProperties.call(this, num);
      return this.formattedTime;
    }

    getLengthBasedOnElement(selector){
      let elem = getElement(selector);
      if(!elem){
        throw new Error('there was no element with the selector: ' + selector);
      }
      let text = elem.textContent.split(' ');
      return this.getLengthBasedOnWordCount(text.length);
    }
  }
})();
