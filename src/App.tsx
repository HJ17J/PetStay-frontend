import MainPage from "./pages/MainPage";
import ChatPage from "./pages/ChatPage";
import { Provider } from "react-redux";
import store from "./store/store";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PetSitterList from "./pages/PetSitterList";
import Register from "./pages/Register";
import Mypage from "./pages/Mypage";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/profile/:userid" element={<Mypage />} />
            {/* <Route path="/chat" element={<ChatPage />} /> */}
            <Route path="/pet-sitters" element={<PetSitterList />} />
            <Route path="/login" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
