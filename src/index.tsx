import ReactDOM from "react-dom/client";
import App from "./App";
import "./config/i18n";
import axios from "axios";

console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID);
axios.defaults.withCredentials = true;
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <>
    <App />
  </>
);
