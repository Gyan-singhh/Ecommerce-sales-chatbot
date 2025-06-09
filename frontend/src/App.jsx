import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

function Layout() {
  const { loading } = useAuth();

  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between mx-0 px-0">
      <div className="w-full block">
        <Toaster position="top-center" />
        <Navbar />
        <main className="min-h-[80vh] flex-1 bg-gray-100 p-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : (
    <div className="h-screen flex justify-center items-center text-2xl">
      Loading...
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export default App;
