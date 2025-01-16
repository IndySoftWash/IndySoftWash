import Sidebar from '../components/shared/Sidebar/Sidebar';
import Header from '../components/shared/Header/Header';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCustomer } from '../services/CustomerService';
import { useDispatch } from 'react-redux';
import { handleGetAdmin, handleGetCustomer } from '../redux/AdminDataSlice';
import { getAdmin } from '../services/AdminService';
import { getServiceAndProposal } from '../services/ProposalService';
import { handleGetProposal, handleGetServices } from '../redux/ServiceDataSlice';

const AdminModule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // Loading state

  const fetchCustomers = async () => {
    const response = await getCustomer();
    if (response.success) {
      dispatch(handleGetCustomer(response.result));
    }
  };

  const fetchAdmin = async () => {
    const response = await getAdmin();
    if (response.success) {
      dispatch(handleGetAdmin(response.result));
    }
  };

  const fetchServiceAndProposal = async () => {
    const response = await getServiceAndProposal();
    if (response.success) {
      dispatch(handleGetServices(response.service));
      dispatch(handleGetProposal(response.proposal));
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('ddlj')) {
      navigate('/signin');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Show loader
      await Promise.all([fetchAdmin(), fetchCustomers(), fetchServiceAndProposal()]);
      setLoading(false); // Hide loader
    };

    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="loader-container-cs">
          <div className="loader-cs"></div>
        </div>
      ) : (
        <main className="the-main-grid">
          <Sidebar />
          <section className="the-content-sec">
            <Header />
            <Outlet />
          </section>
        </main>
      )}
    </>
  );
};

export default AdminModule;
