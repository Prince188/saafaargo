import './App.css';
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ScrollToTop from './component/ScrollToTop';

import MainLayout from '../src/component/MainLayout';
import PlainLayout from '../src/component/PlainLayout';

import Home from './page/Home';
import OfferRide from './page/OfferRide';
import Search from './page/Search';
import AboutUs from './page/AboutUs';
import NotFound from './page/NotFound';
import LoginPage from './page/Login';
import RegisterPage from './page/Register';
import PublicRoute from './component/PublicRoute';
import ProtectedRoute from './component/ProtectedRoute';
import ProfilePage from './page/ProfilePage';
import EditProfile from './page/EditProfile';
import AddVehicle from './page/AddVehicle';
import EditVehicle from './page/EditVehicle';
import PickUp from './page/PickUp';
import DestinationPage from './page/DestinationPage';
import RoutePreviewPage from './page/RoutePreviewPage';
import StopoversPage from './page/StopoversPage';
import CarSelection from './page/CarSelection';
import PriceSelection from './page/PriceSelection';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>

        {/* ✅ WITH Navbar + Footer */}
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/offer-ride' element={<OfferRide />} />
          <Route path='/search' element={<Search />} />
          <Route path='/About-us' element={<AboutUs />} />
          <Route path='/login' element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path='/register' element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path='/profile/edit' element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path='/vehicle/add' element={<AddVehicle />} />
          <Route path='/vehicle/edit/:id' element={<EditVehicle />} />
          <Route path='*' element={<NotFound />} />

        </Route>

        {/* ❌ WITHOUT Navbar + Footer */}
        <Route element={<PlainLayout />}>
          <Route path='/offer-ride/pickup' element={<PickUp />} />
          <Route path='/offer-ride/destination' element={<DestinationPage />} />
          <Route path='/offer-ride/route-preview' element={<RoutePreviewPage />} />
          <Route path='/offer-ride/stop-over' element={<StopoversPage />} />
          <Route path='/offer-ride/prices' element={<PriceSelection />} />
          <Route path='/offer-ride/car' element={<CarSelection />} />
        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;