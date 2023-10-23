import Parser from './parser.js'

export const splitOnFirstInstanceOnly = (expression, charDelimiter) => ( expression.indexOf(charDelimiter) === -1 ? 
												[expression] : 
												[expression.substr(0,expression.indexOf(charDelimiter)),expression.substr(expression.indexOf(charDelimiter))])
export const splitString = (expression, charDelimiter) => {return (expression.split(charDelimiter))}

export const splitGetLastString = (expression, charDelimiter) => (expression.split(charDelimiter)[expression.split(charDelimiter).length - 1])

export const getSplitStringFunction = (func, charDelimiter) => //closure for app-specific functions
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

const X = P.parseExpression(testExpression)
console.log(X)