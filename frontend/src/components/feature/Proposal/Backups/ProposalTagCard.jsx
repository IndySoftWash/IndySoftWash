import { useEffect, useState } from "react"
import { toggleActivePlan } from "../../../../services/ServicesService";
import { useDispatch } from "react-redux";
import { handleToggleActivePlan } from "../../../../redux/ServiceDataSlice";
import { getPerCleaningCost } from "../../../../utils/ArithematicCalculation";

const ProposalTagCard = ({service, units}) => {

    const dispatch = useDispatch()

    const [frequencies, setFrequencies] = useState([])
    const [checkedIndex, setCheckedIndex] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

    useEffect(()=>{
        if(service) {
            setFrequencies(service?.frequency)
            setCheckedIndex(service?.activePlan)
            // console.log(service?.frequency)
        }
    }, [service])

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

  return (
    <>
        <div
            className={`proposal-tag-cards ${isDragging ? 'grabbing' : ''}`}
            onMouseDown={handleMouseDown}        
        >
        {
            frequencies?.map((value, index) => {
                const perCleaning = getPerCleaningCost(value.price, service?.sqft, service?.quantity);
                const unitPerMonth = ((perCleaning) * (value.frequencyDigit) / 12 / units).toFixed(2);

                // Dynamically assign the card background class (1, 2, 3)
                const bgThemeCardClass = `bg-theme-${(index % 3) + 1}`;
                // Dynamically assign the circle background class (4, 5, 6)
                const bgThemeCircleClass = `bg-theme-${(index % 3) + 4}`;

                return (
                    <div className={`tag-card ${bgThemeCardClass}`} key={index}>
                        <div className="inner-layout">
                            <div>
                                <h4>{value.name}</h4>
                                <h6>${value.price}/SQFT</h6>
                            </div>
                            <div className={`tag-circle ${bgThemeCircleClass}`}>
                                <h4>{value.frequencyDigit}<i class="fa-solid fa-xs fa-xmark" style={{color: "#fff"}} /></h4>
                            </div>
                        </div>
                        <div className="">
                            <div className="inner-layout">
                                <p>${perCleaning} per Cleaning</p>
                                <div className="form-check form-switch">
                                <input
                                    className={`form-check-input ${bgThemeCircleClass}`}
                                    type="checkbox"
                                    role="switch"
                                    id={`flexSwitchCheckDefault-${index}`}
                                    checked={checkedIndex === value?.name}
                                    onChange={() => handleCheckboxChange(index, value)}
                                />
                                </div>
                            </div>
                            <div className="inner-layout">
                                <h4>Per Door Investment</h4>
                                <p>${unitPerMonth}/Unit Per Month</p>
                            </div>
                        </div>
                    </div>
                );
            })
        }


            {/* <div className="tag-card bg-theme-1">
                <div className="inner-layout">
                    <div>
                    <h4 >Annual</h4>
                    <h6 >$0.09/SQFT</h6>
                    </div>
                    <div className="tag-circle bg-theme-4">
                    <h4>38</h4>
                    </div>
                </div>
                <div className="">
                    <div className="inner-layout">
                    <p>$2,438.04 per Cleaning</p>
                    <div className="form-check form-switch">
                        <input className="form-check-input cs-blue" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                    </div>
                    </div>
                    <div className="inner-layout">
                    <h4>Per Door Investment</h4>
                    <p>$0.74/Unit Per Month</p>
                    </div>
                </div>
            </div>

            <div className="tag-card bg-theme-2">
            <div className="inner-layout">
                <div>
                <h4 >Annual</h4>
                <h6 >$0.09/SQFT</h6>
                </div>
                <div className="tag-circle bg-theme-5">
                <h4>38</h4>
                </div>
            </div>
            <div className="">
                <div className="inner-layout">
                <p>$2,438.04 per Cleaning</p>
                <div className="form-check form-switch">
                    <input className="form-check-input cs-orange" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                </div>
                </div>
                <div className="inner-layout">
                <h4>Per Door Investment</h4>
                <p>$0.74/Unit Per Month</p>
                </div>
            </div>
            </div>

            <div className="tag-card bg-theme-3">
            <div className="inner-layout">
                <div>
                <h4 >Annual</h4>
                <h6 >$0.09/SQFT</h6>
                </div>
                <div className="tag-circle bg-theme-6">
                <h4>38</h4>
                </div>
            </div>
            <div className="">
                <div className="inner-layout">
                <p>$2,438.04 per Cleaning</p>
                <div className="form-check form-switch">
                    <input className="form-check-input cs-yellow" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                </div>
                </div>
                <div className="inner-layout">
                <h4>Per Door Investment</h4>
                <p>$0.74/Unit Per Month</p>
                </div>
            </div>
            </div> */}

        </div>
    </>
  )
}

export default ProposalTagCard