import { useContext, useState } from "react"; 
import { InputContext } from "../contexts/Store";
import  { Form }  from 'react-bootstrap';
import { Card, CardBody } from "reactstrap";

import {configure, HotKeys } from "react-hotkeys";
import {HotKeysPreventDefaults} from '../utils/HotkeysPreventDefaults';
import { WordParser } from "../utils/CalcAutocompletion";
// import { useHotkeys } from "react-hotkeys-hook";

const Input = ({input}) => {
    
    const [state,dispatch] = useContext(InputContext);
    const [wordListArray, setWordListArray] = useState(input.wordList);
    const [activeDropddown, setActiveDropdown] = useState(false);
    const [currentInput, setCurrentInput] = useState("");
    
    // Dropdown variables
    const maximumDropdownItems = 6;
    const [dropdDownIndex, setDropdDownIndex] = useState(0); // input.inputText.length
    const [wordLength, setWordLength] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(( wordListArray.length < maximumDropdownItems)? maximumDropdownItems : wordListArray.length)
    
    //input hotkeys
    const hotkeyhandler = HotKeysPreventDefaults({'activateDropdown': ()  => {   if (!activeDropddown){  setActiveDropdown(true); } }})
    const hotkeymap = {'activateDropdown': 'ctrl+`'}
    configure({ ignoreTags: ['input', 'select', 'textarea'],ignoreEventsCondition: function() {}}) // run hotkeys in inputs too

    const setDropdownIndexUp =  () => { if(dropdDownIndex > 0){ setDropdDownIndex(dropdDownIndex - 1) } }
    const setDropdownIndexDown =  () => {
        if((dropdDownIndex + 1) < wordListArray.length){ setDropdDownIndex(dropdDownIndex + 1) }
    }

    const filterTokenList = (wordListArray, inputFilter) => 
    {
        return wordListArray.filter((i) => (i.toLowerCase().startsWith(inputFilter.toLowerCase())))
    }

    const checkPropagation = (e) => { if(['Tab','Escape','`'].includes(e.key)) { e.preventDefault() } }

    const evaluateInputKeyUp = (e) => {(
        e.target.value.length === 0) ? setActiveDropdown(false) : setActiveDropdown(true)
        let lastTypedChar = (currentInput.length > e.target.value.length ? currentInput.slice(-1) : e.target.value.slice(-1))

                                    if(currentInput !== e.target.value)
                                    {
                                        setCurrentInput( e.target.value )
                                        if (['(', '.'].includes(lastTypedChar))
                                        {
                                            if (e.target.value.length === 0)
                                            {
                                                let filterWord = state.lister.getFilter(e.target.value)
                                                setWordListArray(filterTokenList(input.wordList, filterWord))
                                                setActiveDropdown(false) // setWordListArray(input.wordList);
                                            }
                                            else
                                            {
                                                dispatch({ type:'TRY_EXPAND', payload:{input:input, newInputText:e.target.value}})
                                                setActiveDropdown(false)
                                            }
                                        }
                                        else if (e.key === 'Backspace')
                                        {
                                            if (e.target.value.length === 0)
                                            {
                                                setWordListArray(input.wordList)
                                                setActiveDropdown(false)
                                            }
                                            else
                                            {
                                                setWordListArray(filterTokenList(input.wordList, e.target.value))
                                                setActiveDropdown(true)
                                            }
                                        }
                                        else
                                        {
                                            let filterWord = state.lister.getFilter(e.target.value)
                                            setWordListArray(filterTokenList(input.wordList, filterWord))
                                            setActiveDropdown(true)
                                        }
                                    }
                                    else
                                    {
                                        switch(e.key)
                                        {
                                            case 'ArrowUp':
                                                setDropdownIndexUp();
                                                break;
                                            case 'ArrowDown':
                                                setDropdownIndexDown();
                                                break;
                                            case 'Tab':
                                                e.target.value = state.lister.getExpressionRoot(e.target.value).concat(wordListArray[dropdDownIndex]);
                                                setCurrentInput(e.target.value);
                                                setActiveDropdown(false);
                                                break;
                                            case 'Escape':
                                                setActiveDropdown(false);
                                                break;
                                            default:
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