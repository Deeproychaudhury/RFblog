import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import AddEDITblog from "./pages/AddEDITblog";
import Abouts from "./pages/About";
import { auth } from "./firebase/firebase";
import { signOut } from "firebase/auth";
import './media-query.css'
import './style.scss'
import { useState, useEffect } from "react";
import { ToastContainer } from "react-bootstrap";
import Header from "./components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from "./pages/Auth";
import Blogs from "./pages/Blog";
import UserProfile from "./pages/UserProfile";
import CategoryBlog from "./pages/CategoryBlog";
import TagBlog from "./pages/TagBlog";
import Footer from "./components/Footer";
import FollowedUserProfile from "./pages/FollowedUserProfile";

function App() {
  const [active, setActive] = useState("home");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);
  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setActive("login");
      navigate("/auth");
    });
  };

  return (
    <div className="App d-flex flex-column" style={{ minHeight: "100vh" }}>
      <Header setActive={setActive}
        active={active}
        user={user}
        handleLogout={handleLogout} />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home setActive={setActive} active={active} user={user} />} />
          <Route
            path="/detail/:id"
            element={<Detail setActive={setActive} user={user} />}
          />
          <Route
            path="/search"
            element={<Home setActive={setActive} user={user} />}
          />
          <Route path="/create" element={
            user?.uid ? <AddEDITblog user={user} /> : <Navigate to="/auth" />
          } />
          <Route
            path="/update/:id"
            element={
              user?.uid ? (
                <AddEDITblog user={user} setActive={setActive} />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route path="/about" element={<Abouts />} />
          <Route path="/blogs" element={<Blogs setActive={setActive} />} />
          <Route path="/category/:category" element={<CategoryBlog setActive={setActive} />} />
          <Route path="/auth" element={<Auth setActive={setActive} />} />
          <Route path="/profile" element={<UserProfile user={user} />} />
          <Route path="/tag/:tag" element={<TagBlog setActive={setActive} />} />
          <Route path="/followedUser/:userId" element={<FollowedUserProfile />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
