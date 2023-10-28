// import { getUnique } from "./arrayHelpers"
class Lister
{ 
    constructor(parser, args, grammars, calculations, argDependencies, followingSymbol, symbolsArray, compareArrays, getUnique)
    {
      this._parser = parser
      this._args = args
      this._grammars = grammars
      this._calculations = calculations ?? []
      this._argDependencies = argDependencies
      this._followingSymbol = followingSymbol
      this._jsonGrammars = Object.values(grammars).map((x) => (JSON.stringify(x)))
      this._symbolsArray = symbolsArray ?? [".", "("]
      this._compareArrays = compareArrays
      this._getUnique = getUnique
    }
    
    
    /* property getters setters */
    calculationsSet = false

    getCalculations = () => 
    {
      return this._calculation_data
    }

    setCalculations = (calculationData) => 
    {
      this._calculation_data = calculationData;
      this.calculationsSet = true;
    }

    /* core functions */
    getMatchGrammars = (attributes) =>
    {
      let attributesLength = attributes.length
      let grammarsFiltered = []
      for(let x = 1; x < Object.keys(this._grammars).length; x++)
      {
        if(this._compareArrays(attributes, this._grammars[x].slice(0, attributesLength)))
        {
          grammarsFiltered.push(this._grammars[x]);
        }
      }
      return(grammarsFiltered)
    }

    getNextAttributeList = (expression) => 
    {
        let attributes = this._parser.getAttributes(expression)
        let grammarsFiltered = this.getMatchGrammars(attributes)
        var index = Object.keys(attributes).length
        let dLength = Object.keys(grammarsFiltered).length
        let tokens = [];
        for( let i = 0; i < dLength; i++ )
        {
          tokens.push(grammarsFiltered[i][index]);
        }
        return this._getUnique(tokens);
    }

    getArguments = (expression, attribute, depends_on = null) => 
    {
        if (depends_on)
        {
          let depends_on_arg = this._wordParser.getAttributeArg(expression,depends_on);
          return(this._args[attribute]['args'][depends_on_arg]);
        }
        else
        {
          return (typeof(this._args[attribute]) !== 'undefined' ? this._args[attribute] : []);
        }
    }

    // parent = this gets arguments or attributes depending on the expression handed
    getNextWordList =  (expression, isRoot=false) => //gets the next set of attributes or arguments, depedning on the expression
    {
        let lastSymbol = this._parser.getLastAvailableExpressionSymbol(expression,this._symbolsArray)
        if(isRoot === true)
        {
            if(lastSymbol === ".") return this._calculations
            if(lastSymbol === "(") return []
            return ["calc"]
        }
        else 
        {
            if (lastSymbol === ".")
            {
                return(this.getNextAttributeList(expression)) // need to be able to integrate calculation data into the list
            }
            else if(lastSymbol === "(")
            { 
                let argAttribute = this._parser.getLastAttribute(expression)
                return this._getArguments(expression,argAttribute,this._argDependencies[argAttribute])
            }
        }
    }

    getSimpleFilter = (expressionFilterPart, filterArray) =>
    {
        return filterArray.toLowerCase().filter(x => x.startsWith(expressionFilterPart.toLowerCase())) //may modify the behaviour of this in future
    }


    // The parent procedure - returns intellisense dropdown list on each
    getNextFilteredDropdownList = (expression) => 
    {
      
      let isRoot = (expression.indexOf("(") === -1 ) ? true : false
      let expressions = this._lister.parseExpressionFromFunctionArray(expression)
      let lastExpression = expressions[expressions.length - 1]
      let filterPart = this._lister.getExpressionFilterPart(lastExpression)

      return this.getSimpleFilter(filterPart,this.getNextWordList(expression, isRoot))
    }

    getGrammarPlaceholdersArray = (grammar,openingChars='{%', closingChars='%}') =>
    {
        var placeholders = [];
        let a = 0; let b = 0;
        let openingCharsLength = openingChars.length, closingCharsLength = closingChars.length;

        while(grammar.indexOf(openingChars, a) != -1)
        { 
          a = grammar.indexOf(openingChars, a);
          b = grammar.indexOf(closingChars, a + openingCharsLength);
          if (a !== -1 && b !== - 1)
          {
            placeholders.push(grammar.substring(a,(b + closingCharsLength)));
            a = b + closingCharsLength;
          }
        }
          return placeholders;
    }
}

export {Lister}