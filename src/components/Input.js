import { useContext, useState, useEffect } from "react"; 
import { InputContext } from "../contexts/Store";
import  { Form }  from 'react-bootstrap';
import { Card, CardBody } from "reactstrap";

import {configure, HotKeys } from "react-hotkeys";
import {HotKeysPreventDefaults} from '../utils/HotkeysPreventDefaults';
import {getDiff} from '../utils/arrayHelpers'

const Input = ({input}) => {
    
    //state update checks
    const [state, dispatch] = useContext(InputContext)
    const [currentInput, setCurrentInput] = useState("")
    const [inputText, setInputText] = useState(input.inputText);

    //hotkeys
    const hotkeyhandler = HotKeysPreventDefaults({'activateDropdown': ()  => {   if (!input.dropDown){input.dropDown = true} }})
    const hotkeymap = {'activateDropdown': 'ctrl+`'} // to do = check why this is only working for the flash of an instant
    configure({ ignoreTags: ['input', 'select', 'textarea'],ignoreEventsCondition: function() {}}) // run hotkeys in inputs too
    const checkPropagation = (e) => { if(['Tab','Escape','`'].includes(e.key)) { e.preventDefault() } }

    //input does not re-render with new text when autofilled - useEffect to update it
    useEffect(() => (setInputText(input.inputText)),[input.inputText])

    const evaluateInputKeyUp = (e) => {
        if( e.target.value.length === 0) 
        {
            dispatch({ type:'LENGTHTOZERO_SET', payload:{input:input}})
        }
        else
        {   
            if(['ArrowUp','ArrowDown', 'Escape'].includes(e.key))
            {
                if(e.key === 'ArrowUp')
                {
                    dispatch({ type:'DROPDOWNINDEX_MOVEDOWN', payload:{input:input}})
                }
                else if(e.key === 'ArrowDown')
                {
                    dispatch({ type:'DROPDOWNINDEX_MOVEUP', payload:{input:input}})
                }
                else
                {
                    dispatch({ type:'DROPDOWN_ESCAPE', payload:{input:input}})
                }
            }
            else if (['Enter'].includes(e.key))
            {
                dispatch({ type:'TRY_EXPAND', payload:{input:input,  newInputText:e.target.value, dropDownSelectionIndex:(input.dropdDownIndex < 0 ? 0 : input.dropdDownIndex)}})
            }
            else
            {   
                let lastTyped = getDiff(currentInput, e.target.value)
                setCurrentInput(e.target.value)
                if(lastTyped.includes('(') || lastTyped.includes('.'))
                {
                    dispatch({ type:'DROPDOWNWORDS_CHANGE', payload:{input:input, newInputText:e.target.value}})
                }
                else
                {
                    dispatch({ type:'INPUTTEXT_CHANGE', payload:{input:input, newInputText:inputText}})
                }
                
            }
        }
    }
    
    
    // input + doropdown components
    const InputBoxItemsList = ({TokensFiltered, textLength}) =>
    {
        return (TokensFiltered.map( (w, index ) => (<li style={{paddingLeft:0, backgroundColor: ((input.dropDownIndex === index)? "lightblue": "white"),textAlign:"left" }} 
                                                        key={index}><p> 
                                                            <strong>{w.substr(0,textLength)}</strong>{w.substr(textLength, w.length)} </p>
                                                        </li>)))
    }

    return(
        <HotKeys keyMap={hotkeymap} handlers={hotkeyhandler}>
        <Card >
            <CardBody>
                <Form.Group id={input.id} className="mb-3" controlId="formBasicText" >
                    <Form.Control placeholder="Calc"
                                  key={input.id}
                                  type="text"
                                  value={ inputText } 
                                  autoComplete="off"
                                  onKeyDown={(e) => (checkPropagation(e))}
                                  onKeyUp={(e) => {evaluateInputKeyUp(e)}}
                                  onChange={(e ) => (setInputText(e.target.value))}
                                  onBlur={() => (input.dropDown = false)}
                                  />
                </Form.Group>

                {(input.dropDown) &&
                    <div className="autocomplete-items" style={{zIndex: 5, position: "relative" }}  >
                        <ul style={{ listStyleType: "none", listStylePosition:"inside"}}>
                                <InputBoxItemsList TokensFiltered={input.filteredWords} textLength={input.inputText.length}/>
                        </ul>
                    </div>
                }
            </CardBody>
        </Card>
        </HotKeys>
        )

// )

        // }
}

export default Input;