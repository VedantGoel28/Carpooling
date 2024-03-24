import "./App.css";
import { useNavigate, Routes, Route } from "react-router-dom";
import RegisterScreen from "./screens/RegisterScreen";
import Signin from "./screens/Signin";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";

function App() {
  return (
      <Routes>
        <Route path="/" element={<RegisterScreen />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path='/home' element={<HomeScreen/>}/>
      </Routes>
  );
}

export default App;
