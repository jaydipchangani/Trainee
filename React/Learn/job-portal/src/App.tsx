import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PostJob from "./pages/PostJob";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import MyJobs from "./pages/MyJobs"; 

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
  { path: "/post-job", element: <ProtectedRoute><PostJob /></ProtectedRoute> },
  { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
  { path: "/my-jobs", element: <ProtectedRoute><MyJobs /></ProtectedRoute> }, // 👈 New route for MyJobs
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
