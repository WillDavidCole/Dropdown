/* API Start command: 
  json-server -p 4000 --watch ./src/mockAPI/db.json
*/

/* helper functions */
// const compareArrays = (a, b) => a.length === b.length && a.every((element, index) => element === b[index]);
const compareArrays = (a, b) => { return JSON.stringify(a) === JSON.stringify(b)}
const getUnique = (lst) => { return lst.filter((item, i, ar) => ar.indexOf(item) === i) }
const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
const intersects = (a, b) => { const s = new Set(b); return [...new Set(a)].some(x => s.has(x));};

/* data */
const templates = {
  1: '{"Name":"Fixed Value","DataId":"9","Value":"{% value %}"}',
  2: '{"Name":"{% data || _ %}","DataId":"11","NodeId":"{% node:nodeid %}"}',
  3: '{"Name":"{% data || _ %}","DataId":"17","NodeId":"{% node:nodeid %}","CalculationOrder":"{% nodestep %}"}',
  4: '{"Name":"{% data || _ %}","DataId":"12","EnhancedDataId":"{% enhanceddata:enhanceddataid %}"}',
  5: '{"Name":"{% data || _ %}","DataId":"18","EnhancedDataId":"{% enhanceddata:enhanceddataid %}"},"CalculationOrder":"{% enhanceddatastep %}"',
  6: '{"Name":"{% data || _  %}","DataId":"12","EnhancedDataId":"1","Statistic":"{% performancestatistic %}"}',
  7: '{"Name":"{% data || _ %}","DataId":"{% datatype:dataid %}","PortfolioId":"{% level %}_PortfolioId","SourceGroupId":"19","PortfolioAttribute{% datatype:type %}TypeId":"{% definition %}","AsAtDate":"AsAtDate","ModelRunId":"-2","CurrencyId":"-2","CountryId":"0","AssetClassId":"1"}',
  8: '{"Name":"{% data || _ %}","DataId":"{% datatype:dataid %}","PortfolioId":"{% level %}_PortfolioId","SourceGroupId":"19","PortfolioAttribute{% datatype:type %}TypeId":"{% definition %}","AsAtDate":"AsAtDate","ModelRunId":"-2","CurrencyId":"-2","CountryId":"0","AssetClassId":"1"}',
  9: '{"Name":"{% data || _ %}","DataId":"{% datatype:dataid %}","PortfolioId":"{% level %}_PortfolioId","SourceGroupId":"19","PortfolioAttribute{% datatype:type %}TypeId":"{% definition %}","AsAtDate":"AsAtDate","ModelRunId":"-2","CurrencyId":{% currency:currencyid %},"CountryId":"0","AssetClassId":"1"}',
  10: '{"Name":"{% data || _ %}","DataId":"{% datatype:dataid %}","PortfolioId":"{% level %}_PortfolioId","SourceGroupId":"19","PortfolioAttribute{% datatype:type %}TypeId":"{% definition %}","AsAtDate":"AsAtDate","ModelRunId":"-2","CurrencyId":{% currency:currencyid %},"CountryId":"0","AssetClassId":"1"}',
  11: '{"Name":"{% data || _ %}","DataId":"{% datatype:dataid %}","PortfolioId":"{% level %}_PortfolioId","SourceGroupId":"19","PortfolioAttribute{% datatype:type %}TypeId":"{% definition %}","AsAtDate":"AsAtDate","ModelRunId":"-2","CurrencyId":{% "currencytype" %},"CountryId":"0","AssetClassId":"1"}',
  12: '{"Name":"{% data || _ %}","DataId":"{% datatype:dataid %}","PortfolioId":"{% level %}_PortfolioId","SourceGroupId":"19","PortfolioAttribute{% datatype:type %}TypeId":"{% definition %}","AsAtDate":"AsAtDate","ModelRunId":"-2","CurrencyId":{% "currencytype" %},"CountryId":"0","AssetClassId":"1"}'
};

const argDependencies = {
  "key":["datatype","level"],
  "definition":["datatype","level"]
};

