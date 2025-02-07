import { useRef, useState } from "react";
import Spinner from "../../../shared/Loader/Spinner";
import { updateServiceImage } from "../../../../services/ServicesService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { handleUpdateServiceImage } from "../../../../redux/ServiceDataSlice";

const AddServiceImage = ({serviceId, serviceImg}) => {


    const closeModal = useRef(null)
    const dispatch = useDispatch()

    const [image, setImage] = useState([]);
    const [loading, setLoading] = useState(false);


    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files); // Get all selected files
        const newImageFiles = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file), // Generate a preview URL for the image
        }));
        setImage((prevImages) => [...prevImages, ...newImageFiles]); // Add to existing images
    };

    const handleRemoveImage = (index) => {
        setImage((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleSave = async() => {
        setLoading(true)
        const formData = new FormData();
        formData.append('serviceId', serviceId);
        
        // Loop through each image and append the actual file
        image.forEach((img, index) => {
            formData.append('images', img.file);
        });

        const response = await updateServiceImage(formData)
        if(response.success){
            setImage([])
            dispatch(handleUpdateServiceImage({serviceId, images: response.data}))
            setLoading(false)
            toast.success("Image added successfully")
            closeModal.current?.click()

        }

    }


  return (
    <>

        <div
        className="modal fade"
        id="add-service-image"
        data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true"
        >

            <div className="modal-dialog width-800 modal-dialog-centered">
                <div className="modal-content box-cs">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Add Service Image
                        </h1>
                    </div>
                    <div className="modal-body">
                        <div className="input-section grid-cs gtc-3 cs-align-end">
                            {
                                serviceId && serviceImg?.length > 0 ?
                                serviceImg?.map((img, index) => (
                                    <div key={index} className="upload-box">
                                        <img src={img.s3Url} alt="Service Image" />
                                    </div>
                                )) : image?.length > 0 ? 
                                    image?.map((image, index) => (
                                        <div
                                        className="upload-box"
                                        
                                        >
                                            <div onClick={() => document.getElementById('file-upload').click()} className="image-preview-container">
                                                <div key={index} className="image-preview">
                                                    <img src={image.preview} alt="Uploaded" />
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
                                    )) : (
                                        <>
                                            <div
                                            className="upload-box"
                                            onClick={() => document.getElementById('file-upload').click()}
                                            >
                                                <img
                                                    src="/assets/img/camera.svg"
                                                    alt="Camera Icon"
                                                    className="camera-icon"
                                                />
                                                <p>Upload Photos</p>
                                            </div>
                                        </>
                                )
                            }
                        </div>
                        <input
                        id="file-upload"

                                            type="file"
                                            accept="image/*"
                                            multiple // Allow selecting multiple files
                                            onChange={handleImageUpload}
                                            className="file-input"
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" ref={closeModal} className="filter-btn bg-theme-7" data-bs-dismiss="modal">Close</button>
                        <button onClick={handleSave} type="button" className="filter-btn bg-theme-1">Save changes {loading && <Spinner />}</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}


export default AddServiceImage