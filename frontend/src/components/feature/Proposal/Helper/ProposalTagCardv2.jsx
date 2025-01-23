import { useEffect, useState } from "react";

const ProposalTagCardv2 = () => {

    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
            setIsDragging(true);
            setStartPosition({
              x: e.clientX - scrollPosition.x,
              y: e.clientY - scrollPosition.y,
            });
            e.preventDefault(); // Prevent text selection and other default actions
          };
        
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        const moveX = e.clientX - startPosition.x;
        const moveY = e.clientY - startPosition.y;
        
        // Update the scroll position based on the mouse movement
        setScrollPosition({ x: moveX, y: moveY });
        
        // Update the scroll position of the container
        const container = document.querySelector('.proposal-tag-cards');
        container.scrollLeft = -moveX;
        container.scrollTop = -moveY;
    };
    
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    
    // Clean up event listeners when the component is unmounted
    useEffect(() => {
        const container = document.querySelector('.proposal-tag-cards');
        
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseup', handleMouseUp);
        container.addEventListener('mouseleave', handleMouseUp);
        
        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('mouseleave', handleMouseUp);
        };
    }, [isDragging, startPosition, scrollPosition]);

    const data = [
        {
            freq: 'Annual',
            digit: 1,
            services: [
                {
                    name: 'Parking garage: L4',
                    ppc: 2292.02,
                    months: ['Aug']
                }
            ]
        },
        {
            freq: 'Bi-Annual',
            digit: 2,
            services: [
                {
                    name: 'Parking Garage: L2 - L3',
                    ppc: 4.217,
                    months: ['Aug', 'Feb']
                },
                {
                    name: 'Leasing Office Sidewalks',
                    ppc: 242.78,
                    months: ['May', 'Feb']
                }
            ]
        },
        {
            freq: 'Quarterly',
            digit: 4,
            services: [
                {
                    name: 'Parking Garage: LI/Retail Floor',
                    ppc: 2292.02,
                    months: ['Feb', 'May', 'Aug']
                },
                {
                    name: 'Trash Room Floors & Walls',
                    ppc: 607.42,
                    months: ['Aug', 'Jun', 'Mar']
                },
                {
                    name: 'Leasin Office Sidewalks',
                    ppc: 242.78,
                    months: ['Dec', 'Feb', 'Sept']
                },
            ]
        },
    ]

    const Cards = ({ index, cardData }) => {

        // Dynamically assign the card background class (1, 2, 3)
        const bgThemeCardClass = `bg-theme-${(index % 3) + 1}`;
        // Dynamically assign the circle background class (4, 5, 6)
        const bgThemeCircleClass = `bg-theme-${(index % 3) + 4}`;
    
        return (
            <div className={`tag-card-v2 ${bgThemeCardClass}`}>
                <div>
                    <div className="header">
                        <div className={`freq ${bgThemeCircleClass}`}>
                            <h4 className="font-2 font-size-24">
                                {cardData.digit}<i className="fa-solid fa-xs fa-xmark" style={{ color: "#fff" }} />
                            </h4>
                        </div>
                        <h4 className="font-2">{cardData.freq} Service</h4>
                    </div>
                    <div className="body">
                        <ul style={{ color: '#fff' }}>
                            {cardData.services.map((service, serviceIndex) => (
                                <li key={serviceIndex}>
                                    <h4 className="font-2 mb-3">{service.name}</h4>
                                    <div className="meta">
                                        <p className="font-3 text-light">- &nbsp; ${service.ppc.toFixed(2)} per clean</p>
                                        <div className="months">
                                            {service.months.map((month, monthIndex) => (
                                                <div key={monthIndex} className={`box ${bgThemeCircleClass}`}>
                                                    <p className="font-3 text-light">{month}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="divider"></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <button>Combined SQFT = 28,650.00</button>
            </div>
        );
    }


  return (
    <>
        <div
            className={`proposal-tag-cards ${isDragging ? 'grabbing' : ''}`}
            onMouseDown={handleMouseDown}        
        >
            {
                data?.map((value, index) => {
                    return (
                        <Cards index={index} cardData={value} />
                    )
                })
            }
        </div>
    </>
  )
}

export default ProposalTagCardv2