const calculations = {
  "opener":"calc",
  "calculations":{}
};

const grammars = { // the possible grammars (see those used below)
    1: ['fixed'], // eventually, this could just be a value, int or between quotations for a string, needs a regex verifier for the errors
    2: ['data','node'],
    3: ['data','node', 'nodestep'],
    4: ['data','enhanceddata'],
    5: ['data','enhanceddata','enhanceddatastep'],
    6: ['data','performancestatistic'],
    7: ['data', 'level', 'datatype', 'key'],
    8: ['data', 'level', 'datatype', 'definition'],
    9: ['data', 'level', 'datatype', 'key', "currency"],
    10: ['data', 'level', 'datatype', 'definition', "currency"],
    11: ['data', 'level', 'datatype', 'key', "currencytype"],
    12: ['data', 'level', 'datatype', 'definition', "currencytype"]
};

const followingSymbol = {'calc':'.', 'fixed':'(' ,'data':'.' ,'node':'(','nodestep':'(','enhanceddata':'(' ,
                          'enhanceddatastep':'(' ,'performancestatistic':'(','level':'(','datatype':'(',
                          'key':'(','definition':'(','currency':'(','currencytype':'('};
                          
// links grammars+template combinations to mappings
const argument_mappings = { // a dictionary of dictionaries to hold any arguments that might need mapping for any of the grammar_templates_dict combinations
  "nodeid":{}, // example - translates the arguments associated with node - loaded from api on startup, depends on the model (run model) selected
  "enhanceddataid":{}, // loaded from api on startup, might need self '.' arguments as well
  "dataid": {"text":1, "numeric":2}, 
  "type":{"text":"Text", "numeric":"Value"}, // definition to be loaded from the api
  "currencyid":{}
};

const componentArguments  = {
  node:["-1"], // maybe loaded based on the model
  enhanceddata:[],
  data:['PATValueFromInputDataJson','PAVValueFromInputDataJson','ReturnValueFromInputDataJson','AssetAllocationValueFromInputDataJson','ExchangeRateValueFromInputDataJson','IndexValueFromInputDataJson','RunParameterValueFromInputDataJson','StaticValueFromDataFilterJson','EnhancedDataCalculatedValueOutputDataJson','EnhancedDataCalculatedStatisticValueOutputDataJson','StaticValueFromDataFilterJsonForProductCategoryCombination','AssetClassModelAssumptionFeeBasisPoints','IndexForAssetClassGroupFromInputDataJson','EnhancedDataIntermediateCalcValueFromOutputDataJson','NodeIntermediateCalcValueFromOutputDataJson','HurdleIntermediateCalcValueFromOutputDataJson','ProductCategory','PortfolioValueFromInputDataJson','EnhancedDataCalculatedValueArrayOutputDataJson','ModelRootNodeAttributeFromOutputDataJson','RunParameterValueFromInputDataJsonForParameterName','RagTextValueFromOutputDataJson','ParameterIntermediateCalcValueFromOutputDataJson','AttributeValueFromEnhancedDataKeyValueJson'],
  fixed:[],
  level:["firm","product","requestportfolio"],
  performancestatistic:['InformatioRatioDecayWeighted', 'TrackingErrorDecayWeighted', 'PerformanceHistoryLengthMonths','BenchmarkHistoryLengthMonths', 'ExchangeRateHistoryLengthMonths','5YearTrackingError'],
  datatype:['text','numeric'],
  key:[], // tricky one as the key depends on the datatype
  definition:[], // tricky one as the key depends on the datatype
  currency:[],
  currencytype:[]
}

const argument_validations = {
  nodestep:"^[a-z,A-Z]",
  enhanceddatastep:"^[a-z,A-Z]"
}

