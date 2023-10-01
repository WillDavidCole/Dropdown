import { useContext, useState, useEffect, useRef } from "react"; 
import { InputContext } from "../contexts/Store";
import  { Form }  from 'react-bootstrap';
import { Card, CardBody, DropdownItem } from "reactstrap";

import {configure, HotKeys } from "react-hotkeys";
import {HotKeysPreventDefaults} from '../utils/HotkeysPreventDefaults';
import {filterTokenList, getDiff} from '../utils/arrayHelpers'

const Input = ({input}) => {

    //state update checks
    const [state, dispatch] = useContext(InputContext)    
    const [currentInput, setCurrentInput] = useState("")
    const [inputText, setInputText] = useState(input.inputText)
    const [root, setRoot] = useState(true)
    const calculations = state.getCalculationData()

    let filteredWords, lastTyped;
    
    //hotkeys -> hotkeys should only be used in the level above
    // const hotkeyhandler = HotKeysPreventDefaults({'activateDropdown': ()  => {   if (!input.dropDown){input.dropDown = true} }})
    // const hotkeymap = {'activateDropdown': 'ctrl+`'} 
    // configure({ ignoreTags: ['input', 'select', 'textarea'],ignoreEventsCondition: function() {}})

    const checkPropagation = (e) => { if(['Enter','Escape','`'].includes(e.key)) { e.preventDefault() } }
    //input does not re-render with new text when autofilled - useEffect to update it
    useEffect(  () => ( setInputText(input.inputText) ),[input.inputText])
    const dropDownIndex = useRef(input.dropDownIndex) // to avoid rerenders when the component changes
    const decideIsRoot = (text) => { text.includes("(")  && calculations.forEach(x => "calc." + x).any(x => (x.includes(text.toLowerCase())))} // this needs testing for validity

    // the reducer caller (from input)
    const evaluateInputKeyUp = (e) => {

        setRoot(decideIsRoot(input.inputText)) // Master = check input.inputText at this point - check which component
        
        if( e.target.value.length === 0) 
        {
            dispatch({ type:'LENGTHTOZERO_SET', payload:{input:input, dropDownIndex:dropDownIndex, root:root}})
        }
        else
        {   
            if(['ArrowUp','ArrowDown', 'Escape','`'].includes(e.key))
            {
                if(e.key === 'ArrowUp')
                {
                    dropDownIndex.current = (dropDownIndex.current < 0 ? dropDownIndex.current : dropDownIndex.current - 1)
                    dispatch({ type:'DROPDOWNINDEX_MOVEDOWN', payload:{input:input, dropDownIndex:dropDownIndex}})
                }
                else if(e.key === 'ArrowDown')
                {
                    dropDownIndex.current = (dropDownIndex.current + 3 > input.filteredWords.length ? input.filteredWords.length - 1 : dropDownIndex.current + 1)
                    dispatch({ type:'DROPDOWNINDEX_MOVEUP', payload:{input:input, dropDownIndex:dropDownIndex}})
                }
                else if(e.key === '`')
                {
                    dropDownIndex.current = -1
                    dispatch({ type:'DROPDOWN_RESET', payload:{input:input,dropDownIndex:dropDownIndex}})
                }
                else // Escape
                {
                    dropDownIndex.current = 0
                    dispatch({ type:'DROPDOWN_ESCAPE', payload:{input:input,dropDownIndex:dropDownIndex}})
                }
            }
            else if (['Enter'].includes(e.key))
            {
                dispatch({ type:'TRY_EXPAND', payload:{input:input,  expandedWord:(input.inputRoot + input.filteredWords[dropDownIndex.current]), dropDownIndex:dropDownIndex}}) // newInputText:e.target.value
            }
            else
            {   
                lastTyped = getDiff(currentInput, e.target.value)
                setCurrentInput(e.target.value)
                if(lastTyped.includes('(') || lastTyped.includes('.'))
                {
                        dropDownIndex.current = 0
                        dispatch({ type:'DROPDOWNWORDS_CHANGE', payload:{input:input, newInputText:e.target.value, dropDownIndex:dropDownIndex, root:root}})
                }
                else
                {
                    filteredWords = filterTokenList(input.wordList, input.rootList, inputText, input.inputRoot, root)
                    dropDownIndex.current = ((dropDownIndex.current < filteredWords.length) ? dropDownIndex.current : filteredWords.length)
                    dispatch({ type:'INPUTTEXT_CHANGE', payload:{input:input, newInputText:inputText, dropDownIndex:dropDownIndex, filteredWords:filteredWords}})
                }
                
            }
        }
    }

    const InputBoxItemsList = ({TokensFiltered, textLength}) =>
    {
        return (TokensFiltered.map( (w, index ) => (<li style={{paddingLeft:0, backgroundColor: ((dropDownIndex.current === index)? "lightblue": "white"),textAlign:"left" }} 
                                                        key={index}><p> 
                                                            <strong>{w.substr(0,textLength)}</strong>{w.substr(textLength, w.length)} </p>
                                                        </li>)))
    }
    
    // <HotKeys keyMap={hotkeymap} handlers={hotkeyhandler}>
    //</HotKeys>
    return(
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
                                <InputBoxItemsList TokensFiltered={input.filteredWords} textLength={input.inputText.substring(input.inputRoot.length).length}/>
                        </ul>
                    </div>
                }
            </CardBody>
        </Card>
        )
}

export default Input;