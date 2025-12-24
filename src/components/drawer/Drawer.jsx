import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { toast } from 'react-toastify';
import './Drawer.css';
import packageJson from '../../../package.json';

export default function Drawer({ children, hideDrawer }) {
  const navigate = useNavigate();
  const [collapseClass, setCollapseClass] = useState('collapsed');
  const [isMobileView, setIsMobileView] = useState(false);

  const dashArray = [
    {
      "Dealers Approvals": [
        { icon: 'bi bi-people', dashName: 'All Dealers', path: '/' },
        { icon: 'bi bi-hourglass-split', dashName: 'Pending', path: '/pending' },
        { icon: 'bi bi-check-circle', dashName: 'Approved', path: '/approved' },
        { icon: 'bi bi-x-circle', dashName: 'Rejected', path: '/rejected' },
      ],
    },
    {
      Users: [
        { icon: 'bi bi-people', dashName: 'All Users', path: '/users' },
      ],
    },
    {
      Transactions: [
        { icon: 'bi bi-cash-stack', dashName: 'All Transactions', path: '/transaction' },
        { icon: 'bi bi-hourglass-split', dashName: 'Pending', path: '/pendingTransaction' },
        { icon: 'bi bi-check-circle', dashName: 'Success', path: '/successTransaction' },
        { icon: 'bi bi-x-circle', dashName: 'Rejected', path: '/rejectedTransaction' },
      ],
    },
    {
      Products: [
        { icon: 'bi bi-tags', dashName: 'All Products', path: '/allProducts' },
        { icon: 'bi bi-fire', dashName: 'Top Listed Products', path: '/topListedProducts' },
      ],
    },
    {
      Dashboard: [
        { icon: 'bi bi-graph-up-arrow', dashName: 'Statistics', path: '/statistics' },
        { icon: 'bi bi-tags', dashName: 'Category', path: '/category' },
        { icon: 'bi bi-arrow-return-left', dashName: 'Returned Deliveries', path: '/returnedDeliveries' },
        { icon: 'bi bi-credit-card', dashName: 'Payment Details', path: '/paymentDetails' },
        { icon: 'bi bi-headset', dashName: 'Customer Support', path: '/customerSupport' },
      ],
    },
    {
      Orders: [
        { icon: 'bi bi-question-circle', dashName: 'Request Orders', path: '/onrequestOrders' },
        { icon: 'bi bi-hourglass-split', dashName: 'Ongoing Orders', path: '/orders' },
        { icon: 'bi bi-x-circle', dashName: 'Rejected Orders', path: '/rejectedOrders' },
        { icon: 'bi bi-check-circle', dashName: 'Completed Orders', path: '/completedOrders' },
        { icon: 'bi bi-x-circle', dashName: 'Cancel Orders', path: '/cancelOrders' },
      ],
    },

    {
      Coupons: [
        { icon: 'bi bi-people', dashName: 'All Coupons', path: '/coupons' },
      ],
    },
    
  ];

  const handleToggleDrawer = () => {
    setCollapseClass((prev) => (prev === '' ? 'collapsed' : ''));
  };

  const logOut = () => {
    const isConfirm = window.confirm('Are you sure? You want to Logout...?');
    if (isConfirm) {
      localStorage.setItem('token', '');
      toast.error('Logging Out');
      navigate('/login');
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobileView) setCollapseClass('collapsed');
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 700);
      setCollapseClass(window.innerWidth < 700 ? 'collapsed' : '');
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (hideDrawer) {
    return children;
  }

  return (
    <div className={`drawer-container ${collapseClass}`}>
      <div className={`homeMain ${collapseClass}`}>
        <div className="homeDashboard">
          <div className="logo">
            <img src={logo} alt="logo" width="100" height="100" style={{ objectFit: 'cover', borderRadius:'50%' }} />
            <span className="version">v {packageJson.version}</span>
          </div>
          {dashArray.map((dashboardCategory, index) => (
            <div className="listDiv" key={index}>
              <p>{Object.keys(dashboardCategory)}</p>
              <ul className="dashUl">
                {dashboardCategory[Object.keys(dashboardCategory)[0]].map((item, subIndex) => (
                  <li
                    className={location.pathname === item.path ? 'active' : ''}
                    key={subIndex}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <span className={item.icon}></span>
                    {item.dashName}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="listDiv">
            <p>General Settings</p>
            <ul className="dashUl">
              <li className="btnLogOut" onClick={logOut}>
                <span className="bi bi-box-arrow-right"></span>Log Out
              </li>
            </ul>
          </div>
        </div>
        <div className="compDiv">
          <div className="homeNav">
            <span onClick={handleToggleDrawer} className="bi bi-list"></span>
          </div>
          <div className="loadComp">{children}</div>
        </div>
      </div>
    </div>
  );
}
