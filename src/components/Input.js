import { useContext, useState } from "react"; 
import { InputContext } from "../contexts/Store";
import  { Form }  from 'react-bootstrap';
import { Card, CardBody } from "reactstrap";

import {configure, HotKeys } from "react-hotkeys";
import {HotKeysPreventDefaults} from '../utils/HotkeysPreventDefaults';

const Input = ({input}) => {
    
    const [state,dispatch] = useContext(InputContext);
    const [wordListArray, setWordListArray] = useState(input.wordList);
    const [activeDropddown, setActiveDropdown] = useState(false);
    const [currentInput, setCurrentInput] = useState("");
    
    // Dropdown variables
    const [dropdDownIndex, setDropdDownIndex] = useState(0); // input.inputText.length
    
    //input hotkeys
    const hotkeyhandler = HotKeysPreventDefaults({'activateDropdown': ()  => {   if (!activeDropddown){  setActiveDropdown(true); } }})
    const hotkeymap = {'activateDropdown': 'ctrl+`'}
    configure({ ignoreTags: ['input', 'select', 'textarea'],ignoreEventsCondition: function() {}}) // run hotkeys in inputs too
    const checkPropagation = (e) => { if(['Tab','Escape','`'].includes(e.key)) { e.preventDefault() } }

    // TODO: these need converting to reducer functions  now
    const setDropdownIndexUp =  () => { if(dropdDownIndex > 0){ setDropdDownIndex(dropdDownIndex - 1) } }
    const setDropdownIndexDown =  () => { if((dropdDownIndex + 1) < wordListArray.length){ setDropdDownIndex(dropdDownIndex + 1) }}
    const filterTokenList = (wordListArray, inputFilter) =>  { return wordListArray.filter((i) => (i.toLowerCase().startsWith(inputFilter.toLowerCase())))}

    //hand off more of these to the reducer
    const evaluateInputKeyUp = (e) => {
        if( e.target.value.length === 0) 
        {
            dispatch({ type:'LENGTHTOZERO_SET', payload:{input:input}})
        }
        else
        {   
            if(['ArrowUp','ArrowDown', 'Escape'].includes(e.key))
            {
                dispatch({ type:'DROPDOWNINDEX_MOVE', payload:{input:input, lastKeyType:e.key}})
            }
            else if (['Tab'].includes(e.key))
            {
                dispatch({ type:'TRY_EXPAND', payload:{input:input, newInputText:e.target.value}});
            }
            else
            {
                let lastTypedChar = (currentInput.length > e.target.value.length ? currentInput.slice(-1) : e.target.value.slice(-1))
                if(['(', '.'].includes(lastTypedChar))
                {
                    dispatch({ type:'DROPDOWNWORDS_CHANGE', payload:{input:input, newInputText:e.target.value}})
                }
                else
                {
                    dispatch({ type:'CHANGE_INPUTTEXT', payload:{input:input, newInputText:e.target.value}})
                }
            }
        }
    }
     
    // textLength
    const InputBoxItemsList = ({TokensFiltered, textLength}) =>
    {
        return (TokensFiltered.map( (w, index ) => (<li style={{paddingLeft:0, backgroundColor: ((dropdDownIndex === index)? "lightblue": "white"),textAlign:"left" }} 
                                                        key={index}><p> 
                                                            <strong>{w.substr(0,textLength)}</strong>{w.substr(textLength, w.length)} </p>
                                                        </li>)))
    }

    return(
        <HotKeys keyMap={hotkeymap} handlers={hotkeyhandler}>
        <Card >
            <CardBody> 
                <Form.Group id={input.id} className="mb-3" controlId="formBasicText" >
                    <Form.Control placeholder="Calc" key={input.id}  autoComplete="off"
                                  onKeyDown={(e) => (checkPropagation(e))}
                                  onKeyUp={(e) => {evaluateInputKeyUp(e)}} 
                                  onBlur={() => (setActiveDropdown(false))} />

                <Form.Text className="text-muted" ></Form.Text>
                </Form.Group>
                {(activeDropddown) &&
                    <div className="autocomplete-items" style={{zIndex: 5, position: "relative" }}  >
                        <ul style={{ listStyleType: "none", listStylePosition:"inside"}}>
                                <InputBoxItemsList TokensFiltered={wordListArray} textLength={input.inputText.length}/>
                        </ul>
                    </div>
                }
            </CardBody>
        </Card>
        </HotKeys>
    );
}

export default Input;