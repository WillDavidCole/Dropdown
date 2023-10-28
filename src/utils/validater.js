class tokenListDefinitionArray
{

  constructor (validExpressionRootToken,canTakeArguments,validArgumentsList)
  {
    this._validExpressionRootToken = validExpressionRootToken
    this._validArgumentsList       = validArgumentsList
    this._canTakeArguments         = canTakeArguments
  }

  validateExpressionReturnState = (token) => // states to be either valid or invalid based on the function definitino
  {
    return 0;
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

  
  validateExpression = (expression) => {
      
    let expressionArray = expression.split('.');
    let cleanArray = expressionArray.map((x) => (x.substring(0, (x.includes('(') ? x.indexOf('(') : x.length) )));
    
    if(cleanArray.length > 1)
    {
      // for each term in the expression -> opening and closing brackets
      for(let x in [...Array(cleanArray.length - 1).keys()] )
      {
        if(this._followingSymbol[cleanArray[x]] === "(")
        {
          if(expression.substring(expression.indexOf(cleanArray[x + 1])-2, 2)  !== ").")
          {
            return false;
          }
        }
      }
    }

    // condition: should be a valid, recognised expression
    let testValidArray = JSON.stringify(cleanArray).slice(0,cleanArray.length - 1);
    if(!!testValidArray.length && !(this._jsonGrammars.includes(testValidArray))) //length is greater than 1 and expression not recognised
    {
      return false;
    }
    return true;
  }

}
