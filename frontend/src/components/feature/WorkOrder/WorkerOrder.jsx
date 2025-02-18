import React, { useRef, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../shared/Loader/Spinner';
import { toast } from 'react-toastify';
import { addWorkOrder, updateWorkOrder } from '../../../services/WorkOrderService';
import { handleCreateWorkOrder, handleUpdateWorkOrder } from '../../../redux/ServiceDataSlice';

const WorkerOrder = () => {

    const navigate = useNavigate();
    const fileInputRef = useRef({});
    const params = useParams();
    const { id, action } = params;
    const dispatch = useDispatch();


    const rawServiceData = useSelector(state => state.ServiceDataSlice.services);
    const rawEmployeeData = useSelector(state => state.EmployeeDataSlice.employees);
    const rawCustomerData = useSelector(state => state.AdminDataSlice.customers);
    const rawProposalData = useSelector(state => state.ServiceDataSlice.proposal);

    const [image, setImage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [removeImage, setRemoveImage] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [proposalId, setProposalId] = useState('');

    const workOrderForm = useFormik({
        initialValues: {
            name: '',
            workOrder: '',
            description: '',
            serviceAddress: '',
            checkList: [],
            startDate: '',
            endDate: '',
            createDate: new Date(),
            assignTo: '',
            instructions: '',
            images: [],
        },
        onSubmit: async (values) => {
            const formData = new FormData();
            setLoading(true);
            try {
                if (new Date(values.startDate) >= new Date(values.endDate)) {
                    toast.error('Start date must be before end date.');
                    setLoading(false);
                    return;
                }
                formData.append('workOrder', JSON.stringify(values));
                image?.length > 0 && image?.forEach((img) => {
                    formData.append('images', img.file);
                });

                if(removeImage?.length > 0) {
                    formData.append('removedImages', JSON.stringify(removeImage));
                }

                const dataObject = {
                    formData,
                    id
                }   
                if(action === 'edit') {
                    const response = await updateWorkOrder(dataObject);
                    if(response.success) {
                        dispatch(handleUpdateWorkOrder({id, result: response.result}));
                        toast.success('Work order updated successfully');
                        navigate(`/proposal-detail/${proposalId}/${"workorder"}`);
                    }
                } else {
                    const response = await addWorkOrder(dataObject);
                    if(response.success) {
                        dispatch(handleCreateWorkOrder({id, result: response.result}));
                        toast.success('Work order created successfully');
                        navigate(`/proposal-detail/${proposalId}/${"workorder"}`);
                    }
                }
                
            } catch (error) {
                toast.error('Error submitting form:', error);
                console.error('Error submitting form:', error);
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (rawEmployeeData?.length > 0) {
            setEmployee(rawEmployeeData);
        }
    }, [rawEmployeeData]);

    useEffect(() => {
        if (id) {
            const service = rawServiceData.find(value => value.uniqueid === id);
            if(action === 'view' || action === 'edit') {
                if (service) {
                    const { proposal } = service;
                    const proposalData = rawProposalData.find(value => value.uniqueid === proposal);
                    setProposalId(proposalData.uniqueid);
                    const { workOrder } = service
                    workOrderForm.setValues({
                        name: workOrder.name,
                        workOrder: workOrder.workOrder,
                        description: workOrder.description,
                        serviceAddress: workOrder.serviceAddress,
                        checkList: workOrder.checkList,
                        startDate: new Date(workOrder.timing.startDate).toISOString()?.slice(0, 16),
                        endDate: new Date(workOrder.timing.endDate).toISOString()?.slice(0, 16),
                        createDate: workOrder.createDate?.split('T')[0],
                        assignTo: workOrder.assign,
                        instructions: workOrder.instruction,
                        images: workOrder.images,
                    });
                }
            } else {
                if (service) {
                    const { proposal, customer, property } = service;
                    const proposalData = rawProposalData.find(value => value.uniqueid === proposal);
                    const customerData = rawCustomerData.find(value => value.uniqueid === customer);
                    const propertyData = customerData?.property.find(value => value.uniqueid === property);
                    setProposalId(proposalData.uniqueid);
                    workOrderForm.setValues({   
                        name: service.name,
                        description: service.description,
                        serviceAddress: propertyData?.serviceAddress,
                    });
                }
            }
        }
    }, [id, action]);

    const handleRemoveImage = ( index) => {
        // Remove from the image state
        setImage(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            <section>
                <div className="container py-4">
                    <form onSubmit={workOrderForm.handleSubmit}>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="head-filters">
                                    <div className="part-1 gtc-1 gap-0">
                                        <h4 className="font-1 fw-700">Schedule Word Order</h4>
                                        <p className="font-1 fw-400 font-size-16">Add your work order details</p>
                                    </div>
                                    <div className="part-1 gtc-equal mob">
                                        {
                                            action && (action === 'view') && (
                                                <NavLink
                                                    to={`/work-order/${id}/${"edit"}`}
                                                    type="button"
                                                    className="filter-btn txt-deco-none bg-theme-7"
                                                >
                                                    <i
                                                        className="fa-regular fa-pen-to-square fa-lg"
                                                        style={{ color: "#ffffff" }}
                                                    />{" "}
                                                    &nbsp; Edit Work Order
                                                </NavLink>
                                            )
                                        }
                                        <button
                                            type="submit"
                                            className={`filter-btn txt-deco-none bg-theme-1 ${action === 'view' ? 'disabled' : ''}`}
                                            disabled={loading || action === 'view'}
                                        >
                                            {loading ? (
                                                <Spinner />
                                            ) : (
                                                <>
                                                    <i
                                                        className="fa-light fa-circle-check fa-lg"
                                                        style={{ color: "#ffffff" }}
                                                    /> 
                                                    &nbsp; Save Work Order
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <div className="box-cs">
                                        <div className="grid-cs gap-40">
                                            <div>
                                                <div className="header">
                                                    <h5 className="font-1 fw-700 font-size-16">
                                                        Job name*
                                                    </h5>
                                                </div>
                                                <div className="input-section gtc-1 my-2">
                                                    <input
                                                        disabled={action === 'view'}
                                                        className="input-disabled"
                                                        type="text"
                                                        name="name"
                                                        placeholder="Enter Service Name"
                                                        id="service-name"
                                                        value={workOrderForm.values.name}
                                                        onChange={workOrderForm.handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="header">
                                                    <h5 className="font-1 fw-700 font-size-16">
                                                        Word Order*
                                                    </h5>
                                                </div>
                                                <div className="input-section gtc-1 my-2">
                                                    <input
                                                        type="text"
                                                        name="workOrder"
                                                        disabled={action === 'view'}
                                                        className="width-max input-disabled"
                                                        placeholder="Word Order*"
                                                        id="service-name"
                                                        value={workOrderForm.values.workOrder}
                                                        onChange={workOrderForm.handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid-cs pt-4 gap-40">
                                            <div>
                                                <div className="header">
                                                    <h5 className="font-1 fw-700 font-size-16">
                                                        Service Overview*
                                                    </h5>
                                                </div>
                                                <div className="input-section gtc-1 my-2">
                                                    <textarea
                                                        disabled={action === 'view'}
                                                        className="input-disabled"
                                                        type="text"
                                                        rows={3}
                                                        name="description"
                                                        placeholder="Enter Service Overview"
                                                        id="service-name"
                                                        value={workOrderForm.values.description}
                                                        onChange={workOrderForm.handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="header">
                                                    <h5 className="font-1 fw-700 font-size-16">
                                                        Service Address*
                                                    </h5>
                                                </div>
                                                <div className="input-section gtc-1 my-2">
                                                    <input
                                                        disabled={action === 'view'}
                                                        className="input-disabled width-50"
                                                        type="text"
                                                        name="serviceAddress"
                                                        placeholder="Enter Service Address"
                                                        id="service-name"
                                                        value={workOrderForm.values.serviceAddress}
                                                        onChange={workOrderForm.handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid-cs pt-4 gap-40">
                                            <div>
                                                <div className="header">
                                                    <h5 className="font-1 fw-700 font-size-16">
                                                        Checklist
                                                    </h5>
                                                </div>
                                                <div className="input-section gtc-equal my-2">
                                                    <input type="text" disabled={action === 'view'} className={`${action === 'view' ? 'input-disabled' : ''}`} />
                                                    <input type="text" disabled={action === 'view'} className={`${action === 'view' ? 'input-disabled' : ''}`} />
                                                    <input type="text" disabled={action === 'view'} className={`${action === 'view' ? 'input-disabled' : ''}`} />
                                                    <input type="text" disabled={action === 'view'} className={`${action === 'view' ? 'input-disabled' : ''}`} />
                                                    <input type="text" disabled={action === 'view'} className={`${action === 'view' ? 'input-disabled' : ''}`} />
                                                    <input type="text" disabled={action === 'view'} className={`${action === 'view' ? 'input-disabled' : ''}`} />
                                                    <input type="text" disabled={action === 'view'} className={`${action === 'view' ? 'input-disabled' : ''}`} />
                                                    <input type="text" disabled={action === 'view'} className={`${action === 'view' ? 'input-disabled' : ''}`} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="my-3">
                                                    <div className="header">
                                                        <h5 className="font-1 fw-700 font-size-16">
                                                            Schedule Work Order
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="my-3">
                                                    <div className="header">
                                                        <h5 className="font-1 fw-400 font-size-16">
                                                            Start Date/Time
                                                        </h5>
                                                    </div>
                                                    <div className="input-section gtc-1 my-2">
                                                        <input
                                                            type="datetime-local"
                                                            name="startDate"
                                                            className={`width-50 ${action === 'view' ? 'input-disabled' : ''}`}
                                                            placeholder="Enter Service Address"
                                                            id="service-name"
                                                            value={workOrderForm.values.startDate}
                                                            onChange={workOrderForm.handleChange}
                                                            disabled={action === 'view'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="my-3">
                                                    <div className="header">
                                                        <h5 className="font-1 fw-400 font-size-16">
                                                            End Date/Time
                                                        </h5>
                                                    </div>
                                                    <div className="input-section gtc-1 my-2">
                                                        <input
                                                            type="datetime-local"
                                                            name="endDate"
                                                            className={`width-50 ${action === 'view' ? 'input-disabled' : ''}`}
                                                            placeholder="Enter Service Address"
                                                            id="service-name"
                                                            value={workOrderForm.values.endDate}
                                                            onChange={workOrderForm.handleChange}
                                                            disabled={action === 'view'}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid-cs pt-4 gap-40">
                                            <div>
                                                <div className="header">
                                                    <h5 className="font-1 fw-700 font-size-16">
                                                        Date Issued* <span className="font-3">(for reference)</span>
                                                    </h5>
                                                </div>
                                                <div className="input-section gtc-1 my-2">
                                                    <input
                                                        type="date"
                                                        className={`width-50 ${action === 'view' ? 'input-disabled' : ''}`}
                                                        name="createDate"
                                                        placeholder="Enter Service Overview"
                                                        id="service-name"
                                                        value={workOrderForm.values.createDate}
                                                        onChange={workOrderForm.handleChange}
                                                        disabled={action === 'view'}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="header">
                                                    <h5 className="font-1 fw-700 font-size-16">
                                                        Assign To*
                                                    </h5>
                                                </div>
                                                <div className="input-section gtc-1 my-2">
                                                    <select
                                                        type="text"
                                                        name="assignTo"
                                                        className={`width-50 ${action === 'view' ? 'input-disabled' : ''}`}
                                                        placeholder="Enter Service Address"
                                                        id="service-name"
                                                        value={workOrderForm.values.assignTo}
                                                        onChange={workOrderForm.handleChange}
                                                        disabled={action === 'view'}
                                                    >
                                                        <option value="">Select Employees</option>
                                                        {employee?.map((emp) => (
                                                            <option key={emp.uniqueid} value={emp.uniqueid}>{emp.firstName} {emp.lastName}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid-cs pt-4 gap-40">
                                            <div>
                                                <div className="header flex-column align-items-start gap-0">
                                                    <h5 className="font-1 fw-700 font-size-16">
                                                        Instructions*
                                                    </h5>
                                                    <p className="font-1 fw-400 font-size-16">
                                                    Some remarks or notes for employees.
                                                    </p>
                                                </div>
                                                <div className="input-section gtc-1 my-2">
                                                    <textarea
                                                        type="text"
                                                        rows={3}
                                                        className={`${action === 'view' ? 'input-disabled' : ''}`}
                                                        name="instructions"
                                                        placeholder="Enter Instructions"
                                                        value={workOrderForm.values.instructions}
                                                        onChange={workOrderForm.handleChange}
                                                        disabled={action === 'view'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="grid-cs gtc-1 pt-4 gap-40">
                                            <div>
                                                <div className="header flex-column align-items-start gap-0">
                                                    <h5 className="font-1 fw-700 font-size-16">
                                                        Attachments
                                                    </h5>
                                                    <p className="font-1 fw-400 font-size-16">
                                                        Optionally attach file to this work order. Allowed type: pdf, doc, docx, png, jpg, gif.
                                                    </p>
                                                </div>
                                                <div className="pt-4 grid-cs gtc-4">
                                                {workOrderForm.values.images?.map((img, index) => (
                                                    <div key={`local-${index}`} className={`upload-box ${removeImage.includes(img.s3Key) ? 'removed' : ''}`}>
                                                        <div className="image-preview-container">
                                                            <div className="image-preview">
                                                                <img src={img.s3Url} alt="Uploaded" />
                                                            </div>
                                                        </div>
                                                        {!removeImage.includes(img.s3Key) ? (
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm cs-absolute"
                                                                onClick={() => setRemoveImage(prev => [...prev, img.s3Key])}
                                                                disabled={action === 'view'}
                                                            >
                                                                Remove
                                                            </button>
                                                            ) : (
                                                            <button
                                                                type="button"
                                                                className="btn btn-success btn-sm cs-absolute"
                                                                onClick={() => setRemoveImage(prev => prev.filter(id => id !== img.s3Key))}
                                                            >
                                                                Recover
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                {image?.map((img, index) => (
                                                    <div key={`local-${index}`} className="upload-box">
                                                        <div className="image-preview-container">
                                                            <div className="image-preview">
                                                                <img src={img.preview} alt="Uploaded" />
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm cs-absolute"
                                                            onClick={() => handleRemoveImage(index)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}

                                                <button
                                                    type="button"
                                                    className={`filter-btn bg-theme-2 width-50 ${action === 'view' ? 'disabled' : ''}`}
                                                    onClick={() => fileInputRef.current.click()}
                                                    disabled={action === 'view'}
                                                >
                                                    <i
                                                        className="fa-regular fa-arrows-rotate-reverse fa-lg"
                                                        style={{ color: "#ffffff" }}
                                                    />{" "}
                                                    &nbsp; Upload
                                                </button>

                                                <input
                                                    id={`file-upload`}
                                                    type="file"
                                                    ref={fileInputRef}
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files).map(file => {
                                                            return {
                                                                file,
                                                                preview: URL.createObjectURL(file),
                                                                uniqueid: file.name
                                                            };
                                                        });
                                                        setImage(prev => [...prev, ...files]);
                                                        workOrderForm.setFieldValue('images', [...workOrderForm.values.images, ...files]);
                                                    }}
                                                    className="file-input"
                                                    style={{ display: 'none' }}
                                                />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}

export default WorkerOrder

