// import {useContext} from 'react';
// import InputContext from '../contexts/InputContext  ';
// const  inputData = useContext(InputContext);

const DropdownReducer = (state, action) => {

    switch (action.type) {
    

    case 'GET_FILTERED_LIST': //input id, filters, start (charindex), index
        let text = state.inputs[state.inputs.id].text;
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

export default DropdownReducer;