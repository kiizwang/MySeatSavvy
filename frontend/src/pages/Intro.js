import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { fetchRestaurants } from "../store/restaurantsSlice.js";
import { fetchTables } from "../store/tablesSlice.js";
import Banner from "../components/Banner.js";
import Hours from "../components/Hours.js";
import InfoMobile from "../components/InfoMobile.js";
import Description from "../components/Description.js";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Modal from "@mui/material/Modal";
import Map from "../components/Map.js";

const Intro = () => {
  const tomorrow = moment().add(1, "days").format("YYYY-MM-DD"); // can only select date from tomorrow

  const params = useParams();
  const restaurantId = params.restaurantId;

  const [restaurant, setRestaurant] = useState("");
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

  // All restaurants
  useEffect(() => {
    if (restaurantsStatus === "idle") {
      dispatch(fetchRestaurants());
    }
    if (restaurantsStatus === "succeeded") {
      const foundRestaurant = restaurants.find((r) => r._id === restaurantId);
      setRestaurant(foundRestaurant);
      setMapCenter({
        center: { lat: foundRestaurant.location.latitude, lng: foundRestaurant.location.longitude },
        zoom: 15,
        markers: [{ position: { lat: foundRestaurant.location.latitude, lng: foundRestaurant.location.longitude } }],
        style: "restaurant-map-style",
      });
      // setMapCenter({
      //   center: { lat: 43.391465797134344, lng: -80.40551535423039 },
      //   zoom: 15,
      //   markers: [{ position: { lat: 43.391465797134344, lng: -80.40551535423039 } }],
      //   style: "restaurant-map-style",
      // });
    }
  }, [restaurantsStatus, dispatch, restaurantId, restaurants]);

  // All tables
  useEffect(() => {
    if (tablesStatus === "idle") {
      dispatch(fetchTables());
    }
  }, [tablesStatus, dispatch]);

  // This restaurant's tables
  useEffect(() => {
    if (restaurant && tables.length > 0) {
      const targetRestaurantId = restaurant._id;
      const targetTables = tables.filter((table) => table.restaurant_id?._id === targetRestaurantId);
      setRestaurantTables(targetTables);
    }
  }, [restaurant, tables]);

  // Party size options
  useEffect(() => {
    if (restaurant) {
      const maxPartySize = restaurant.max_party_size;
      const options = Array.from({ length: maxPartySize }, (_, index) => ({
        value: index + 1,
        label: `${index + 1} ${index === 0 ? "Person" : "People"}`,
      }));
      setPartyMaxSizeOptions(options);
    }
  }, [restaurant]);

  // Date & Time
  useEffect(() => {
    if (restaurant && restaurantTables.length > 0 && selectedDate && selectedPartySize) {
      const date = moment(selectedDate);
      const dayName = date.format("dddd");
      const dayInfo = restaurant.days.find((d) => d.day === dayName);

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
  }, [restaurant, restaurantTables, selectedDate, selectedPartySize]);

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
      // navigate(
      //   `/seating?partySize=${selectedPartySize}&date=${selectedDate}&time=${moment(selectedTime, "hh:mm A").format(
      //     "HH:mm"
      //   )}`
      // );
      navigate(
        `/seating?restaurantId=${restaurant._id}&partySize=${selectedPartySize}&date=${selectedDate}&time=${moment(
          selectedTime,
          "hh:mm A"
        ).format("HH:mm")}`
      );
    }
  };

  // Menu
  const [openModal, setOpenModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const handleOpenModal = (image) => {
    setModalImage("/images/" + image);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Google Map
  const [mapCenter, setMapCenter] = useState(null);
  const mapStyle = {
    width: "100%",
    height: "400px",
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
      <div className="main main-sidebar">
        <Banner bannerImage={restaurant ? restaurant.banner_image : ""} />
        <div className="content">
          {/* Info */}
          <section className="restaurant-info">
            <h1>{restaurant ? restaurant.name : "Loading..."}</h1>
            <div className="restaurant-info-wrapping">
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">restaurant</span>
                </div>
                <span>{restaurant ? restaurant.type : "Loading..."}</span>
              </div>
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">payments</span>
                </div>
                <span>{restaurant ? restaurant.payments : "Loading..."}</span>
              </div>
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">storefront</span>
                </div>
                <span>
                  {restaurant ? restaurant.address : "Loading..."} <a href="#">View Map</a>
                </span>
              </div>
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">call</span>
                </div>
                <span>
                  <a href="#">{restaurant ? restaurant.phone : "Loading..."}</a>
                </span>
              </div>
            </div>
          </section>
          {/* Description */}
          <section className="restaurant-content">
            <div className="restaurant-content-wrapping">
              {restaurant ? restaurant.description.map((desc, index) => <p key={index}>{desc}</p>) : <p>Loading...</p>}
            </div>
          </section>
          {/* Menu */}
          <section className="restaurant-menu">
            <div className="restaurant-menu-wrapping">
              <h2>Menu</h2>
              {/* Menu MUI */}
              <div className="menu-items">
                {restaurant.menu ? (
                  restaurant.menu.map((item, index) => (
                    <Card key={index} onClick={() => handleOpenModal(item.image)}>
                      <CardMedia
                        component="img"
                        image={`/images/${item.image}`}
                        alt={item.name}
                        style={{ height: 100, width: 100 }}
                      />
                    </Card>
                  ))
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <Modal open={openModal} onClose={handleCloseModal}>
                <div className="modal-content">
                  <img src={modalImage} alt="Menu" style={{ width: "auto", height: "95vh" }} />
                </div>
              </Modal>
            </div>
          </section>
          {/* Map */}
          <section className="restaurant-map">
            <div className="restaurant-map-wrapping">
              <h2>Map</h2>
              <Map {...mapCenter} mapStyle={mapStyle} />
            </div>
          </section>
        </div>
        {/* Side Bar */}
        <div className="sidebar">
          {/* Restaurant Info on Side Bar */}
          <InfoMobile restaurant={restaurant} />
          {/* Reservation Info */}
          <section className="reservation-info">
            <h3 className="text-center">Make A Reservation</h3>
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
          {/* Restaurant Description on Side Bar */}
          <Description restaurant={restaurant} />
          {/* Hours of Operation */}
          <Hours restaurant={restaurant} />
        </div>
      </div>
    </main>
  );
};

export default Intro;
