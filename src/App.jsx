import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import ResumeEditor from "./pages/ResumeEditor";
import ResumePreview from "./pages/ResumePreview";
import JobDetail from "./pages/JobDetail";

function App() {
  return (
    <Routes>
      {/* Default homepage */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/jobs/:jobId" element={<JobDetail />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/preview" element={<ResumePreview />} />
      <Route path="/profile" element={ <PrivateRoute> <ResumeEditor/> </PrivateRoute>} />
    </Routes>
  );
}

export default App;
