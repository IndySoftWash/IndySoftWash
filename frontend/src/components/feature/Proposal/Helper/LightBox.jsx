import { useEffect, useState } from "react";

const LightBox = ({ closeLightbox, initialIndex, selectedServiceData }) => {

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    

    const showNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedServiceData.images.length);
      };
    
      const showPrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedServiceData.images.length) % selectedServiceData.images.length);
      };

      useEffect(()=>{
        setCurrentImageIndex(initialIndex)
      }, [initialIndex])

    return (
    <>
        <div className="lightbox-modal" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>X</button>
            <div className="lightbox-image-container">
              <img src={selectedServiceData.images[currentImageIndex]?.s3Url} alt="" className="lightbox-image" />
            </div>
            <button className="lightbox-nav left" onClick={showPrevImage}>
              <i className="fa-sharp-duotone fa-light fa-angles-left" />
            </button>
            <button className="lightbox-nav right" onClick={showNextImage}>
              <i className="fa-sharp-duotone fa-light fa-angles-right" />
            </button>
          </div>
        </div>
    </>
  )
}

export default LightBox