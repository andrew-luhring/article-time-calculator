# ReadingGuesstimator

## Have you ever wondered "How long would it probably take me to read this thing"?

I have. Unfortunately by the time I normally am asking that question, I've already read a decent amount and have
become somewhat invested in whatever the thing is.

That's a bummer.

This is a thing to prevent you from falling into that or similar traps-- or, better yet, a thing to prevent your USERS
from falling into that trap.\*

This ridiculously simple module works in any modern browser, node, and also should work out of the box with
AMD/CommonJS modules.


# Get Started

[Download it](https://raw.githubusercontent.com/andrew-luhring/article-time-calculator/master/article-time-calculator
.js)

(will be available on bower and npm after I finish testing the environment stuff).


# Useage

## Anywhere:

##### Default Useage
```js
var rg = new ReadingGuesstimator();
var numberOfWords = 600;
rg.guessBasedOnWordCount(numberOfWords);

// returns "x minutes y seconds"
// it correctly pluralizes minute and second- ex. "1 minute 20 seconds" or "1 minute 1 second"
```


## In a browser
You get not one, but TWO- you read that right- 2 WHOLE other methods for working with DOM elements:

1. guessTimeToReadSelector
2. guessTimeToReadElement

###### "But. but. how will I know which to use?"

Psh.

Easily.

If you can grab a single element with a selector, use guessTimeToReadSelector, passing it a valid selector

```html
<article id="stuff">
	<p>What? you think this is a game?</p>
</article>
```
```js
var rg = new ReadingGuesstimator();
rg.guessTimeToReadSelector('#stuff');
// returns 0 minutes 2 seconds.
```

or if you already have the DOM node you want, use guessTimeToReadElement:
```html
<article>
	<p>Hey dude.</p>
</article>
<article>
	<p>What is the deal with airline peanuts?</p>
</article>
```
```js
var rg = new ReadingGuesstimator();
var articles = document.querySelectorAll('article');
for(var i = 0; i < articles.length; i++){
  let current = articles[i];
	console.log( rg.guessTimeToReadElement(current) );
}
// logs 0 minutes 1 second, then 0 minutes 2 seconds.

```


###### "But Andrew- I want this to say something in a different format, or in a different language"
["It's ok, I'll feed you, baby birds."](https://youtu.be/wyZGzi4B468?t=3s) - Daniel Tosh

### Configurable options (all are optional)

This noise accepts a configuration object with the following properties:

##### wordsPerMinute
How many words your users can read in a minute.
Defaults to 200 because [reasons](https://www.google.com/search?num=100&q=average+reading+speed).


##### nameForMinute
The word you want to use to represent a minute.
Defaults to "minute".


##### nameForSecond
See above but mentally replace "minute" with "second".


##### pluralizeInterceptor
A function that accepts 2 arguments: nameForMinute, and the number of minutes.


##### formatResultInterceptor
A function that accepts 4 arguments: numberOfMinutes, nameForMinute, numberOfSeconds, and nameForSeconds.





# Example

```js
var rg = new ReadingGuesstimator({
	wordsPerMinute : 400 // because fast readers.
,	nameForMinute : 'minuto'
,	nameForSecond : 'segundo'
});

console.log( rg.guessBasedOnWordCount(600) );
// logs: 1 minuto 30 segundos

//
//
//
// adjust pluralization rules:
rg = new ReadingGuesstimator({
	pluralizationInterceptor: function(word, amount){
		return (amount > 1 || amount === 0) ? word + 'z' : word;
	}
});

console.log( rg.guessBasedOnWordCount(402) );
// logs: 2 minutez 1 second

//
//
//
//  adjust formatting of output:
rg = new ReadingGuesstimator({
	formatResultInterceptor: function(minutes, nameForMinutes, seconds, nameForSeconds ){
		return 'roughly ' + minutes + ' ' + nameForMinutes + ' and ' + seconds + ' ' + nameForSeconds + " if you read at an average speed." ;
	}
});

console.log( rg.guessBasedOnWordCount(402) );
// logs: roughly 2 minutes and 1 second if you read at an average speed.

//
//
//
// Holy mother of examples:
var rg = new ReadingGuesstimator({
  wordsPerMinute : 400 // because fast readers.
, nameForMinute : 'm'
, nameForSecond : 's'
, pluralizationInterceptor: function(word){
    return word;
  }
, formatResultInterceptor: function(min, nameM, sec, nameS){
    return "You wasted: " + min + nameM + " and " + sec + nameS + " of your life reading this crap."
  }
});

console.log( rg.guessBasedOnWordCount(404) );
// logs: You wasted: 1m and 1s of your life reading this crap.
```




###### Superflous Rant.
\* You may be thinking "BUT WHAT ABOUT ADVERTISING REVENUE". Don't be that dude. Call me crazy but whether or not your users enjoy your content should take precidence over whether or not you'll be able to display another banner ad (that'll make you that whopping $0.0000002).
