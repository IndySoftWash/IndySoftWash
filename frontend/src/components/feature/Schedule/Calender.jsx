import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const localizer = momentLocalizer(moment);

const ProposalCalendar = () => {
  const [events, setEvents] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, content: "", position: { x: 0, y: 0 } });
  const rawServiceData = useSelector((state) => state.ServiceDataSlice.services);
  const navigate = useNavigate();

  // Create a set to keep track of event keys to avoid duplicates
  const eventKeys = new Set();

  // Helper function to generate a unique event key
  const generateEventKey = (event) => {
    return `${event.title}-${event.start.toISOString()}-${event.end.toISOString()}`;
  };

  // Fetch US National Holidays from Google Calendar API
  useEffect(() => {
    fetch(
      "https://www.googleapis.com/calendar/v3/calendars/en.usa%23holiday%40group.v.calendar.google.com/events?key=AIzaSyDBDjtR1sU_YqDjG5Doy59NUhkRJrmLUKY"
    )
      .then((response) => response.json())
      .then((data) => {
        const holidayEvents = data.items?.map((holiday) => {
          const event = {
            title: holiday.summary + " (Holiday)",
            start: moment.tz(holiday.start.date, "America/New_York").toDate(),
            end: moment.tz(holiday.start.date, "America/New_York").toDate(),
            allDay: true,
            isHoliday: true,
          };
          return event;
        });

        // Filter out duplicate holiday events before setting state
        const newHolidayEvents = holidayEvents.filter((event) => {
          const key = generateEventKey(event);
          if (!eventKeys.has(key)) {
            eventKeys.add(key);
            return true;
          }
          return false;
        });

        // Update state with unique holiday events
        setEvents((prevEvents) => [...prevEvents, ...newHolidayEvents]);
      });
  }, []);

  // New function to create events from services
  const createServiceEvents = () => {
    const serviceEvents = rawServiceData.flatMap((service) => {
      const sortedMonths = [...service.months].sort((a, b) => {
        const monthOrder = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        return monthOrder.indexOf(a) - monthOrder.indexOf(b);
      });
      console.log(sortedMonths)

      const timing = service.workOrder?.timing;
      const serviceMonth = timing?.startDate
        ? moment.tz(timing.startDate, "America/New_York").format("MMMM")
        : null;

      if (serviceMonth && sortedMonths.includes(serviceMonth)) {
        const event = {
          title: service.name,
          start: moment.tz(timing.startDate, "America/New_York").toDate(),
          end: moment.tz(timing.endDate, "America/New_York").toDate(),
          allDay: true,
          isHoliday: false,
          link: `/work-order/${service.uniqueid}/${'view'}`
        };
        console.log('eventKey',event)

        // Generate a unique key for the event and check for duplicates
        const eventKey = generateEventKey(event);
        if (!eventKeys.has(eventKey)) {
          eventKeys.add(eventKey);
          return event;
        }
      }
      return null;
    }).filter((event) => event !== null);
    console.log(serviceEvents)
    // Update state with unique service events
    setEvents((prevEvents) => [...prevEvents, ...serviceEvents]);
  };

  useEffect(() => {
    createServiceEvents(); // Call the function to create service events
  }, [rawServiceData]);

  // Custom styling for events with mouse event handlers
  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: event.isHoliday ? "#ff6b6b" : "#4CAF50",
      color: "#fff",
      borderRadius: "10px",
      padding: "5px",
      border: "none",
      textAlign: "center",
    };

    return {
      style: style,
    };
  };


  const handleEventClick = (event) => {
    navigate(event.link);
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="box-cs">
              {/* <h3 className="text-center mb-4">Proposal & Holiday Calendar</h3> */}
              <div style={{ height: "600px", position: "relative" }}>
                <Calendar
                  localizer={localizer}
                  events={events} // Ensure this is the correct events array
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600 }}
                  eventPropGetter={eventStyleGetter} // Apply custom styles
                  onSelectEvent={(event) => handleEventClick(event)} // Placeholder for event selection
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProposalCalendar;
