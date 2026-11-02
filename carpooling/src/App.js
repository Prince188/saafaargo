import "leaflet/dist/leaflet.css";
import { LoadScript } from "@react-google-maps/api";
import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import ScrollToTop from './component/ScrollToTop';
import MainLayout from '../src/component/MainLayout';
import PlainLayout from '../src/component/PlainLayout';
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

// Resilient Lazy Import with automatic retry on chunk loading failure
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.warn("Chunk load error detected, retrying page...", error);
      const storageKey = `retry_chunk_${window.location.pathname}`;
      const hasRetried = sessionStorage.getItem(storageKey);
      if (!hasRetried) {
        sessionStorage.setItem(storageKey, "true");
        window.location.reload();
      }
      throw error;
    }
  });

// Dynamic Lazy Imports
const Home = lazyWithRetry(() => import('./page/Home'));
const OfferRide = lazyWithRetry(() => import('./page/OfferRide'));
const Search = lazyWithRetry(() => import('./page/Search'));
const AboutUs = lazyWithRetry(() => import('./page/AboutUs'));
const NotFound = lazyWithRetry(() => import('./page/NotFound'));
const LoginPage = lazyWithRetry(() => import('./page/Login'));
const RegisterPage = lazyWithRetry(() => import('./page/Register'));
const ProfilePage = lazyWithRetry(() => import('./page/ProfilePage'));
const EditProfile = lazyWithRetry(() => import('./page/EditProfile'));
const AddVehicle = lazyWithRetry(() => import('./page/AddVehicle'));
const EditVehicle = lazyWithRetry(() => import('./page/EditVehicle'));
const PickUp = lazyWithRetry(() => import('./page/PublishRide/PickUp'));
const DestinationPage = lazyWithRetry(() => import('./page/PublishRide/DestinationPage'));
const RoutePreviewPage = lazyWithRetry(() => import('./page/PublishRide/RoutePreviewPage'));
const StopoversPage = lazyWithRetry(() => import('./page/PublishRide/StopoversPage'));
const CarSelection = lazyWithRetry(() => import('./page/PublishRide/CarSelection'));
const PriceSelection = lazyWithRetry(() => import('./page/PublishRide/PriceSelection'));
const RideReview = lazyWithRetry(() => import('./page/PublishRide/RideReview'));
const RideDateSeat = lazyWithRetry(() => import('./page/PublishRide/RideDateSeat'));
const RidePreferences = lazyWithRetry(() => import('./page/PublishRide/RidePreferences'));
const MyRide = lazyWithRetry(() => import('./page/User/MyRide'));
const ManageCar = lazyWithRetry(() => import('./page/ManageCar').then(module => ({ default: module.ManageCar })));
const RideDeatil = lazyWithRetry(() => import('./page/RideDeatil'));
const TermsOfService = lazyWithRetry(() => import('./page/Website Content/TermsOfService'));
const Dashboard = lazyWithRetry(() => import('./page/Admin/Dashboard'));
const VerifyOtpPage = lazyWithRetry(() => import('./page/VerifyOtpPage'));
const PribacyPolicy = lazyWithRetry(() => import('./page/Website Content/PrivacyPolicy'));
const MyTrips = lazyWithRetry(() => import('./page/User/MyTrips'));
const Blogs = lazyWithRetry(() => import('./page/Blog/Blogs'));
const BlogDetails = lazyWithRetry(() => import('./page/Blog/BlogDetails'));
const AdminCreateBlog = lazyWithRetry(() => import('./page/Admin/AdminCreateBlog'));
const AdminLayout = lazyWithRetry(() => import('./page/Admin/AdminLayout'));
const User = lazyWithRetry(() => import('./page/Admin/User'));
const Rides = lazyWithRetry(() => import('./page/Admin/Rides'));
const AdminBlogs = lazyWithRetry(() => import('./page/Admin/AdminBlogs'));
const AdminEditBlog = lazyWithRetry(() => import('./page/Admin/AdminEditBlog'));
const Subscribers = lazyWithRetry(() => import('./page/Admin/Subscribers'));
const Contacts = lazyWithRetry(() => import('./page/Admin/Contacts'));
const Help = lazyWithRetry(() => import('./page/Help'));
const ContactUs = lazyWithRetry(() => import('./page/ContactUs'));
const DriverVerify = lazyWithRetry(() => import('./page/Admin/DriverVerify'));
const SearchDemand = lazyWithRetry(() => import('./page/Admin/SearchDemand'));
const EditRide = lazyWithRetry(() => import('./page/User/EditRide'));
const ForgotPasswordPage = lazyWithRetry(() => import('./page/ForgotPasswordPage'));
const ResetPasswordPage = lazyWithRetry(() => import('./page/ResetPasswordPage'));
const HowWeWork = lazyWithRetry(() => import('./page/HowWeWork'));
const Notifications = lazyWithRetry(() => import('./page/Notifications'));
const UserDashboard = lazyWithRetry(() => import('./page/User/UserDashboard'));
const WalletPage = lazyWithRetry(() => import('./page/User/Wallet'));

