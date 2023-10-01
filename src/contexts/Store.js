// Just to start off - npm run dev
import {createContext, useReducer} from 'react';
import InputReducer from '../reducers/InputReducer.js'; 
import { useState } from 'react';

// data and objects used in state
import {WordParser,Lister} from '../utils/CalcAutocompletion.js';
import {componentArguments,followingSymbol, grammars, calculations} from '../data/Globals.js';
import { useFetch} from 'use-http';

const Store = ({children}) => {
  
  // load data from the API
  const [calcs, setCalcs] = useState({});
  const { get,response,loading } = useFetch('http://localhost:4000');

  async function loadCalcs(){ const calcsData = await get('/Calculations');
                              if (response.ok) {
                                setCalcs(calcsData);
                              }
                            }
  
  // initial state data -> objects 
  const wordparser = new WordParser();
  const calculation_data = { ...calculations, calculations: calcs}
  const lister = new Lister(wordparser, componentArguments, grammars, calculation_data, followingSymbol );
  const initialList = lister.getInitialList();

  // global state objects
  const inputState = {inputs:[{id:1, inputText:"",inputLength:0, dropDown:false, dropDownIndex:-1, rootList:['calc'], filterRoot:['calc'], 
                                filteredWords: initialList, wordList:initialList, inputRoot:""},
                              {id:2, inputText:"", inputLength:0,dropDown:false, dropDownIndex:-1, rootList:['calc'], filterRoot:['calc'], 
                                filteredWords: initialList, wordList:initialList, inputRoot:""}]}
  const inputData = {wordparser:wordparser, lister:lister, inputdata: inputState};

  const [state, dispatch] = useReducer(InputReducer, inputData);
  return ( <InputContext.Provider value={[state, dispatch]}>
            {children}
           </InputContext.Provider>);
  }

export const InputContext = createContext();

export default Store;