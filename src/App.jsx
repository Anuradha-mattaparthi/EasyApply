import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import BasicDetails from "./pages/BasicDetails";
function App() {
  return (
    <Routes>
      {/* Default homepage */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
      <Route path="/profile" element={<BasicDetails />} />
    </Routes>
  );
}

export default App;
