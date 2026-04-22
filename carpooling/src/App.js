import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './component/Footer';
import Navbar from './component/Navbar';
import Home from './page/Home';
import OfferRide from './page/OfferRide';
import Search from './page/Search';
import AboutUs from './page/AboutUs';
import NotFound from './page/NotFound';
import ScrollToTop from './component/ScrollToTop';
import SearchCarSharing from './page/SearchCarSharing';
import LoginPage from './page/Login';
import RegisterPage from './page/Register';
import PublicRoute from './component/PublicRoute';
import ProtectedRoute from './component/ProtectedRoute';
import ProfilePage from './page/ProfilePage';
import EditProfile from './page/EditProfile';
import AddVehicle from './page/AddVehicle';
import EditVehicle from './page/EditVehicle';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        {/* <Route path='/offer-ride' element={<ProtectedRoute><OfferRide /></ProtectedRoute>} /> */}
        <Route path='/offer-ride' element={<OfferRide />} />
        <Route path='/search' element={<Search />} />
        <Route path='/About-us' element={<AboutUs />} />
        <Route path='/Search-car-sharing' element={<SearchCarSharing />} />
        <Route path='/login' element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path='/profile/edit' element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path='/vehicle/add' element={<AddVehicle />} />
        <Route path='/vehicle/edit/:id' element={<EditVehicle />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
