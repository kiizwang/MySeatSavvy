import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { fetchRestaurants } from "../store/restaurantsSlice.js";
import { fetchTables } from "../store/tablesSlice.js";
import Banner from "../components/Banner.js";
import Hours from "../components/Hours.js";

const Intro = () => {
  const tomorrow = moment().add(1, "days").format("YYYY-MM-DD"); // can only select date from tomorrow

  // const [restaurants, setRestaurants] = useState([]); // no need because using "Redux"
  const [restaurantTables, setRestaurantTables] = useState([]); // get this restaurant's tables
  const [partyMaxSizeOptions, setPartyMaxSizeOptions] = useState([]);
  const [reservationTimesOptions, setReservationTimesOptions] = useState([]);
  const [selectedPartySize, setSelectedPartySize] = useState("");
  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [selectedTime, setSelectedTime] = useState("");
  const [filteredTables, setFilteredTables] = useState([]);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  console.log(filteredTables);

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

  // Restaurant's tables
  useEffect(() => {
    if (restaurants.length > 0 && tables.length > 0) {
      const targetRestaurantId = restaurants[0]._id;
      const targetTables = tables.filter((table) => table.restaurant_id?._id === targetRestaurantId);
      setRestaurantTables(targetTables);
    }
  }, [restaurants, tables]);

  // Party size options
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
    if (restaurants.length > 0 && restaurantTables.length > 0 && selectedDate && selectedPartySize) {
      const date = moment(selectedDate);
      const dayName = date.format("dddd");
      const dayInfo = restaurants[0].days.find((d) => d.day === dayName);

      // If the selected date is a day when the restaurant is closed, do not display any time options
      if (!dayInfo || dayInfo.status === "Closed") {
        setReservationTimesOptions([]);
        return;
      }
      // All time slots
      let allTimeSlots = [];
      for (let timeSlot of dayInfo.hour_ranges) {
        let startTime = moment(timeSlot.start, "HH:mm");
        let endTime = moment(timeSlot.end, "HH:mm");

        while (startTime.isBefore(endTime)) {
          allTimeSlots.push(startTime.format("HH:mm"));
          startTime.add(1, "hours");
        }
      }

      // Get all tables that can be reserved:
      // 1. When the booked_date_time of a table in tables matches selectedDate, check if the length of booked_time_slots is less than the length of allTimeSlots, indicating that the table can be reserved at that time.
      // 2. When the booked_date_time of a table in tables does not include selectedDate, it means the table can be reserved.
      const availableTables = restaurantTables.filter((table) => {
        const bookedDate = table.booked_date_time.find((b) => moment(b.booked_date).isSame(selectedDate, "day"));
        return !bookedDate || (bookedDate && bookedDate.booked_time_slots.length < allTimeSlots.length);
      });

      // Filter tables based on the selected party size
      const filteredTables = availableTables.filter(
        (table) => selectedPartySize >= table.table_capacity.min && selectedPartySize <= table.table_capacity.max
      );
      setFilteredTables(filteredTables);

      // Create new time options from allTimeSlots:
      // 1. When the booked_date_time of a table in filteredTables matches selectedDate: If all tables in "filteredTables" have their "booked_time_slots" containing a specific time (e.g., 11:00), that time slot should not be rendered, otherwise, it can be rendered (11:00 AM).
      // 2. When the booked_date_time of a table in tables does not include selectedDate, it means the table can be reserved, and that time slot can be rendered (11:00 AM).
      let times = [];
      allTimeSlots.forEach((timeSlot) => {
        // Check if at least one table in "filteredTables" is available at that time slot
        const isTimeSlotAvailable = filteredTables.some((table) => {
          const bookedDate = table.booked_date_time.find((b) => moment(b.booked_date).isSame(selectedDate, "day"));
          // it doesn't have selected date OR some of its "booked_time_slots" do not include timeSlot
          return !bookedDate || !bookedDate.booked_time_slots.includes(timeSlot);
        });
        // If at least one table is available at that time slot, add it to the list of available times
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

  // Submit button's status
  useEffect(() => {
    setIsSubmitEnabled(selectedPartySize !== "" && selectedDate !== "" && selectedTime !== "");
  }, [selectedPartySize, selectedDate, selectedTime]);

  // Navigation
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitEnabled) {
      // Session Storage
      sessionStorage.setItem("availableTables", JSON.stringify(filteredTables));
      // Navigation to Seating page
      navigate(
        `/seating?partySize=${selectedPartySize}&date=${selectedDate}&time=${moment(selectedTime, "hh:mm A").format(
          "HH:mm"
        )}`
      );
    }
  };

  const handlePartySizeChange = (e) => {
    setSelectedPartySize(e.target.value);
  };
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    setSelectedTime(selectedTime);
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
          {/* <section className="restaurant-menu">
            <div className="restaurant-menu-wrapping">
              <h2>Menu</h2>
            </div>
          </section> */}
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
                    onClick={handleSubmit}
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
