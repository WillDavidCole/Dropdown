class Parser
{
    constructor (functionArray)
    {
      this._functionArray = functionArray
    }

    // TODO = this still needs some work - to get all components from statement (root, args)
    // parseExpression = (expressionArray, splitterFunction) =>
    // {
    //   let concatenateArrays = (x,y) => {return(x.concat(y))}
    //   return expressionArray.map(x => splitterFunction(x)).reduce(y => concatenateArrays(y))
    // }

    parseExpressionFromFunctionArray = (expressionArray) =>
    {
      let i = 0; let x = 0;
      let prevArr = expressionArray; let nextArr = [];

      while(x < this._functionArray.length)
      {
        while ( i < prevArr.length)
        {
          nextArr = nextArr.concat(this._functionArray[x](prevArr[i]))
          i++
        }
        i = 0
        prevArr = nextArr
        nextArr = []
        x++
      }

      return prevArr
    }

    // Gets the array of tokens split by chosen symbols
    getArrayOfTokensAndSymbols = (phrase, symbolsArray) =>
    {
      var phraseLettersArray = phrase.split("")
      var returnArray = []
      let i = 0; let x = 0;
      while(x < phraseLettersArray.length)
      {
        if(symbolsArray.includes(phraseLettersArray[x]))
        {
          returnArray.push(phrase.slice(i,x))
          while(symbolsArray.includes(phraseLettersArray[x]))
          {
            returnArray.push(phrase.slice(x,x+1))
            x++
            i = x;
          }
          i = x;
        }
        x++
      }
      return(returnArray.concat(phrase.slice(i,x)).filter(x => x !== "") )
    }

  
  concatenateArrays = (arrays) =>  (Array.isArray(arrays[0]) ? arrays.reduce((x, y) => x.concat(y)) : arrays )
  
  splitPreserveSymbol = (expression, symbol) => ( 
    expression.map((x,i) =>  expression[i] === symbol ? symbol + " " + symbol : expression[i])
              .split(symbol)
              .filter(x => x !== "")
              .map(y => y === " " ? symbol : y)
  )

  getAllSplitPreserveSymbol = (arr, symbol) => { 
      this.concatenateArrays(this.splitPreserveSymbol(arr,symbol))
    }

  getRoot = (expression, lastSymbolArray) =>
  {
    let lastIndex = lastSymbolArray.reduce((x, y) => ( (x > expression.lastIndexOf(y)) ? x : expression.lastIndexOf(y)))
    return expression.slice(1, (lastIndex + 1))
  }

  getLastFromExpressionTerms = (expression, symbols, number, includeSymbols = true) =>
  {
    const splitTokensArray = (b) =>
    { 
        return b.reduce((x,y) => this.getAllSplitPreserveSymbol(x,y))
    }

    return splitTokensArray.slice((splitTokensArray.length - number), (splitTokensArray.length))
  }

}
