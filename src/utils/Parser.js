class Parser
{
  constructor (functionArray)
  {
    this._functionArray = functionArray
  }

  parseExpressionFromFunction = (expressionArray, splitterFunction) =>
  {
    let concatenateArrays = (x,y) => {return(x.concat(y))}
    return expressionArray.map(x => splitterFunction(x)).reduce(y => concatenateArrays(y)) //x.split(".")
  }

  parseExpressionFromFunctionArray = (expressionArray) =>
  {
    return expressionArray.map( 
                                x => ( this._functionArray.map(fn => fn(x)).reduce(z => concatenateArrays(z)) )
                              ).reduce(y => concatenateArrays(y))
  }
}


class tokenListDefinitionArray
{

  data = {
    "data"
  }

  constructor (validExpressionRootToken,canTakeArguments,validArgumentsList)
  {
    this._validExpressionRootToken = validExpressionRootToken
    this._validArgumentsList       = validArgumentsList
    this._canTakeArguments         = canTakeArguments
  }

  validateExpressionReturnState = (token) // states to be either valid or invalid based on the function definitino
  {
    
  }
}

class Validater
{

  constructor (tokenListDefinitionArray, parsedExpressionArray)
  {
    this._tokenListDefinitionArray = tokenListDefinitionArray
    this._parsedExpressionArray = parsedExpressionArray
  }

  validateAllGetState = () => 
  {
    let validationArray = this._tokenListDefinitionArray.map( (_, i) => ( 
          tokenListDefinitionArray[i].validateExpressionReturnState(this._parsedExpressionArray[i]) )
        )
    return validationArray
  }
}

/*****************************************************************
  test a couple of expressions against the function / class
******************************************************************/
const splitOnFirstInstanceOnly = (expression, charDelimiter) => ( expression.indexOf(charDelimiter) === -1 ? 
												[expression,""] : 
												[expression.substr(0,expression.indexOf(charDelimiter)),expression.substr(expression.indexOf(charDelimiter),expression.length)])
const splitString = (expression, charDelimiter) => {return (expression.split(charDelimiter))}
const splitGetLastString = (expression, charDelimiter) => (expression.split(charDelimiter)[expression.split(charDelimiter).length - 1])

const getSplitStringFunction = (func, charDelimiter) =>
{
	return function (expression)
	{
		return func(expression, charDelimiter) //must all follow the same argument pattern
	}
}

// Getting / creating split functions 
const splitOnFirstInstanceOfOpenPranthesis = getSplitStringFunction(splitOnFirstInstanceOnly, "(")
const splitStringByComma = getSplitStringFunction(splitString, ",")

// const testExpression
const testExpression = "calc._Multiply(fixed(6), fixed(9))";
const P = new Parser([splitOnFirstInstanceOfOpenPranthesis, splitStringByComma]);
const X = P.parseExpression(testExpression)
console.log(X)


// As an example 
// expression: calc._Multiply(fixed(6), fixed(9))
// functionOrder = [splitOnFirstInstanceOnly, splitGetLastString]
const parseExpression = (expressionArray, splitterFunction) =>
{
	let concatenateArrays = (x,y) => {return(x.concat(y))}
	return expressionArray.map(x => splitterFunction(x)).reduce(y => concatenateArrays(y)) //x.split(".")
}