// Static array prevents LoadScript from reloading on every re-render
const GOOGLE_MAPS_LIBRARIES = ["places", "routes"];

// Helper to resolve the correct skeleton loader on reload based on active window path
function getSkeletonForPath(path) {
  const p = (path || "").toLowerCase();
  if (!p || p === "/" || p === "") {
    return <HomeSkeleton />;
  }
  if (p.startsWith("/search") || p.startsWith("/my-rides") || p.startsWith("/my-trips")) {
    return <SearchSkeleton />;
  }
  if (p.startsWith("/blog/")) {
    return <BlogDetailSkeleton />;
  }
  if (p.startsWith("/blog")) {
    return <BlogsSkeleton />;
  }
  if (p.startsWith("/admin/dashboard")) {
    return <DashboardSkeleton />;
  }
  if (p.startsWith("/admin")) {
    return <AdminTableSkeleton />;
  }
  if (p.startsWith("/offer-ride")) {
    return <PublishRideSkeleton />;
  }
  if (
    p.startsWith("/login") ||
    p.startsWith("/register") ||
    p.startsWith("/forgot-password") ||
    p.startsWith("/reset-password") ||
    p.startsWith("/verify-otp")
  ) {
    return <AuthFormSkeleton />;
  }
  if (
    p.startsWith("/profile") ||
    p.startsWith("/vehicle") ||
    p.startsWith("/edit-ride")
  ) {
    return <ProfilePanelSkeleton />;
  }
  if (p.startsWith("/rides/")) {
    return <RideDetailSkeleton />;
  }
  if (
    p.startsWith("/about-us") ||
    p.startsWith("/how-it-works") ||
    p.startsWith("/terms") ||
    p.startsWith("/privacy") ||
    p.startsWith("/help") ||
    p.startsWith("/contact")
  ) {
    return <ContentPageSkeleton />;
  }
  return <PageSkeleton />;
}

function App() {
  const location = useLocation();

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
      libraries={GOOGLE_MAPS_LIBRARIES}
      loadingElement={getSkeletonForPath(location.pathname)}
    >
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
        <Routes location={location} key={location.pathname}>

          {/* ✅ WITH Navbar + Footer */}
          <Route element={<MainLayout />}>
            <Route path='/' element={<Suspense fallback={<HomeSkeleton />}><Home /></Suspense>} />
            <Route path='/offer-ride' element={<Suspense fallback={<PublishRideSkeleton />}><OfferRide /></Suspense>} />
            <Route path='/search' element={<Suspense fallback={<SearchSkeleton />}><Search /></Suspense>} />
            <Route path='/about-us' element={<Suspense fallback={<ContentPageSkeleton />}><AboutUs /></Suspense>} />
            <Route path='/About-us' element={<Suspense fallback={<ContentPageSkeleton />}><AboutUs /></Suspense>} />
            <Route path='/how-it-works' element={<Suspense fallback={<ContentPageSkeleton />}><HowWeWork /></Suspense>} />
            <Route path='/How-it-works' element={<Suspense fallback={<ContentPageSkeleton />}><HowWeWork /></Suspense>} />
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
            <Route path="/notifications" element={<ProtectedRoute><Suspense fallback={<ProfilePanelSkeleton />}><Notifications /></Suspense></ProtectedRoute>} />

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
            <Route path='/offer-ride/preferences' element={<Suspense fallback={<PublishRideSkeleton />}><RidePreferences /></Suspense>} />
            <Route path='/offer-ride/date-seat' element={<Suspense fallback={<PublishRideSkeleton />}><RideDateSeat /></Suspense>} />
            <Route path='/offer-ride/ride-review' element={<Suspense fallback={<PublishRideSkeleton />}><RideReview /></Suspense>} />

            {/* User Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}>
              <Route index element={<Navigate to="profile" />} />
              <Route path="profile" element={<Suspense fallback={<ProfilePanelSkeleton />}><ProfilePage /></Suspense>} />
              <Route path="rides" element={<Suspense fallback={<SearchSkeleton />}><MyRide /></Suspense>} />
              <Route path="trips" element={<Suspense fallback={<SearchSkeleton />}><MyTrips /></Suspense>} />
              <Route path="notifications" element={<Suspense fallback={<ProfilePanelSkeleton />}><Notifications /></Suspense>} />
              <Route path="wallet" element={<Suspense fallback={<ProfilePanelSkeleton />}><WalletPage /></Suspense>} />
            </Route>

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
              <Route path="search-demand" element={<Suspense fallback={<AdminTableSkeleton />}><SearchDemand /></Suspense>} />
            </Route>
          </Route>

        </Routes>
      </Suspense>
    </LoadScript>
  );
}

export default App;
