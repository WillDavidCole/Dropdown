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
}
