/*
    dropdown action keys => do dropdown moving along (up/down/set to inactiva) = create a reducer action
    target value length to 0 => revert to lister initial word list, set dropdown to 0 entries = create a reducer action
    TAB => should trigger a target input change, set the filtered wordlist to 0 - should happen on an exact match ideally (modify this behaviour in the filter function)
    A sign change - if a new input / removal contains a marker ('(' or '.'), checking the difference between the new and old input value => recompute the dropdown list of words, recompute the length (from the filter)
    A simple change => none of the above, update the filtered list and word length
*/
import {updateInputAttributeFromId,filterTokenList,setDropdownIndex,
        updateInputAttributeFromIndex,getFirstInputIndexWithAttributeValue,
         getFirstInputIdWithAttributeValue, readInputAttribute} from '../utils/arrayHelpers'
    
const InputReducer = (state, action) => {
    
    let newInputs = state.inputdata.inputs;
    let newState = { ...state};
    let newDropdownIndex;
    let newInputData;
    let filteredWords;

    switch (action.type) {
    
    case 'DROPDOWNINDEX_MOVEUP':
        newDropdownIndex = (action.payload.input.dropDownIndex < (action.payload.input.wordList.length - 1 ))? action.payload.input.dropDownIndex + 1 : action.payload.input.dropDownIndex
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDownIndex',newDropdownIndex)
        newState["inputdata"].inputs = newInputs;
        return(newState);

    case 'DROPDOWNINDEX_MOVEDOWN':
        newDropdownIndex = (action.payload.input.dropDownIndex > -2) ? action.payload.input.dropDownIndex + 1 : action.payload.input.dropDownIndex
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDownIndex',newDropdownIndex)
        newState["inputdata"].inputs = newInputs;
        return(newState);
    
    case 'ESCAPEDROPDOWN':
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDown',false)
        newState["inputdata"].inputs = newInputs;
        return(newState);

    case 'LENGTHTOZERO_SET':
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'wordList', state.lister.getInitialList())
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDown',false)
        newState["inputdata"].inputs = newInputs;
        return(newState);

    case 'TRY_EXPAND':
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'inputText', action.payload.input.wordList[action.payload.input.dropDownIndex])
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'wordList',[])
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDown',false)
        newState["inputdata"].inputs = newInputs;
        return(newState);

    case 'DROPDOWNWORDS_CHANGE':
        newInputData = state.lister.getNextWordList(action.payload.input.newInputText)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'wordList',newInputData)
        newState["inputdata"].inputs = newInputs;
        return(newState);
    
    case  'CHANGE_INPUTTEXT':
        filteredWords = filterTokenList(action.payload.input.wordList, action.payload.newInputText)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'inputText', action.payload.newInputText)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'wordList', filteredWords)
        newInputs[action.payload.input.id].dropDown === false && updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDown', true)
        newState["inputdata"].inputs = newInputs
        return(newState);
    
    default:
        return(state);
    }
};

export default InputReducer;