/* Classes */
class Lister
{ 
    constructor(parser, validator, args, grammars, argDependencies, followingSymbol, symbolsArray, attributes, compareArrays, getUnique)
    {
      this._parser = parser
      this._validator = validator
      this._args = args
      this._grammars = grammars
      this._argDependencies = argDependencies
      this._followingSymbol = followingSymbol
      this._jsonGrammars = Object.values(grammars).map((x) => (JSON.stringify(x)))
      this._symbolsArray = symbolsArray ?? [".", "("]
      this._attributes = attributes
      this._compareArrays = compareArrays
      this._getUnique = getUnique
    }
    
    
    /* property getters setters */
    calculationsSet = false

    getCalculations = () => 
    {
      return this._calculations
    }

    setCalculations = (calculationData) => 
    {
      this._calculations = calculationData;
      this.calculationsSet = true;
    }

    /* core functions */
    getMatchGrammars = (attributes) =>
    {
      let attributesLength = [attributes].length
      let grammarsFiltered = []
      let x = 1

      while(x < Object.keys(this._grammars).length)
      {
        if(this._compareArrays([attributes], this._grammars[x].slice(0, attributesLength)))
        {
          grammarsFiltered.push(this._grammars[x])
        }
        x++
      }
      return(grammarsFiltered)
    }

