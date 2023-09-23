import {updateInputAttributeFromId,updateInputAttributeFromIndex,getFirstInputIndexWithAttributeValue, getFirstInputIdWithAttributeValue, readInputAttribute} from '../utils/arrayHelpers'
    
const InputReducer = (state, action) => {
    let newInputs;
    let text="";

    switch (action.type) {
    
    case 'TRY_EXPAND':
        newInputs = state.inputdata.inputs;
        let newInputdata = state.lister.getNextWordList(action.payload.newInputText);
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'wordList',((typeof(newInputdata) === 'undefined') ? [] : newInputdata));
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'inputText',action.payload.newInputText);
        let newState = { ...state};
        newState["inputdata"].inputs = newInputs;
        return(newState);

    case 'CHANGE_INPUTTEXT':
        newInputs = state.inputdata.inputs;
        newInputs.forEach( (i) =>( i['id'] === action.payload.id ? i.inputText = action.payload.newInputText : i));
        return{ ...state, inputs: newInputs};

    case 'GO_NEXT_DROPDOWN': 
        return {...state, filteredWords:state.lister.getNextWordList(state.inputText)};

    case 'GET_FILTERED_LIST': //input id, filters, start (charindex), index
        text = state.inputs[state.inputs.id].text;
        let filteredWords = state.filteredWords.filter(x => (filteredWords.startsWith(x)), text);
        return{ ...state, filteredWords: filteredWords};

    case 'CHANGE_INDEX_DOWN':
        if(state.index < state.filteredWords.length)
        {
            let index = state.index += 1;
            return{...state, index: index};
        }
        else
        {
            return state;
        }
        

    case 'CHANGE_INDEX_UP':
        if(state.index > 0)
        {
            let index = state.index -= 1;
            return{...state, index: index};
        }
        else
        {
            return state;
        }
    
    default:
        return(state);
    }
};

export default InputReducer;