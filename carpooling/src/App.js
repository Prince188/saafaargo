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
  PublishRideSkeleton,
  AuthFormSkeleton,
  ProfilePanelSkeleton,
  ContentPageSkeleton,
  RideDetailSkeleton,
  BlogDetailSkeleton,
  AdminTableSkeleton
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

// Helper to resolve the correct skeleton loader on reload based on active window path
function getSkeletonForPath(path) {
  if (!path || path === "/" || path === "") {
    return <HomeSkeleton />;
  }
  if (path.startsWith("/search") || path.startsWith("/my-rides") || path.startsWith("/my-trips")) {
    return <SearchSkeleton />;
  }
  if (path.startsWith("/blog/")) {
    return <BlogDetailSkeleton />;
  }
  if (path.startsWith("/blog")) {
    return <BlogsSkeleton />;
  }
  if (path.startsWith("/admin/dashboard")) {
    return <DashboardSkeleton />;
  }
  if (path.startsWith("/admin")) {
    return <AdminTableSkeleton />;
  }
  if (path.startsWith("/offer-ride")) {
    return <PublishRideSkeleton />;
  }
  if (
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password") ||
    path.startsWith("/verify-otp")
  ) {
    return <AuthFormSkeleton />;
  }
  if (
    path.startsWith("/profile") ||
    path.startsWith("/vehicle") ||
    path.startsWith("/edit-ride")
  ) {
    return <ProfilePanelSkeleton />;
  }
  if (path.startsWith("/rides/")) {
    return <RideDetailSkeleton />;
  }
  if (
    path.startsWith("/About-us") ||
    path.startsWith("/terms") ||
    path.startsWith("/privacy") ||
    path.startsWith("/help") ||
    path.startsWith("/contact")
  ) {
    return <ContentPageSkeleton />;
  }
  return <PageSkeleton />;
}

function App() {
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
      libraries={["places", "routes"]}
      loadingElement={getSkeletonForPath(window.location.pathname)}
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
      <Suspense fallback={null}>
        <Routes>

          {/* ✅ WITH Navbar + Footer */}
          <Route element={<MainLayout />}>
            <Route path='/' element={<Suspense fallback={<HomeSkeleton />}><Home /></Suspense>} />
            <Route path='/offer-ride' element={<Suspense fallback={<PublishRideSkeleton />}><OfferRide /></Suspense>} />
            <Route path='/search' element={<Suspense fallback={<SearchSkeleton />}><Search /></Suspense>} />
            <Route path='/About-us' element={<Suspense fallback={<ContentPageSkeleton />}><AboutUs /></Suspense>} />
            <Route path='/login' element={<Suspense fallback={<AuthFormSkeleton />}><LoginPage /></Suspense>} />
            <Route path='/register' element={<Suspense fallback={<AuthFormSkeleton />}><RegisterPage /></Suspense>} />
            <Route path="/verify-otp" element={<Suspense fallback={<AuthFormSkeleton />}><VerifyOtpPage /></Suspense>} />
            <Route path='/profile' element={<ProtectedRoute><Suspense fallback={<ProfilePanelSkeleton />}><ProfilePage /></Suspense></ProtectedRoute>} />
            <Route path='/profile/edit' element={<ProtectedRoute><Suspense fallback={<ProfilePanelSkeleton />}><EditProfile /></Suspense></ProtectedRoute>} />
            <Route path="/profile/manage-car" element={<Suspense fallback={<ProfilePanelSkeleton />}><ManageCar /></Suspense>} />
            <Route path='/vehicle/add' element={<Suspense fallback={<ProfilePanelSkeleton />}><AddVehicle /></Suspense>} />
            <Route path='/vehicle/edit/:id' element={<Suspense fallback={<ProfilePanelSkeleton />}><EditVehicle /></Suspense>} />
            <Route path='/my-rides' element={<Suspense fallback={<SearchSkeleton />}><MyRide /></Suspense>} />
            <Route path='/edit-ride/:id' element={<Suspense fallback={<ProfilePanelSkeleton />}><EditRide /></Suspense>}/>
            <Route path="/my-trips" element={<Suspense fallback={<SearchSkeleton />}><MyTrips /></Suspense>} />
            <Route path="/rides/:id" element={<Suspense fallback={<RideDetailSkeleton />}><RideDeatil /></Suspense>} />
            <Route path="/terms" element={<Suspense fallback={<ContentPageSkeleton />}><TermsOfService /></Suspense>} />
            <Route path="/privacy" element={<Suspense fallback={<ContentPageSkeleton />}><PribacyPolicy /></Suspense>} />
            <Route path="/blog" element={<Suspense fallback={<BlogsSkeleton />}><Blogs /></Suspense>} />
            <Route path="/blog/:id" element={<Suspense fallback={<BlogDetailSkeleton />}><BlogDetails /></Suspense>} />
            <Route path="/admin/blogs/create" element={<Suspense fallback={<AdminTableSkeleton />}><AdminCreateBlog /></Suspense>} />
            <Route path="/help" element={<Suspense fallback={<ContentPageSkeleton />}><Help /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<ContentPageSkeleton />}><ContactUs /></Suspense>} />
            <Route path="/forgot-password" element={<Suspense fallback={<AuthFormSkeleton />}><ForgotPasswordPage /></Suspense>}/>
            <Route path="/reset-password" element={<Suspense fallback={<AuthFormSkeleton />}><ResetPasswordPage /></Suspense>}/>

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
              <Route path="users" element={<Suspense fallback={<AdminTableSkeleton />}><User /></Suspense>} />
              <Route path="rides" element={<Suspense fallback={<AdminTableSkeleton />}><Rides /></Suspense>} />
              <Route path="blogs" element={<Suspense fallback={<AdminTableSkeleton />}><AdminBlogs /></Suspense>} />
              <Route path="blogs/edit/:id" element={<Suspense fallback={<AdminTableSkeleton />}><AdminEditBlog /></Suspense>} />
              <Route path="subscribers" element={<Suspense fallback={<AdminTableSkeleton />}><Subscribers /></Suspense>} />
              <Route path="contacts" element={<Suspense fallback={<AdminTableSkeleton />}><Contacts /></Suspense>} />
              <Route path="verify" element={<Suspense fallback={<AdminTableSkeleton />}><DriverVerify /></Suspense>} />
            </Route>
          </Route>


        </Routes>
      </Suspense>
      {/* </BrowserRouter> */}
    </LoadScript>
  );
}

export default App;