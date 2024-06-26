import MainPage from "./pages/MainPage";
import Reservation from "./pages/Reservation";
import "boxicons/css/boxicons.css";
import { Provider } from "react-redux";
import store from "./store/store";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PetSitterList from "./pages/PetSitterList";
import Register from "./pages/Register";
import Mypage from "./pages/Mypage";
import MyCalendar from "./components/MyCalender";
import GoogleAuthPage from "./pages/GoogleAuthPage";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/profile" element={<Mypage />} />
            <Route path="/petsitters" element={<PetSitterList />} />
            <Route path="/login" element={<Register />} />
            <Route path="/calender" element={<MyCalendar sitteridx={5} pay={10000} />} />
            <Route path="/petsitter/:useridx" element={<Reservation />} />
            <Route path="/mycalender" element={<Reservation />} />
            <Route path="/google-auth" element={<GoogleAuthPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
