// Just to start off - npm run dev
import {createContext, useReducer} from 'react';
import InputReducer from '../reducers/InputReducer.js'; 

// data and objects used in state
import {splitOnFirstInstanceOnly, splitString, getSplitStringFunction} from "../utils/Main"
import {Parser} from "../utils/parser.js"
import {Lister} from '../utils/CalcAutocompletion.js';
import {componentArguments,followingSymbol, grammars, calculations} from '../data/Globals.js';
import { useState, useEffect } from 'react';

const Store = ({children}) => {

  // create the new parser here -> specific for this application
    const splitOnFirstInstanceOfOpenPranthesis = getSplitStringFunction(splitOnFirstInstanceOnly, "(")
    const splitStringByComma = getSplitStringFunction(splitString, ",")
    const wordparser = new Parser([splitOnFirstInstanceOfOpenPranthesis, splitStringByComma]);

    const [calcData, setCalcData] = useState()

    // initial state data -> objects 
    // const wordparser = new WordParser();

  // word_parser, args, grammars, followingSymbol, calculationData
    const lister = new Lister(wordparser, 
      componentArguments,
      grammars,
      followingSymbol)
    const initialList = lister.getInitialList();

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/Calculations`);
        const result = await response.json();
        lister.setCalculations(result)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    // getting the calcs data
    useEffect(() => {
                      fetchData()
                    }, [])

    // global state objects
  const inputState = {inputs:[{id:1, inputText:"",inputLength:0, dropDown:false, dropDownIndex:-1, rootList:['calc'], filterRoot:['calc'], 
                                filteredWords: initialList, wordList:initialList, inputRoot:""},
                              {id:2, inputText:"", inputLength:0,dropDown:false, dropDownIndex:-1, rootList:['calc'], filterRoot:['calc'], 
                                filteredWords: initialList, wordList:initialList, inputRoot:""}]}
  const inputData = {wordparser:wordparser, lister:lister, inputdata: inputState};
  const [state, dispatch] = useReducer(InputReducer, inputData);
  
  return ( 
    <InputContext.Provider value={[state, dispatch]}>
            {children}
    </InputContext.Provider>);
  }

export const InputContext = createContext();

export default Store;