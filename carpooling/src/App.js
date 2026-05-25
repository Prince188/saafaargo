import "leaflet/dist/leaflet.css";
import { LoadScript } from "@react-google-maps/api";
import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import ScrollToTop from './component/ScrollToTop';
import MainLayout from '../src/component/MainLayout';
import PlainLayout from '../src/component/PlainLayout';
import PublicRoute from './component/PublicRoute';
import ProtectedRoute from './component/ProtectedRoute';
import AdminRoute from './component/AdminRoute';
import { ToastContainer } from "react-toastify";
import { 
  PageSkeleton, 
  HomeSkeleton, 
  SearchSkeleton, 
  BlogsSkeleton, 
  DashboardSkeleton, 
  PublishRideSkeleton 
} from "./component/Skeleton";

// Dynamic Lazy Imports
const Home = lazy(() => import('./page/Home'));
const OfferRide = lazy(() => import('./page/OfferRide'));
const Search = lazy(() => import('./page/Search'));
const AboutUs = lazy(() => import('./page/AboutUs'));
const NotFound = lazy(() => import('./page/NotFound'));
const LoginPage = lazy(() => import('./page/Login'));
const RegisterPage = lazy(() => import('./page/Register'));
const ProfilePage = lazy(() => import('./page/ProfilePage'));
const EditProfile = lazy(() => import('./page/EditProfile'));
const AddVehicle = lazy(() => import('./page/AddVehicle'));
const EditVehicle = lazy(() => import('./page/EditVehicle'));
const PickUp = lazy(() => import('./page/PublishRide/PickUp'));
const DestinationPage = lazy(() => import('./page/PublishRide/DestinationPage'));
const RoutePreviewPage = lazy(() => import('./page/PublishRide/RoutePreviewPage'));
const StopoversPage = lazy(() => import('./page/PublishRide/StopoversPage'));
const CarSelection = lazy(() => import('./page/PublishRide/CarSelection'));
const PriceSelection = lazy(() => import('./page/PublishRide/PriceSelection'));
const RideReview = lazy(() => import('./page/PublishRide/RideReview'));
const RideDateSeat = lazy(() => import('./page/PublishRide/RideDateSeat'));
const MyRide = lazy(() => import('./page/User/MyRide'));
const ManageCar = lazy(() => import('./page/ManageCar').then(module => ({ default: module.ManageCar })));
const RideDeatil = lazy(() => import('./page/RideDeatil'));
const TermsOfService = lazy(() => import('./page/Website Content/TermsOfService'));
const Dashboard = lazy(() => import('./page/Admin/Dashboard'));
const VerifyOtpPage = lazy(() => import('./page/VerifyOtpPage'));
const PribacyPolicy = lazy(() => import('./page/Website Content/PrivacyPolicy'));
const MyTrips = lazy(() => import('./page/User/MyTrips'));
const Blogs = lazy(() => import('./page/Blog/Blogs'));
const BlogDetails = lazy(() => import('./page/Blog/BlogDetails'));
const AdminCreateBlog = lazy(() => import('./page/Admin/AdminCreateBlog'));
const AdminLayout = lazy(() => import('./page/Admin/AdminLayout'));
const User = lazy(() => import('./page/Admin/User'));
const Rides = lazy(() => import('./page/Admin/Rides'));
const AdminBlogs = lazy(() => import('./page/Admin/AdminBlogs'));
const AdminEditBlog = lazy(() => import('./page/Admin/AdminEditBlog'));
const Subscribers = lazy(() => import('./page/Admin/Subscribers'));
const Contacts = lazy(() => import('./page/Admin/Contacts'));
const Help = lazy(() => import('./page/Help'));
const ContactUs = lazy(() => import('./page/ContactUs'));
const DriverVerify = lazy(() => import('./page/Admin/DriverVerify'));
const EditRide = lazy(() => import('./page/User/EditRide'));
const ForgotPasswordPage = lazy(() => import('./page/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./page/ResetPasswordPage'));

function App() {
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
      libraries={["places", "routes"]}
      loadingElement={<HomeSkeleton />}
    >
      {/* <BrowserRouter> */}
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
      <Suspense fallback={<PageSkeleton />}>
        <Routes>

          {/* ✅ WITH Navbar + Footer */}
          <Route element={<MainLayout />}>
            <Route path='/' element={<Suspense fallback={<HomeSkeleton />}><Home /></Suspense>} />
            <Route path='/offer-ride' element={<Suspense fallback={<PublishRideSkeleton />}><OfferRide /></Suspense>} />
            <Route path='/search' element={<Suspense fallback={<SearchSkeleton />}><Search /></Suspense>} />
            <Route path='/About-us' element={<AboutUs />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path='/profile/edit' element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/profile/manage-car" element={<ManageCar />} />
            <Route path='/vehicle/add' element={<AddVehicle />} />
            <Route path='/vehicle/edit/:id' element={<EditVehicle />} />
            <Route path='/my-rides' element={<MyRide />} />
            <Route path='/edit-ride/:id' element={<EditRide/>}/>
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/rides/:id" element={<RideDeatil />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PribacyPolicy />} />
            <Route path="/blog" element={<Suspense fallback={<BlogsSkeleton />}><Blogs /></Suspense>} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/admin/blogs/create" element={<AdminCreateBlog />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
            <Route path="/reset-password" element={<ResetPasswordPage/>}/>

            {/* <Route path="/admin/dashboard" element={<Dashboard /> } /> */}



            <Route path='*' element={<NotFound />} />

          </Route>

          {/* ❌ WITHOUT Navbar + Footer */}
          <Route element={<PlainLayout />}>
            <Route path='/offer-ride/pickup' element={<Suspense fallback={<PublishRideSkeleton />}><PickUp /></Suspense>} />
            <Route path='/offer-ride/destination' element={<Suspense fallback={<PublishRideSkeleton />}><DestinationPage /></Suspense>} />
            <Route path='/offer-ride/route-preview' element={<Suspense fallback={<PublishRideSkeleton />}><RoutePreviewPage /></Suspense>} />
            <Route path='/offer-ride/stop-over' element={<Suspense fallback={<PublishRideSkeleton />}><StopoversPage /></Suspense>} />
            <Route path='/offer-ride/prices' element={<Suspense fallback={<PublishRideSkeleton />}><PriceSelection /></Suspense>} />
            <Route path='/offer-ride/car' element={<Suspense fallback={<PublishRideSkeleton />}><CarSelection /></Suspense>} />
            <Route path='/offer-ride/date-seat' element={<Suspense fallback={<PublishRideSkeleton />}><RideDateSeat /></Suspense>} />
            <Route path='/offer-ride/ride-review' element={<Suspense fallback={<PublishRideSkeleton />}><RideReview /></Suspense>} />

            {/* Admin Routes */}

            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<Suspense fallback={<DashboardSkeleton />}><Dashboard /></Suspense>} />
              <Route path="users" element={<User />} />
              <Route path="rides" element={<Rides />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="blogs/edit/:id" element={<AdminEditBlog />} />
              <Route path="subscribers" element={<Subscribers />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="verify" element={<DriverVerify />} />
            </Route>
          </Route>


        </Routes>
      </Suspense>
      {/* </BrowserRouter> */}
    </LoadScript>
  );
}

export default App;