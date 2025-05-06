import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import Dashboard from './components/Dashboard/Dashboard';
import Users from './components/Users/Users';
import AdminDisplay from './components/AdminDisplay/AdminDisplay';
import UserHome from './components/UserHome_C';
import ProductDetails from './components/ProductDetails/ProductDetails_C';
import MenCloths from './components/MenCloths';
import WomenCloths from './components/WomenCloths';
import KidsCloths from './components/KidsCloths';
import TailoringUI from './components/TailoringUI/TailoringUI';
import TailoringDisplay from './components/TailoringDisplay/TailoringDisplay';
import TailoringMyOrders from './components/TailoringMyOrders';
import SkinColor from './components/skinColor'
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import AddFeedback from './components/Feedback/addFeedback';
import AdminReview from './components/AdminReview/AdminReview';
import Login from './components/Login/login';
import SignUp from './components/SignUp/signUp'
import ForgotPassword from './components/ForgotPassword/forgotPassword'
import BodyMeasurement from './components/BodyMeasurement/BodyMeasurement'
import UserProfile from './components/UserProfile/UserProfile';
import ResetPassword from './components/ResetPassword/ResetPassword';
import AllProfiles from './components/AllProfiles/AllProfiles';
import Payment from './components/Payment/Payment';
import Orders from './components/Orders/Orders';
import PlaceOrder from './components/PlaceOrder/PlaceOrder';
import EditPlaceOrder from './components/EditPlaceOrder';
import Recommend from './components/Recommend/Recommend';
import AdminOrders from './components/AdminOrders/AdminOrders';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<BrowserRouter>
    <Routes>
        <Route path='/' element={<UserHome />} />
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/users' element={<Users />} />
        <Route path='/AdminDisplay' element={<AdminDisplay />} />
        <Route path='/UserHome_C' element={<UserHome />} />
        <Route path='/ProductDetails_C' element={<ProductDetails />} />
        <Route path='/MenCloths' element={<MenCloths />} />
        <Route path='/WomenCloths' element={<WomenCloths />} />
        <Route path='/KidsCloths' element={<KidsCloths />} />
        <Route path='/TailoringUI' element={<TailoringUI />} />
        <Route path='/TailoringDisplay' element={<TailoringDisplay />} />
        <Route path='/TailoringMyOrders' element={<TailoringMyOrders />} />
        <Route path='/skin' element={<SkinColor />} />
        <Route path='/ShoppingCart' element={<ShoppingCart />} />
        <Route path='/addFeedback' element={<AddFeedback />} />
        <Route path='/adminReview' element={<AdminReview />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/bodymeasurement' element={<BodyMeasurement />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/AllProfiles' element={<AllProfiles />} />
        <Route path="/Payment/:amount" element={<Payment />} />
        <Route path="/Orders" element={<Orders />} />
        <Route path="/AdminOrders" element={<AdminOrders />} />
        <Route path="/PlaceOrder" element={<PlaceOrder />} />
        <Route path="/PlaceOrder/:amount" element={<PlaceOrder />} />
        <Route path="/EditPlaceOrder/:amount/:deliveryId" element={<EditPlaceOrder />} />
        <Route path="/Recommend" element={<Recommend />} />
</Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
