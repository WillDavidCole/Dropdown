/****************************************************************************************************************************
    dropdown action keys => do dropdown moving along (up/down/set to inactiva) = create a reducer action
    target value length to 0 => revert to lister initial word list, set dropdown to 0 entries = create a reducer action
    TAB => should trigger a target input change, set the filtered wordlist to 0 - should happen on an exact match ideally (modify this behaviour in the filter function)
    A sign change - if a new input / removal contains a marker ('(' or '.'), checking the difference between the new and old input value => recompute the dropdown list of words, recompute the length (from the filter)
    A simple change => none of the above, update the filtered list and word length
****************************************************************************************************************************/
import { updateInputAttributeFromId,filterTokenList, 
         setDropdownIndex, updateInputAttributeFromIndex,
         getFirstInputIndexWithAttributeValue, 
         getFirstInputIdWithAttributeValue,  readInputAttribute  } from '../utils/arrayHelpers'

const InputReducer = (state, action) => {

    // helper variables
    let newInputs = state.inputdata.inputs
    let newState = { ...state}
    let newInputData
    let newRoot
    
    switch (action.type) 
    {
    
    case  'INPUTTEXT_CHANGE':
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'inputText', action.payload.newInputText)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'filteredWords', action.payload.filteredWords)
        newInputs[action.payload.input.id].dropDown === false && updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDown', true)
        newState["inputdata"].inputs = newInputs
        return(newState);
        
    case 'DROPDOWNINDEX_MOVEUP':
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDownIndex',action.payload.dropDownIndex.current)
        newState["inputdata"].inputs = newInputs;
        return(newState);

    case 'DROPDOWNINDEX_MOVEDOWN':
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDownIndex',action.payload.dropDownIndex.current)
        newState["inputdata"].inputs = newInputs;
        return(newState);

    case 'DROPDOWN_ESCAPE':
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDown', false)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDownIndex', action.payload.dropDownIndex.current)
        newState["inputdata"].inputs = newInputs;
        return(newState);

    case 'DROPDOWN_RESET':
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDown', true)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDownIndex', action.payload.dropDownIndex.current)
        newState["inputdata"].inputs = newInputs;
        return(newState);

    case 'LENGTHTOZERO_SET':
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'filteredWords', action.payload.input.wordList)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDownIndex', -1)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'wordList', action.payload.input.wordList)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDown',false)
        newState["inputdata"].inputs = newInputs;
        return(newState);

    case 'TRY_EXPAND':
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDownIndex', action.payload.dropDownIndex.current)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'inputText', action.payload.expandedWord)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'filteredWords',[])
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDown',false)
        newState["inputdata"].inputs = newInputs;
        return(newState);

    case 'DROPDOWNWORDS_CHANGE':
        newInputData = state.lister.getNextWordList(action.payload.newInputText)
        newRoot = state.lister.getExpressionRoot(action.payload.newInputText)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'wordList',newInputData)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'filteredWords',newInputData)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'inputRoot', newRoot)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDownIndex', action.payload.dropDownIndex.current)
        updateInputAttributeFromId(newInputs, action.payload.input.id, 'dropDown',true)
        newState["inputdata"].inputs = newInputs;
        return(newState);

    default:
        return(state);
    }
};

export default InputReducer;