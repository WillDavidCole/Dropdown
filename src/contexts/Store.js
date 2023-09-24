import {createContext, useReducer} from 'react';
import InputReducer from '../reducers/InputReducer.js'; 

// data and objects used in state
import {WordParser,Lister} from '../utils/CalcAutocompletion.js';
import {componentArguments,followingSymbol, grammars} from '../data/Globals.js';

  // initial state data -> objects
  const wordparser = new WordParser();
  const lister = new Lister(wordparser, componentArguments, grammars, followingSymbol );
  const initialList = lister.getInitialList();

  // global state objects
  const inputState = {inputs:[{id:1, inputText:"",inputLength:0, dropDown:false, wordList:initialList},
                              {id:2, inputText:"", inputLength:0,dropDown:false, wordList:initialList}]}
  const inputData = {wordparser:wordparser, lister:lister, inputdata: inputState};

const Store = ({children}) => {
  const [state, dispatch] = useReducer(InputReducer, inputData);
 
  return (
    <InputContext.Provider value={[state, dispatch]}>
      {children}
    </InputContext.Provider>
  );
}

export const InputContext = createContext();

export default Store;