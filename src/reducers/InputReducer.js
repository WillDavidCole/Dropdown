/*
    dropdown action keys => do dropdown moving along (up/down/set to inactiva) = create a reducer action
    target value length to 0 => revert to lister initial word list, set dropdown to 0 entries = create a reducer action
    TAB => should trigger a target input change, set the filtered wordlist to 0 - should happen on an exact match ideally (modify this behaviour in the filter function)
    A sign change - if a new input / removal contains a marker ('(' or '.'), checking the difference between the new and old input value => recompute the dropdown list of words, recompute the length (from the filter)
    A simple change => none of the above, update the filtered list and word length
*/
import {updateInputAttributeFromId,updateInputAttributeFromIndex,getFirstInputIndexWithAttributeValue,
         getFirstInputIdWithAttributeValue, readInputAttribute} from '../utils/arrayHelpers'
    
const InputReducer = (state, action) => {
    let newInputs;

    switch (action.type) {
    
    case 'DROPDOWNINDEX_MOVE':
        return;
    
    case 'LENGTHTOZERO_SET':
        return;

    case 'TRY_EXPAND':
        newInputs = state.inputdata.inputs;
        let newInputdata = state.lister.getNextWordList(action.payload.newInputText);
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'wordList',((typeof(newInputdata) === 'undefined') ? [] : newInputdata));
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'inputText',action.payload.newInputText);
        let newState = { ...state};
        newState["inputdata"].inputs = newInputs;
        return(newState);


    case 'DROPDOWNWORDS_CHANGE':
        return;

    case 'CHANGE_INPUTTEXT':
        newInputs = state.inputdata.inputs;
        newInputs.forEach( (i) =>( i['id'] === action.payload.id ? i.inputText = action.payload.newInputText : i));
        return{ ...state, inputs: newInputs};
    
    default:
        return(state);
    }
};

export default InputReducer;