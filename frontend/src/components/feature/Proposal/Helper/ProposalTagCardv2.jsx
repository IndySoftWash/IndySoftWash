import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { handleToggleActivePlan } from "../../../../redux/ServiceDataSlice";
import { short_list_month } from '../../../../utils/frequencyDigitConverter'
import { getPerCleaningCost } from "../../../../utils/ArithematicCalculation";
import { toggleActivePlan } from "../../../../services/ServicesService";
import { mergeFrequencyArrays } from "../../../../utils/Extractor";

const ProposalTagCardv2 = ({ service, units, allServices }) => {

    const dispatch = useDispatch()

    const [frequencies, setFrequencies] = useState([])
    const [checkedIndex, setCheckedIndex] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
    const [totalSqfts, setTotalSqfts] = useState({});

    useEffect(()=>{
        if(service) {
            setFrequencies(mergeFrequencyArrays(allServices))
            setCheckedIndex(service?.activePlan)
            
        }
    }, [service])

    // Add this useEffect to calculate totals when frequencies or services change
    useEffect(() => {
        if (frequencies.length > 0) {
            const newTotalSqfts = frequencies.reduce((acc, frequency) => {
                const total = frequency.services?.reduce((sum, service) => {
                    return sum + (service?.sqft || 0);
                }, 0);
                return { ...acc, [frequency.name]: total };
            }, {});
            setTotalSqfts(newTotalSqfts);
            console.log(newTotalSqfts)
        }
    }, [frequencies, service, allServices]);

    const handleCheckboxChange = async(index, value) => {
        const dataObject = {
            frequency: value.name,
            service: service?.uniqueid
        }
   
        const response = await toggleActivePlan(dataObject)
        if(response.success) {
            dispatch(handleToggleActivePlan(dataObject))
        }
        // Update the checked index to the selected one, unchecking all others
        setCheckedIndex(value?.name === checkedIndex ? null : value?.name);
    };

    const handleMouseDown = (e) => {
        // Disable dragging when the mouse is on the checkbox
        if (e.target.closest('.form-check-input')) {
            return; // Do nothing if clicked on checkbox
        }
    
        setIsDragging(true);
        setStartPosition({
            x: e.clientX - scrollPosition.x,
            y: e.clientY - scrollPosition.y,
        });
        e.preventDefault(); // Prevent text selection and other default actions
    };
    
    const handleMouseMove = (e) => {
        if (!isDragging || e.target.closest('.form-check-input')) return;
    
        const moveX = e.clientX - startPosition.x;
        const moveY = e.clientY - startPosition.y;
    
        setScrollPosition({ x: moveX, y: moveY });
    
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



    const Cards = ({ index, cardData }) => {

        // console.log(cardData?.services)
        // const totalSqft = cardData?.services?.reduce((acc, service) => {
        //     return acc + (service?.sqft || 0);  // Accumulate sqft, default to 0 if not present
        // }, 0);        

        // Dynamically assign the card background class (1, 2, 3)
        const bgThemeCardClass = `bg-theme-${(index % 3) + 1}`;
        // Dynamically assign the circle background class (4, 5, 6)
        const bgThemeCircleClass = `bg-theme-${(index % 3) + 4}`;
    
        return (
            <div className={`tag-card-v2 ${bgThemeCardClass}`}>
                <div>
                    <div className="grid-cs gtc-3-1">
                        <div className="header">
                            <div className={`freq ${bgThemeCircleClass}`}>
                                <h4 className="font-2 font-size-24">
                                    {cardData.frequencyDigit}<i className="fa-solid fa-xs fa-xmark" style={{ color: "#fff" }} />
                                </h4>
                            </div>
                            <h4 className="font-2">{cardData.name} Service</h4>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className={`form-check-input ${bgThemeCircleClass}`}
                                type="checkbox"
                                role="switch"
                                id={`flexSwitchCheckDefault-${index}`}
                                checked={checkedIndex === cardData?.name}
                                onChange={() => handleCheckboxChange(index, cardData)}
                            />
                        </div>
                    </div>
                    <div className="body">
                        <ul style={{ color: '#fff' }}>
                            {cardData.services?.map((service, serviceIndex) => {
                                const price = service?.frequency?.filter(value => value.name === cardData.name)[0]?.price
                                const perCleaning = getPerCleaningCost(price, service?.sqft, service?.quantity);
                                return (
                                    <li key={serviceIndex}>
                                        <h4 className="font-2 mb-3">{service.name}</h4>
                                        <div className="meta">
                                            <p className="font-3 text-light">- &nbsp; ${perCleaning} per clean</p>
                                            <div className="months">
                                            {Array.isArray(service.months) && service.months.map((month, monthIndex) => (
                                                <div key={`month-${monthIndex}-${month}`} className={`box ${bgThemeCircleClass}`}>
                                                    <p className="font-3 text-light">
                                                        {short_list_month[month] || month}
                                                    </p>
                                                </div>
                                            ))}
                                            </div>
                                        </div>
                                        <div className="divider"></div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                <div className="flex-cs">
                    <button type="button">Combined SQFT = {totalSqfts[cardData.name] || 0}</button>
                </div>
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
                frequencies?.map((value, index) => {
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