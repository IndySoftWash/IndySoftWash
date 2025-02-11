import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const ProposalCalendar = () => {
  const [events, setEvents] = useState([]);

  // Fetch US National Holidays from Google Calendar API
    useEffect(() => {
        fetch(
            "https://www.googleapis.com/calendar/v3/calendars/en.usa%23holiday%40group.v.calendar.google.com/events?key=AIzaSyDBDjtR1sU_YqDjG5Doy59NUhkRJrmLUKY"
        )          
        .then((response) => response.json())
        .then((data) => {
            const holidayEvents = data.items?.map((holiday) => ({
            title: holiday.summary + " (Holiday)", // Append (Holiday) to indicate it's a national holiday
            start: new Date(holiday.start.date),
            end: new Date(holiday.start.date),
            allDay: true,
            isHoliday: true, // Custom flag to differentiate holidays
            }));
            setEvents(holidayEvents);
            console.log(holidayEvents);
        });
    }, []);

  // Custom styling for events
  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: event.isHoliday ? "#ff6b6b" : "#4CAF50", // Red for holidays, green for proposals
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

  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="box-cs">
              {/* <h3 className="text-center mb-4">Proposal & Holiday Calendar</h3> */}
              <div style={{ height: "600px" }}>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600 }}
                  eventPropGetter={eventStyleGetter} // Apply custom styles
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
