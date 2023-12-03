import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { fetchRestaurants } from "../store/restaurantsSlice.js";
import Banner from "../components/Banner.js";
import Hours from "../components/Hours.js";
import Info from "../components/Info.js";
import {
  Divider
} from "@mui/material";

const Submission = () => {
  // http://localhost:3000/submission?restaurantId=<restaurantId>&reservationId=<reservationId>
  // To Get Query Params
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const restaurantId = queryParams.get('restaurantId');
  const reservationId = queryParams.get('reservationId');
  const [restaurant, setRestaurant] = useState("");
  const [reservation, setReservation] = useState("");
  const [formattedDate, setDate] = useState("");
  const [formattedTime, setTime] = useState("");

  // Redux to fetch Restaurant Data
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants.entities);
  const restaurantsStatus = useSelector((state) => state.restaurants.status);
  useEffect(() => {
    if (restaurantsStatus === "idle") {
      dispatch(fetchRestaurants());
    }
    if (restaurantsStatus === "succeeded") {
      const foundRestaurant = restaurants.find((r) => r._id === restaurantId);
      setRestaurant(foundRestaurant);
    }
  }, [restaurantsStatus, dispatch]);

  // Fetch Reservation Details
  useEffect(() => {
    //server-side API
    const apiUrl = `http://localhost:4000/reservations/${reservationId}`; // API endpoint
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const formattedDate = moment(data.date).format('ddd, DD MMM YYYY');
        setDate(formattedDate);
        const formattedTime = moment(data.time, 'HH:mm').format('hh:mm A');
        setTime(formattedTime);
        setReservation(data); // Set the retrieved data in the state
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  return (
    <main>
      <div className="main main-content">
        <Banner bannerImage={restaurant ? restaurant.banner_image : ""} />
        <div className="content diner-content">
          <section className="restaurant-info">
            <h1>{restaurant ? restaurant.name : "Loading..."}</h1>
            <div className="restaurant-info-wrapping restaurant-info-wrapping-submission"></div>
          </section>
          <section className="submission-info">
            <h3 className="mb-3">Submission details</h3>
            <p className="mb-5">Your reservation has been made.</p>
            <form action="">
              <div class="row mb-3">
                <label for="partySize" class="col-sm-3 col-form-label">
                  Party Size
                </label>
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control border-0 bg-light"
                    id="partySize"
                    value={reservation.guests}
                    disabled
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="ReservationDate" class="col-sm-3 col-form-label">
                  Date
                </label>
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control border-0 bg-light"
                    id="ReservationDate"
                    value={formattedDate}
                    disabled
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="ReservationTime" class="col-sm-3 col-form-label">
                  Time
                </label>
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control border-0 bg-light"
                    id="ReservationTime"
                    value={formattedTime}
                    disabled
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="table" class="col-sm-3 col-form-label">
                  Table
                </label>
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control border-0 bg-light"
                    id="table"
                    value={reservation.table_name}
                    disabled
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="name" class="col-sm-3 col-form-label">
                  Name
                </label>
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control border-0 bg-light"
                    id="name"
                    value={reservation.firstname + " " + reservation.lastname}
                    disabled
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="phone" class="col-sm-3 col-form-label">
                  Phone Number
                </label>
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control border-0 bg-light"
                    id="phone"
                    value={reservation.phone}
                    disabled
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="email" class="col-sm-3 col-form-label">
                  Email
                </label>
                <div class="col-sm-9">
                  <input
                    type="email"
                    class="form-control border-0 bg-light"
                    id="email"
                    value={reservation.email}
                    disabled
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="note" class="col-sm-3 col-form-label">
                  Note
                </label>
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control border-0 bg-light"
                    id="note"
                    value={reservation.note ? reservation.note : ""}
                    disabled
                  />
                </div>
              </div>
            </form>
            {/* <form action="">
              <div class="row mb-3 sub-row">
                <p class="col-sm-3 sub-labels">Party Size</p>
                <p class="col-sm-9">{reservation.guests}</p>
              </div>
              <div class="row mb-3 sub-row">
                <p class="col-sm-3 sub-labels">Date</p>
                <p class="col-sm-9">{formattedDate}</p>
              </div>
              <div class="row mb-3 sub-row">
                <p class="col-sm-3 sub-labels">Time</p>
                <p class="col-sm-9">{formattedTime}</p>
              </div>
              <div class="row mb-3 sub-row">
                <p class="col-sm-3 sub-labels">Seating</p>
                <p class="col-sm-9">{reservation.table_name}</p>
              </div>
              <div class="row mb-3 sub-row">
                <p class="col-sm-3 sub-labels">Name</p>
                <p class="col-sm-9">{reservation.firstname + " " + reservation.lastname}</p>
              </div>
              <div class="row mb-3 sub-row">
                <p class="col-sm-3 sub-labels">Phone Number</p>
                <p class="col-sm-9">{reservation.phone}</p>
              </div>
              <div class="row mb-3 sub-row">
                <p class="col-sm-3 sub-labels">Email</p>
                <p class="col-sm-9">{reservation.email}</p>
              </div>
              <div class="row mb-3 sub-row">
                <p class="col-sm-3 sub-labels">Note</p>
                <p class="col-sm-9">{reservation.note ? reservation.note : ""}</p>
              </div>
            </form> */}
          </section>
        </div>
        {/* Side Bar */}
        <div className="sidebar">
          {/* Restaurant Info on Side Bar */}
          <Info restaurant={restaurant} />
          {/* Hours of Operation */}
          <Hours restaurant={restaurant} />
        </div>
        {/* Side Bar */}
        {/* <div className="sidebar">
          <div className="content">
            <section className="restaurant-info">
              <h3 className="text-center">Restaurant Information</h3>
              <br></br>
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
            <br></br>
            <Divider />
            <br></br>
            <div className="content">
              <Hours restaurant={restaurant} />
            </div>
          </div>
        </div> */}
      </div>
    </main>
  );
};

export default Submission;
