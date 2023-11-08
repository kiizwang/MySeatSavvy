import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Banner from "../components/Banner.js";
import Hours from "../components/Hours.js";

const Intro = () => {
  const currentDate = new Date().toLocaleDateString("en-CA"); // format: 2023-11-05
  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }); // format: 14:24

  const [restaurants, setRestaurants] = useState([]);
  const [partyMaxSizeOptions, setPartyMaxSizeOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [reservationTimes, setReservationTimes] = useState([]);

  // Restaurant
  useEffect(() => {
    fetch("/restaurants") // with backend proxy in package.json
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setRestaurants(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    setSelectedDate(currentDate);
  }, []);

  // Party Size
  useEffect(() => {
    if (restaurants.length > 0) {
      const maxPartySize = restaurants[0].max_party_size;
      const options = Array.from({ length: maxPartySize }, (_, index) => ({
        value: index + 1,
        label: `${index + 1} ${index === 0 ? "Person" : "People"}`,
      }));
      setPartyMaxSizeOptions(options);
    }
  }, [restaurants]);

  // Date & Time
  useEffect(() => {
    if (restaurants.length > 0 && selectedDate) {
      const restaurant = restaurants[0];
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      // const date = new Date(selectedDate);
      const date = new Date(selectedDate + "T00:00:00Z");
      // const dayName = dayNames[date.getDay()];
      const dayName = dayNames[date.getUTCDay()];
      const dayInfo = restaurant.days.find((d) => d.day === dayName);

      if (dayInfo && dayInfo.status === "Open") {
        let times = [];

        for (let timeSlot of dayInfo.time_slots) {
          let startTime = timeSlot.start.split(":"); // split the start time into [hour, minute]
          let endTime = timeSlot.end.split(":"); // split the end time into [hour, minute]
          let currentDateObj = new Date();
          let startDateObj = new Date(
            currentDateObj.getFullYear(),
            currentDateObj.getMonth(),
            currentDateObj.getDate(),
            parseInt(startTime[0]),
            parseInt(startTime[1])
          );
          let endDateObj = new Date(
            currentDateObj.getFullYear(),
            currentDateObj.getMonth(),
            currentDateObj.getDate(),
            parseInt(endTime[0]),
            parseInt(endTime[1])
          );

          while (startDateObj < endDateObj) {
            // Format the time string as "HH:MM a.m./p.m."
            let timeString = startDateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
            console.log("timeString: " + timeString);

            // Only add times that are later than the current time if the selected date is today
            if (selectedDate === currentDate) {
              let currentTimeObj = new Date();
              if (startDateObj > currentTimeObj) {
                times.push(timeString);
              }
            } else {
              times.push(timeString);
            }

            // Increment the time by 30 minutes
            // startDateObj.setMinutes(startDateObj.getMinutes() + 30);
            // Increment the time by 1 hour
            startDateObj.setHours(startDateObj.getHours() + 1);
          }
        }
        setReservationTimes(times);
      } else {
        setReservationTimes([]);
      }
    }
  }, [restaurants, selectedDate, currentTime]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <main>
      <div className="main">
        <Banner />
        <div className="content">
          <section className="restaurant-info">
            <h1>{restaurants.length > 0 ? restaurants[0].name : "Loading..."}</h1>
            <div className="restaurant-info-wrapping">
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">restaurant</span>
                </div>
                <span>{restaurants.length > 0 ? restaurants[0].type : "Loading..."}</span>
              </div>
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">payments</span>
                </div>
                <span>{restaurants.length > 0 ? restaurants[0].payments : "Loading..."}</span>
              </div>
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">storefront</span>
                </div>
                <span>
                  {restaurants.length > 0 ? restaurants[0].address : "Loading..."} <a href="#">View Map</a>
                </span>
              </div>
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">call</span>
                </div>
                <span>
                  <a href="#">{restaurants.length > 0 ? restaurants[0].phone : "Loading..."}</a>
                </span>
              </div>
            </div>
          </section>

          <section className="restaurant-content">
            <div className="restaurant-content-wrapping">
              {restaurants.length > 0 ? (
                restaurants[0].description.map((desc, index) => <p key={index}>{desc}</p>)
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </section>

          <section className="restaurant-menu">
            <div className="restaurant-menu-wrapping">
              <h2>Menu</h2>
            </div>
          </section>
        </div>
        <div className="sidebar">
          <section className="reservation-info">
            <h2>Make A Reservation</h2>
            <div className="reservation-info-wrapping">
              <form action="" method="" className="reservation-form">
                <div>
                  <select id="party_size" className="form-select">
                    <option selected>Party Size</option>
                    {partyMaxSizeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <input
                    type="date"
                    id="reservation_date"
                    class="form-control"
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </div>
                <div>
                  <select
                    id="reservation_time"
                    className="form-select"
                    // value={selectedTime}
                    // onChange={handleTimeChange}
                    disabled={selectedDate < currentDate || reservationTimes.length === 0}
                  >
                    <option value="">Choose Time</option>
                    {reservationTimes.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="d-grid">
                  <input type="submit" value="Submit" className="btn btn-warning" />
                </div>
                <div>
                  When the time dropdown is greyed out, it means that it's either fully booked or the
                  restaurant is closed on that day. Please select other dates.
                </div>
              </form>
            </div>
          </section>
          <Hours restaurants={restaurants} />
        </div>
      </div>
    </main>
  );
}

export default Intro
