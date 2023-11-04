import "./App.css";
import Homepage from "./components/Homepage/Homepage";
import Signin from "./components/Signin/Signin";
import Signup from "./components/Signup/Sigup";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Cart from "./components/Cart/Cart";
import ChangePassword from "./components/ChangePassword/ChangePassword";


function App() {
  return (
    <Router>
      <div className="page-container">
        <Routes>
          <Route path="/*" element={<Navigate to="/sign-in" />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/product-detail" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/change-password" element={<ChangePassword/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
