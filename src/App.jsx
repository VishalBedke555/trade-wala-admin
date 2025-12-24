import { lazy, Suspense, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import Loader from './components/loader/Loader';

const Users = lazy(()=>import('./pages/Users'));
const ProductListing = lazy(()=>import('./pages/category/ProductListing'));
const UserDetails = lazy(()=>import('./pages/users/UserDetails'));
const Login = lazy(()=>import('./components/login/Login'));
const Approvals = lazy(()=>import('./pages/Approvals'));
const Orders = lazy(()=>import('./pages/Orders'));
const OrderDetails = lazy(()=>import('./pages/OrderDetails'));
const DealerSupplieProducts = lazy(()=>import('./pages/DealerSupplieProducts'));
const UserOrders = lazy(()=>import('./pages/users/UserOrders'))
const Statistics = lazy(()=>import('./pages/statistics/Statistics'))
const Categories = lazy(()=>import('./pages/category/Category'));
const SubCategories = lazy(()=>import('./pages/category/SubCategories'));
const ChiledCategories = lazy(()=>import('./pages/category/ChiledCategory'));
const Coupons = lazy(()=>import('./pages/coupons/Coupons'));
const CreateCoupon = lazy(()=>import('./pages/coupons/CreateCoupon'));
const DealerDetails = lazy(()=>import('./pages/dealers/DealerDetails'));
const Deliveries = lazy(()=>import('./pages/deliveries/Deliveries'));
const CustomerSupport = lazy(()=>import('./pages/customer-support/CustomerSupport'));

const Payments = lazy(()=>import('./pages/payments/Payments'));
const PaymentDetails = lazy(()=>import('./pages/payments/PaymentDetails'));

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [location.pathname]);

  return (
    <>
      <ToastContainer />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path='/pending' index element={<Approvals approvalStatus={'pending'}/>} />
          <Route path='/approved' element={<Approvals approvalStatus={'approved'}/>} />
          <Route path='/rejected' element={<Approvals approvalStatus={'rejected'}/>} />

          <Route path='/dealerDetails' element={<DealerDetails/>} />

          <Route path='/orders' element={<Orders type={'ongoing'}/>} />
          <Route path='/onrequestOrders' element={<Orders type={'onrequest'}/>} />
          <Route path='/rejectedOrders' element={<Orders type={'rejected'}/>} />
          <Route path='/completedOrders' element={<Orders type={'completed'}/>} />
          <Route path='/cancelOrders' element={<Orders type={'canceled'}/>} />

          <Route path='/returnedDeliveries' element={<Deliveries type={'returned'}/>} />

          <Route path='/' element={<Approvals approvalStatus={'approved'} isFromDealer={true}/>} />

          <Route path='/users' element={<Users />} />
          <Route path='/userDetails' element={<UserDetails />} />
          <Route path='/userOrders' element={<UserOrders />} />

          <Route path='/statistics' element={<Statistics />} />

          <Route path='/orderDetails' element={<OrderDetails/>} />
          <Route path='/dealerSupplieProducts' element={<DealerSupplieProducts/>} />

          <Route path='/allProducts' element={<DealerSupplieProducts listed={true} topListed={false}/>} />
          <Route path='/topListedProducts' element={<DealerSupplieProducts listed={true} topListed={true}/>} />

          <Route path='/coupons' element={<Coupons />} />
          <Route path='/createCoupon' element={<CreateCoupon />} />

          {/* <Route path='/'  element={<Users />} /> */}
          <Route path='/login' element={<Login />} />

          <Route path='/category' element={<Categories />} />
          <Route path='/subCategory' element={<SubCategories />} />
          <Route path='/chiledCategory' element={<ChiledCategories />} />

          <Route path='/transaction' element={<Payments status={""}/>} />
          <Route path='/pendingTransaction' element={<Payments status={"pending"}/>} />
          <Route path='/successTransaction' element={<Payments status={"success"}/>} />
          <Route path='/rejectedTransaction' element={<Payments status={"reject"}/>} />

          <Route path='/payments' element={<Payments status={""}/>} />
          <Route path='/paymentDetails' element={<PaymentDetails/>} />
          <Route path='/customerSupport' element={<CustomerSupport/>} />

          <Route path='/productListing' element={<ProductListing />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App