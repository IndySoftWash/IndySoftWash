import { NavLink } from "react-router-dom"
import DataTable from "./Helper/DataTable"
import { useState } from "react"
import DeleteCustomServiceModal from "./Helper/DeleteCustomServiceModal"

const ServiceList = () => {

    const [selectedService, setSelectedService] = useState({})

    const onDelete = (service) => {
        setSelectedService(service)
    }

  return (
    <>
        <section>
            <div className="container py-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="head-filters">
                            <div className="part-1">
                                <h4 className="font-1 fw-700">Custom Services</h4>
                            </div>
                            <div className="part-1 gtc-1">
                                <NavLink to='/add-service' className="filter-btn txt-deco-none bg-theme-1"><i class="fa-light fa-lg fa-circle-plus" style={{ color: "#ffffff" }} /> &nbsp; Create New Service</NavLink>
                            </div>
                        </div>

                        <div className="pt-4">
                            <DataTable onDelete={onDelete} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <DeleteCustomServiceModal serviceid={selectedService} />
    </>
  )
}

export default ServiceList