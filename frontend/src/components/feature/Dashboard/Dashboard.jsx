import { useState } from "react"
import DeleteCustomerModal from "../Customer/Helper/DeleteCustomerModal"
import Analytics from "./Analytics"
import DataTable from "./DataTable"
import Tags from "./Tags"
import TotalEarning from "./TotalEarning"
import { useSelector } from "react-redux"

const Dashboard = () => {

  const [selectedCustomer, setSelectedCustomer] = useState({})

  const rawCustomerData = useSelector(state => state.AdminDataSlice.customers)
  const rawProposalData = useSelector(state => state.ServiceDataSlice.proposal)
  const rawServiceData = useSelector(state => state.ServiceDataSlice.services)

  const onDelete = (customer) => {
    setSelectedCustomer(customer)
  }

  return (
    <>
      <section>
        <div className="container py-4">
          <div className="row">
            <div className="col-md-12">
              <Tags customerData={rawCustomerData} proposalData={rawProposalData} />

              <div className="analysis pt-4">
                <TotalEarning serviceData={rawServiceData} proposalData={rawProposalData} />
                <Analytics proposalData={rawProposalData} serviceData={rawServiceData} />
              </div>

              {/* <div className="pt-4">
                
              </div> */}
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="pt-4">
              <DataTable customerDetail={rawCustomerData} onDelete={onDelete} title={'Current Projects'} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <DeleteCustomerModal customerData={selectedCustomer} />
    </>
  )
}

export default Dashboard