import Input from './Input';
import { InputContext } from "../contexts/Store";
import { useContext, useState, useEffect } from 'react';


const InputsList = ({calcs}) => {

  const [state, dispatch] = useContext(InputContext);

  return (
    <div >
      {state.inputdata.inputs.map((x, key) => 
        (
          <Input input={x} key={key} /> 
        ))
      }
    </div>
  );
}

export default InputsList;
