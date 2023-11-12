import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRestaurants } from "../store/restaurantsSlice.js";
import { fetchTables } from "../store/tablesSlice.js";
import moment from "moment";
import Banner from "../components/Banner.js";
import Hours from "../components/Hours.js";

const Intro = () => {
  const currentDate = moment().format("YYYY-MM-DD"); // format: 2023-11-05
  const currentTime = moment().format("HH:mm"); // format: 14:24

  // const [restaurants, setRestaurants] = useState([]); // no need because using Redux
  const [partyMaxSizeOptions, setPartyMaxSizeOptions] = useState([]);
  const [reservationTimesOptions, setReservationTimesOptions] = useState([]);
  const [selectedPartySize, setSelectedPartySize] = useState("");
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [selectedTime, setSelectedTime] = useState("");

  // Redux
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants.entities);
  const restaurantsStatus = useSelector((state) => state.restaurants.status);
  const restaurantsError = useSelector((state) => state.restaurants.error);
  const tables = useSelector((state) => state.tables.entities);
  const tablesStatus = useSelector((state) => state.tables.status);
  const tablesError = useSelector((state) => state.tables.error);

  useEffect(() => {
    if (restaurantsStatus === "idle") {
      dispatch(fetchRestaurants());
    }
  }, [restaurantsStatus, dispatch]);

  useEffect(() => {
    if (tablesStatus === "idle") {
      dispatch(fetchTables());
    }
  }, [tablesStatus, dispatch]);

  useEffect(() => {
    if (restaurants.length > 0 && tables.length > 0) {
      const targetRestaurantId = restaurants[0]._id;
      const restaurantTables = tables.filter((table) => table.restaurant_id?._id === targetRestaurantId);
      console.log(restaurantTables);
    }
  }, [restaurants, tables]);

  // useEffect(() => {
  //   fetch("/restaurants") // with backend proxy in package.json
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setRestaurants(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  //   setSelectedDate(currentDate);
  // }, []);

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

  // Date & Time version 1
  // useEffect(() => {
  //   if (restaurants.length > 0 && selectedDate) {
  //     const restaurant = restaurants[0];
  //     // const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  //     // const date = new Date(selectedDate);
  //     // const date = new Date(selectedDate + "T00:00:00Z");
  //     const date = moment(selectedDate);
  //     // const dayName = dayNames[date.getDay()];
  //     // const dayName = dayNames[date.getUTCDay()];
  //     const dayName = date.format("dddd");
  //     const dayInfo = restaurant.days.find((d) => d.day === dayName);

  //     if (dayInfo && dayInfo.status === "Open") {
  //       let times = [];

  //       for (let timeSlot of dayInfo.time_slots) {
  //         let startTime = timeSlot.start.split(":"); // split the start time into [hour, minute]
  //         let endTime = timeSlot.end.split(":"); // split the end time into [hour, minute]
  //         // let currentDateObj = new Date();
  //         // let startDateObj = new Date(
  //         //   currentDateObj.getFullYear(),
  //         //   currentDateObj.getMonth(),
  //         //   currentDateObj.getDate(),
  //         //   parseInt(startTime[0]),
  //         //   parseInt(startTime[1])
  //         // );
  //         // let endDateObj = new Date(
  //         //   currentDateObj.getFullYear(),
  //         //   currentDateObj.getMonth(),
  //         //   currentDateObj.getDate(),
  //         //   parseInt(endTime[0]),
  //         //   parseInt(endTime[1])
  //         // );
  //         let startDateObj = moment().set({ hour: parseInt(startTime[0]), minute: parseInt(startTime[1]) });
  //         let endDateObj = moment().set({ hour: parseInt(endTime[0]), minute: parseInt(endTime[1]) });

  //         while (startDateObj.isBefore(endDateObj)) {
  //           // Format the time string as "HH:MM a.m./p.m."
  //           // let timeString = startDateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  //           let timeString = startDateObj.format("hh:mm A");

  //           // Only add times that are later than the current time if the selected date is today
  //           if (selectedDate === currentDate) {
  //             let currentTimeObj = new Date();
  //             if (startDateObj > currentTimeObj) {
  //               times.push(timeString);
  //             }
  //           } else {
  //             times.push(timeString);
  //           }

  //           // Increment the time by 30 minutes
  //           // startDateObj.setMinutes(startDateObj.getMinutes() + 30);
  //           // Increment the time by 1 hour
  //           // startDateObj.setHours(startDateObj.getHours() + 1);
  //           startDateObj.add(1, "hours");
  //         }
  //       }
  //       setReservationTimesOptions(times);
  //     } else {
  //       setReservationTimesOptions([]);
  //     }
  //   }
  // }, [restaurants, selectedDate]);

  // Date & Time version 2
  useEffect(() => {
    if (restaurants.length > 0 && tables.length > 0 && selectedDate) {
      const date = moment(selectedDate);
      const dayName = date.format("dddd");
      const dayInfo = restaurants[0].days.find((d) => d.day === dayName);

      // 如果選定的日期餐廳是關門的，則不顯示任何時間選項
      if (!dayInfo || dayInfo.status === "Closed") {
        setReservationTimesOptions([]);
        return;
      }

      // 獲取該日期所有可用桌子
      //

      let times = [];
      for (let timeSlot of dayInfo.time_slots) {
        let startTime = moment(timeSlot.start, "HH:mm");
        let endTime = moment(timeSlot.end, "HH:mm");

        while (startTime.isBefore(endTime)) {
          times.push(startTime);
          startTime.add(1, "hours");
        }
      }
      console.log(times);

      // setReservationTimesOptions(times);
      // console.log(reservationTimesOptions);
    }
  }, [restaurants, tables, selectedDate, selectedPartySize]);

  const handlePartySizeChange = (e) => {
    setSelectedPartySize(e.target.value);
  };
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  return (
    <main>
      <div className="main">
        <Banner bannerImage={restaurants.length > 0 ? restaurants[0].banner_image : ""} />
        <div className="content">
          {/* Info */}
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
          {/* Description */}
          <section className="restaurant-content">
            <div className="restaurant-content-wrapping">
              {restaurants.length > 0 ? (
                restaurants[0].description.map((desc, index) => <p key={index}>{desc}</p>)
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </section>
          {/* Menu */}
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
                {/* Party Size */}
                <div>
                  <select
                    id="party_size"
                    className="form-select"
                    value={selectedPartySize}
                    onChange={handlePartySizeChange}
                  >
                    <option value="">Party Size</option>
                    {partyMaxSizeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Date */}
                <div className="input-group">
                  <input
                    type="date"
                    id="reservation_date"
                    className="form-control"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                {/* Time Slots */}
                <div>
                  <select
                    id="reservation_time"
                    className="form-select"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    disabled={selectedDate < currentDate || reservationTimesOptions.length === 0}
                  >
                    <option value="">Choose Time</option>
                    {reservationTimesOptions.map((time, index) => (
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
                  When the time dropdown is greyed out, it means that it's either fully booked or the restaurant is
                  closed on that day. Please select other dates.
                </div>
              </form>
            </div>
          </section>
          {/* Hours of Operation */}
          <Hours restaurants={restaurants} />
        </div>
      </div>
    </main>
  );
}

export default Intro
