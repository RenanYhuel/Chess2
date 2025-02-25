import {  GameProvider} from "./context/GameContext";
import Board from "./components/Board";

const App = () => {
  return (
    <GameProvider>
      <div className="App">
        <Board />
      </div>
    </GameProvider>
  );
};

export default App;
