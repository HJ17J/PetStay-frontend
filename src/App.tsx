import MainPage from "./pages/MainPage";
import ChatPage from "./pages/ChatPage";
import { Provider } from "react-redux";
import store from "./store/store";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PetSitterList from "./pages/PetSitterList";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainPage />} />
            {/* <Route path="/chat" element={<ChatPage />} /> */}
            <Route path="/pet-sitters" element={<PetSitterList />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
