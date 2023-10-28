import Parser from './parser.js'
 const splitOnFirstInstanceOnly = (expression, charDelimiter) => ( expression.indexOf(charDelimiter) === -1 ? 
											[expression] : 
											[expression.substr(0,expression.indexOf(charDelimiter)),expression.substr(expression.indexOf(charDelimiter))])
 const splitString = (expression, charDelimiter) => {return (expression.split(charDelimiter))}
 const splitGetLastString = (expression, charDelimiter) => (expression.split(charDelimiter)[expression.split(charDelimiter).length - 1])
 const getSplitStringFunction = (func, charDelimiter) => //closure for app-specific functions
{
	return function (expression)
	{
		return func(expression, charDelimiter)
	}
}

// Getting / creating split functions 
const splitOnFirstInstanceOfOpenPranthesis = getSplitStringFunction(splitOnFirstInstanceOnly, "(")
const splitStringByComma = getSplitStringFunction(splitString, ",")
const P = new Parser([splitOnFirstInstanceOfOpenPranthesis, splitStringByComma])

// const testExpression
const testExpression = "calc._Multiply(fixed(6), fixed(9))";

let X = P.parseExpressionFromFunctionArray([testExpression])
console.log(X)

// TO DO = Create a Lister + a function to ensure that root can be identified in an expression - if not root, then it's an argument
// write out a test here -> instantiate parser / lister and test with multiple expression statements
// note = need to go to the calcs api -> so make sure it can be started
// need to populate some of the globals with dependencies (arg dependencies) and calculation data AND make the args api conditional on filters -> e.g. numeric or text