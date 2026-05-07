// Remove this line: import './App.css';
import "leaflet/dist/leaflet.css";
import { LoadScript } from "@react-google-maps/api";

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
import PickUp from './page/PublishRide/PickUp';
import DestinationPage from './page/PublishRide/DestinationPage';
import RoutePreviewPage from './page/PublishRide/RoutePreviewPage';
import StopoversPage from './page/PublishRide/StopoversPage';
import CarSelection from './page/PublishRide/CarSelection';
import PriceSelection from './page/PublishRide/PriceSelection';
import RideReview from './page/PublishRide/RideReview';
import RideDateSeat from './page/PublishRide/RideDateSeat';
import MyRide from './page/User/MyRide';
import { ManageCar } from "./page/ManageCar";
import { ToastContainer } from "react-toastify";
import RideDeatil from "./page/RideDeatil";
import TermsOfService from "./page/Website Content/TermsOfService";
import Dashboard from "./page/Admin/Dashboard";
import AdminRoute from "./component/AdminRoute";
import VerifyOtpPage from "./page/VerifyOtpPage";
import PribacyPolicy from "./page/Website Content/PrivacyPolicy";

function App() {
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
      libraries={["places", "routes"]}
    >
      <BrowserRouter>
        <ScrollToTop />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>

          {/* ✅ WITH Navbar + Footer */}
          <Route element={<MainLayout />}>
            <Route path='/' element={<Home />} />
            <Route path='/offer-ride' element={<OfferRide />} />
            <Route path='/search' element={<Search />} />
            <Route path='/About-us' element={<AboutUs />} />
            <Route path='/login' element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path='/register' element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path='/profile/edit' element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/profile/manage-car" element={<ManageCar />} />
            <Route path='/vehicle/add' element={<AddVehicle />} />
            <Route path='/vehicle/edit/:id' element={<EditVehicle />} />
            <Route path='/my-rides' element={<MyRide />} />
            <Route path="/rides/:id" element={<RideDeatil />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PribacyPolicy />} />

            {/* ADMIN SIDE ROUTES */}
            <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
            {/* <Route path="/admin/dashboard" element={<Dashboard /> } /> */}

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
            <Route path='/offer-ride/date-seat' element={<RideDateSeat />} />
            <Route path='/offer-ride/ride-review' element={<RideReview />} />
          </Route>


        </Routes>
      </BrowserRouter>
    </LoadScript>
  );
}

export default App;