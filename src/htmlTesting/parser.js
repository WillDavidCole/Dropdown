/*
  Full function to be used with Lister
*/
class Parser
{
    constructor (functionArray)
    {
      this._functionArray = functionArray
    }

    // 1 gets all the elements from the function array
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

    // 2 Gets the array of tokens split by chosen symbol(s)
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

    // 3 get the tokens only
    getAttributes = (expression) =>
    {
      let tokens = []
      expression.split('.')
                .filter( (i) => (i !== ''))
                .forEach( (token) =>
                          {
                            (token.indexOf('(') > 0) ?
                            tokens.push(token.substring(0, token.indexOf('('))) : 
                            tokens.push(token)
                          })
      return tokens;
    }

    // 4 work out whether it's an argument or next token we're filtering on - this basically depends on the last expression symbol
    getLastAvailableExpressionSymbol = (expression, symbolsArray) =>
    {
      let expressionArray = expression.split("").reverse();
      if (!(expressionArray.some(x => symbolsArray.includes(x))))
      {
        return ''
      }
      else
      {
        let index = Math.min.apply(null, symbolsArray.map(x => (expressionArray.indexOf(x))))
        return expressionArray.slice(index,index+1)
      }
    }

    getLastAvailableExpressionSymbolIndex = (expression, symbolsArray) =>
    {
      if (!(expression.split("").some(x => symbolsArray.includes(x)))) return -1
      return (expression.length - Math.min.apply(null, symbolsArray.map(x => expression.split("").reverse().indexOf(x))) - 1)
    }

    // 5 get the expression root
    getExpressionRoot = (expression, symbolsArray) => 
    {
      let root = expression.substring(1,this.getLastAvailableExpressionSymbolIndex(symbolsArray));
      return (root === '' ? expression : root)
    }

    // 6 get the expression end
    getExpressionFilterPart = (expression, symbolsArray) => 
    {
      let start = this.getLastAvailableExpressionSymbolIndex(symbolsArray);
      return (start === -1 ? expression : expression.substr(start))
    }

  
  splitPreserveSymbol = (expression, symbol) => (
    expression.map((x,i) =>  expression[i] === symbol ? symbol + " " + symbol : expression[i])
              .split(symbol)
              .filter(x => x !== "")
              .map(y => y === " " ? symbol : y)
  )

  getAllSplitPreserveSymbol = (arr, symbol) => { 
      this.concatenateArrays(this.splitPreserveSymbol(arr,symbol))
    }

}