    getNextAttributeList = () => 
    {
        let expression = this._parser._expressions[this._parser._expressions.length - 1]
        let lastAttribute = this._parser.getLastAttribute()
        let attributesSplit = [this._parser.getAttributes(expression)[this._parser.getAttributes(expression).indexOf(lastAttribute)]]
        let attributes = attributesSplit[attributesSplit.indexOf(lastAttribute)]
        let grammarsFiltered = this.getMatchGrammars(attributes)

        var index = Object.keys([attributes]).length
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
    getNextWordList =  (expression, isRoot=false) => 
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
                return(this.getNextAttributeList()) 
            }
            else if(lastSymbol === "(")
            {
                  let lastAttribute = this._parser.getLastAttribute()
                  if(this._calculations.map(x => x.toLowerCase()).includes(lastAttribute.toLowerCase()))
                  {
                    return this.getNewExpression()
                  }
                  else 
                  {
                    return this.getArguments(expression,lastAttribute,this._argDependencies[lastAttribute])
                  }
            }
          }
      }

    getSimpleFilter = (expressionFilterPart, filterArray) =>
    {
        console.log("expressionFilterPart: " + expressionFilterPart)
        console.log("filterArray: " + filterArray)
        return filterArray.filter(x => x.toLowerCase().startsWith(expressionFilterPart.toLowerCase())) 
    }


    getNextFilteredDropdownList = (expression) => 
    {
      // filter part
      let isRoot = (expression.indexOf("(") === -1 ) ? true : false
      this._parser.parseExpressionFromFunctionArray(expression)
      let expressions = this._parser.getExpressions()
      let lastExpression =  expressions[expressions.length - 1]
      let filterPart = this._parser.getExpressionFilterPart(lastExpression,this._symbolsArray)

      // array part
      let nextTokenList = this.getNextWordList(expression, isRoot)

      // get the next dropdown list
      return this.getSimpleFilter(filterPart,  nextTokenList)
    }

    // 8 begin expression
    getNewExpression = () => 
    {
      return  getUnique(Object.values(grammars).map((x) => x[0]))
    }

    getGrammarPlaceholdersArray = (grammar,openingChars='{%', closingChars='%}') =>
    {
        var placeholders = [];
        let a = 0; let b = 0;
        let openingCharsLength = openingChars.length, closingCharsLength = closingChars.length;

        while(grammar.indexOf(openingChars, a) !== -1)
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

class Parser
{
    constructor (functionArray, expressions=[])
    {
      this._functionArray = functionArray
      this._expressions = expressions
    }

    /*************** properties ***************/
    getExpressions = () => 
    {
      return this._expressions
    }

    setExpressions = (expressions) => 
    {
      this._expressions = expressions;
    }

    /*************** core functions ***************/

    // 1 gets all the elements from the function array => needs work = this violates the single responsibility principle
    parseExpressionFromFunctionArray = (expression) =>
    {
      let i = 0; let x = 0;
      let prevArr = [expression]; let nextArr = [];

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
      this.setExpressions(prevArr)
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
      expression = expression ?? ''
      let expressionArray = expression.split("").reverse();
      if (!(expressionArray.some(x => symbolsArray.includes(x))))
      {
        return ''
      }
      else
      {
        let index = Math.min.apply(null, symbolsArray.map(x => expressionArray.indexOf(x)).filter(x => x > -1))
        return expressionArray.slice(index,index+1)[0]
      }
    }

    getLastAvailableExpressionSymbolIndex = (expression, symbolsArray) =>
    {
      expression = expression ?? ""
      if (!(expression.split("").some(x => symbolsArray.includes(x)))) return -1
      return (expression.length - Math.min.apply(null, symbolsArray.map(x => expression.split("").reverse().indexOf(x)).filter(x => x !== -1)))
    }

    // 5 get the expression root
    getExpressionRoot = (expression, symbolsArray) => 
    {
      let root = expression.substring(1, this.getLastAvailableExpressionSymbolIndex(expression,symbolsArray));
      return (root === '' ? expression : root)
    }

    // 6 get the expression end
    getExpressionFilterPart = (expression, symbolsArray) => 
    {
      let start = this.getLastAvailableExpressionSymbolIndex(expression,symbolsArray);
      return (start === -1 ? expression : expression.substr(start))
    }

    // 7 Get last attribute - work out the list of associated arguments
    getLastAttribute  = () =>
    {
      let filteredExpressions =  this._expressions.filter(x => intersects(x.split(""), [".","("])) //TODO = this needs refactoring!
      let lastExpression = filteredExpressions[filteredExpressions.length - 1]
      let attributesList = this.getAttributes(lastExpression).filter(x => this._attributes.includes(x))
      return attributesList[attributesList.length - 1]
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

class Validator
{
  constructor (cartesian)
  {
    this._createCartesianProduct = cartesian 
  }

  validateListIncludes = (expression, expressionInitiator=["calc"], expressionAttributes, expressionJoiner = ".") =>
  {
    return this._createCartesianProduct(expressionInitiator,expressionAttributes).map(x => x.join(expressionJoiner)).includes(expression)
  }

}



/********API Functions***********/
const calc_api_url = "http://localhost:4000/Calculations";
const getapi = async (url, lister) => {
    const response = await fetch(url);
    var data = await response.json();
    if (response) {
        setListerCalculations(lister, data.map(x => x.CalcShortName));
    }
}

const setListerCalculations = (lister, data) =>
{
  lister.setCalculations(data)
}

/******* instantiate object ******/
const splitOnFirstInstanceOnly = (expression, charDelimiter) => ( expression.indexOf(charDelimiter) === -1 ? 
											[expression] : 
											[expression.substr(0,expression.indexOf(charDelimiter)+1),expression.substr(expression.indexOf(charDelimiter)+1)])
const splitString = (expression, charDelimiter) => {return (expression.split(charDelimiter))}

// create the specific functions for the class
const getSplitStringFunction = (func, charDelimiter) =>  { return function (expression) { return func(expression, charDelimiter) } }
const splitOnFirstInstanceOfOpenPranthesis = getSplitStringFunction(splitOnFirstInstanceOnly, "(")
const splitStringByComma = getSplitStringFunction(splitString, ",")
const listerAttributes = getUnique(Object.values(grammars).reduce((x,y) => x.concat(y)))

/****** create the lister object ******/
const P = new Parser([splitOnFirstInstanceOfOpenPranthesis, splitStringByComma])
const V = new Validator(cartesian)
const L = new Lister(P, V, componentArguments, grammars, argDependencies, followingSymbol, [".","("],listerAttributes, compareArrays, getUnique)
getapi(calc_api_url, L) //Decorate Lister


/**** top level parent function ****/
// calc._CheckOrTrueSequence(
const getFilteredList = (statement) => // should return the filtered list at every stage, based on the input alone
{
  return(L.getNextFilteredDropdownList(statement))
}