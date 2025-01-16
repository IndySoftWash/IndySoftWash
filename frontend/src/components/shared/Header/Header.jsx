import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { handleSidebar } from "../../../redux/AdminDataSlice";
import { ToastContainer } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [previousRoute, setPreviousRoute] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  
  const manageSidebar = useSelector((state) => state.AdminDataSlice.manageSidebar);
  const adminProfile = useSelector((state) => state.AdminDataSlice.admin);
  
  const togglePanel = () => {
    setIsPanelOpen((prev) => !prev);
  };

  // Track previous route on location change
  useEffect(() => {
    const unlisten = () => {
      // Save the current path before the route changes
      setPreviousRoute(location.pathname);
    };

    return () => unlisten();
  }, [location]);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (manageSidebar) {
      document.getElementById("cs-sidebar").classList.add("show-sidebar");
      setIsOpen(true);
    } else {
      document.getElementById("cs-sidebar").classList.remove("show-sidebar");
      setIsOpen(false);
    }
  }, [manageSidebar]);

  const breadCrumbConverter = {
    "/": "Dashboard",
    "/customer-list": "<< Customer List",
    "/customer-detail": "<< Customer List",
    "/proposal": "<< Proposal",
    "/add-proposal": "<< Add Proposal",
    "/proposal-detail": "<< Proposal",
    "/services": "<< Services",
    "/add-service": "<< Add Service",
  };

  return (
    <>
      <header className="background-white">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="main-header">
                {/* Go Back Button */}
                <button
                  className="text-decoration-none btn desk-show"
                  onClick={() => previousRoute && navigate(previousRoute)} // Navigate to the previous route
                >
                  <h4 className="font-1"><i class="fa-solid fa-chevrons-left"></i> Back</h4>
                </button>
                <div className="mob-head-flex">
                {/* Sidebar Toggle */}
                {isOpen ? (
                  <button
                    onClick={() => {
                      dispatch(handleSidebar(false));
                    }}
                    className="btn mob-show"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      dispatch(handleSidebar(true));
                    }}
                    className="btn mob-show"
                  >
                    <i className="fa-regular fa-lg fa-bars" />
                  </button>
                )}

                {/* Profile and Notifications */}
                <div className="head-section">
                  {/* <div className="bell">
                    <button
                      className={`btn ${window.innerWidth > 767 ? "" : "btn-sm"}`}
                    >
                      <img src="/assets/img/bell.svg" alt="" />
                    </button>
                  </div> */}
                  <div style={{ position: "relative" }}>
                    {/* Profile Button */}
                    <button
                      className={`btn ${window.innerWidth > 767 ? "" : "btn-sm"}`}
                      onClick={togglePanel}
                    >
                      <div className="profile-btn">
                        <div className="profile">
                          <img src={adminProfile?.profileImage?.s3Url} alt="" />
                        </div>
                        <div className="name mob-hide">
                          <h5>{adminProfile?.firstName} {adminProfile?.lastName}</h5>
                          <small>Admin</small>
                        </div>
                        <div className="arrow mob-hide">
                          <img src="/assets/img/head-arrow.svg" alt="" />
                        </div>
                      </div>
                    </button>

                    {/* Panel */}
                    {isPanelOpen && (
                      <div
                        className="header-panel"
                      >
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                          <li style={{ padding: "5px 0", borderBottom: "1px solid #ddd" }}>
                            <NavLink className='btn' to="/profile">View Profile</NavLink>
                          </li>
                          <li style={{ padding: "5px 0", borderBottom: "1px solid #ddd" }}>
                            <NavLink className='btn' to="/setting">Settings</NavLink>
                          </li>
                          <li style={{ padding: "5px 0" }}>
                            <NavLink className='btn' to="/logout">Logout</NavLink>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <ToastContainer />
    </>
  );
};

export default Header;
