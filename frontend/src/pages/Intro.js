import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRestaurants } from "../store/restaurantsSlice.js";
import { fetchTables } from "../store/tablesSlice.js";
import moment from "moment";
import Banner from "../components/Banner.js";
import Hours from "../components/Hours.js";

const Intro = () => {
  const tomorrow = moment().add(1, "days").format("YYYY-MM-DD"); // format: 2023-11-05

  // const [restaurants, setRestaurants] = useState([]); // no need because using "Redux"
  const [restaurantTables, setRestaurantTables] = useState([]); // Get this restaurant's tables
  const [partyMaxSizeOptions, setPartyMaxSizeOptions] = useState([]);
  const [reservationTimesOptions, setReservationTimesOptions] = useState([]);
  const [selectedPartySize, setSelectedPartySize] = useState("");
  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

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
      const targetTables = tables.filter((table) => table.restaurant_id?._id === targetRestaurantId);
      setRestaurantTables(targetTables);
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

  //       for (let timeSlot of dayInfo.hour_ranges) {
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
    if (restaurants.length > 0 && restaurantTables.length > 0 && selectedDate && selectedPartySize) {
      const date = moment(selectedDate);
      const dayName = date.format("dddd");
      const dayInfo = restaurants[0].days.find((d) => d.day === dayName);

      // 如果選定的日期餐廳是關門的，則不顯示任何時間選項
      if (!dayInfo || dayInfo.status === "Closed") {
        setReservationTimesOptions([]);
        return;
      }
      // 所有的時間選項
      let allTimeSlots = [];
      for (let timeSlot of dayInfo.hour_ranges) {
        let startTime = moment(timeSlot.start, "HH:mm");
        let endTime = moment(timeSlot.end, "HH:mm");

        while (startTime.isBefore(endTime)) {
          allTimeSlots.push(startTime.format("HH:mm"));
          startTime.add(1, "hours");
        }
      }

      // 獲取所有還可被預訂的桌子：
      // 1. 當tables的桌子的booked_date_time的booked_date等於selectedDate，則檢查booked_time_slots的length是否小於allTimeSlots的length，即代表該日期還有能被預訂的時間。
      // 2. 當tables的桌子的booked_date_time的booked_date沒有包含到selectedDate，則代表是可被預訂的桌子。
      const availableTables = restaurantTables.filter((table) => {
        const bookedDate = table.booked_date_time.find((b) => moment(b.booked_date).isSame(selectedDate, "day"));
        return !bookedDate || (bookedDate && bookedDate.booked_time_slots.length < allTimeSlots.length);
      });

      // 根據選擇的人數過濾桌子
      // const filteredTables = availableTables.filter((table) => table.max_table_capacity >= selectedPartySize);
      const filteredTables = availableTables.filter(
        (table) => selectedPartySize >= table.table_capacity.min && selectedPartySize <= table.table_capacity.max
      );
      console.log(filteredTables);

      // 創建時間選項：
      // 1. 當filteredTables的桌子的booked_date_time的booked_date等於selectedDate：如果filteredTables中的“所有桌子”的booked_date_time的booked_time_slots都包含該時間（例如：11:00），則不能渲染該時間選項出來（11:00），否則可以渲染出該時間選項出來（11:00）。
      // 2. 當tables的桌子的booked_date_time的booked_date沒有包含到selectedDate，則代表是可被預訂的桌子，則可以渲染出該時間選項出來（11:00）。
      let times = [];
      allTimeSlots.forEach((timeSlot) => {
        // 檢查每個時間段是否至少有一個桌子在該時段是空閒的
        const isTimeSlotAvailable = filteredTables.some((table) => {
          const bookedDate = table.booked_date_time.find((b) => moment(b.booked_date).isSame(selectedDate, "day"));
          return !bookedDate || !bookedDate.booked_time_slots.includes(timeSlot);
        });
        // 如果至少有一個桌子在該時段是空閒的，則將該時間加入可預訂的時間列表中
        if (isTimeSlotAvailable) {
          // Convert to "hh:mm A" format for display
          const displayTimeSlot = moment(timeSlot, "HH:mm").format("hh:mm A");
          times.push(displayTimeSlot);
        }
      });
      console.log("times: " + times);

      setReservationTimesOptions(times);
    }
  }, [restaurants, restaurantTables, selectedDate, selectedPartySize]);

  useEffect(() => {
    setIsSubmitEnabled(selectedPartySize !== "" && selectedDate !== "" && selectedTime !== "");
  }, [selectedPartySize, selectedDate, selectedTime]);

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
        {/* Side Bar */}
        <div className="sidebar">
          {/* Reservation Info */}
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
                    <option value="">Select Party Size</option>
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
                    min={moment().add(1, "days").format("YYYY-MM-DD")}
                  />
                </div>
                {/* Time Slots */}
                <div>
                  <select
                    id="reservation_time"
                    className="form-select"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    disabled={reservationTimesOptions.length === 0}
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
                  <input
                    type="submit"
                    value="Submit"
                    className={`btn btn-warning ${!isSubmitEnabled ? "disabled" : ""}`}
                  />
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
};

export default Intro;
