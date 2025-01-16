import ActiveOverview from '../../components/feature/ActiveOverview/ActiveOverview'
import Logout from '../../components/feature/Auth/Logout'
import AddCustomer from '../../components/feature/Customer/AddCustomer'
import CustomerDetail from '../../components/feature/Customer/CustomerDetail'
import CustomerList from '../../components/feature/Customer/CustomerList'
import Dashboard from'../../components/feature/Dashboard/Dashboard'
import Profile from '../../components/feature/Profile/Profile'
import AddProposal from '../../components/feature/Proposal/AddProposal'
import Proposal from '../../components/feature/Proposal/Proposal'
import ProposalDetail from '../../components/feature/Proposal/ProposalDetail'
import Schedule from '../../components/feature/Schedule/Schedule'
import AddService from '../../components/feature/Service/AddService'
import ServiceDetail from '../../components/feature/Service/ServiceDetail'
import ServiceList from '../../components/feature/Service/ServiceList'
import Setting from '../../components/feature/Settings/Setting'
import DownloadAgreement from '../../components/shared/Agreement/DownloadAgreement'

const rootRoutes = [
    {
        path : '',
        element : <Dashboard />
    },
    {
        path : 'logout',
        element : <Logout />
    },
    {
        path : 'schedule',
        element : <Schedule />
    },
    {
        path : 'customer-list',
        element : <CustomerList />
    },
    {
        path : 'add-customer',
        element : <AddCustomer />
    },
    {
        path : 'add-customer/:customerid',
        element : <AddCustomer />
    },
    {
        path : 'customer-detail/:id',
        element : <CustomerDetail />
    },
    {
        path : 'proposal',
        element : <Proposal />
    },
    {
        path : 'active-overview',
        element : <ActiveOverview />
    },
    {
        path : 'add-proposal',
        element : <AddProposal />
    },
    {
        path : 'add-proposal/:customerId/:propertyId',
        element : <AddProposal />
    },
    {
        path : 'proposal-detail/:proposalid',
        element : <ProposalDetail />
    },
    {
        path : 'service-detail/:proposalid',
        element : <ServiceDetail />
    },
    {
        path : 'add-service',
        element : <AddService />
    },
    {
        path : 'add-service/:serviceid/:role',
        element : <AddService />
    },
    {
        path : 'services',
        element : <ServiceList />
    },
    {
        path : 'setting',
        element : <Setting />
    },
    {
        path : 'profile',
        element : <Profile />
    },
    {
        path : 'test',
        element : <DownloadAgreement />
    },
]

export default rootRoutes