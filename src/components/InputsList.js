import Input from './Input';
import { InputContext } from "../contexts/Store";
import { useContext } from 'react';


const InputsList = () => {

  const [state, dispatch] = useContext(InputContext);
  // const renderInput = ({input,wordList}) => {
  //   return(<Input input={input} key={input.id} />);
  // }
  // const [initialWordList, setInitialWordList] = useState([]);
  
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
