import './App.css';
import InputsList  from './components/InputsList';
import Store from "./contexts/Store";

const App = () => {

  return (
    <div className="App">
      <Store>
        <div className="inputField">
          <InputsList/>
        </div>
      </Store>
    </div>
  );
}

export default App;
