import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { fetchRestaurants } from "../store/restaurantsSlice.js";
import { fetchTables } from "../store/tablesSlice.js";
import Banner from "../components/Banner.js";
import Hours from "../components/Hours.js";
import Info from "../components/Info.js";

const Submission = () => {
  // http://localhost:3000/submission/65511ae91afd8462ae0877a2
  const params = useParams();
  const restaurantId = params.restaurantId;
  const [restaurant, setRestaurant] = useState("");

  // Redux
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants.entities);
  const restaurantsStatus = useSelector((state) => state.restaurants.status);
  const restaurantsError = useSelector((state) => state.restaurants.error);

  useEffect(() => {
    if (restaurantsStatus === "idle") {
      dispatch(fetchRestaurants());
    }
    if (restaurantsStatus === "succeeded") {
      const foundRestaurant = restaurants.find((r) => r._id === restaurantId);
      setRestaurant(foundRestaurant);
    }
  }, [restaurantsStatus, dispatch, restaurantId, restaurants]);

  return (
    <main>
      <div className="main main-content">
        <Banner bannerImage={restaurant ? restaurant.banner_image : ""} />
        <div className="content diner-content">
          {/* Info */}
          <section className="restaurant-info">
            <h1>{restaurant ? restaurant.name : "Loading..."}</h1>
            <div className="restaurant-info-wrapping"></div>
          </section>
          <section className="submission-info">
            <h3 className="mb-3">Submission details</h3>
            <p className="mb-5">Thank you, your reservation has been made.</p>
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
          </section>
        </div>
        {/* Side Bar */}
        <div className="sidebar">
          {/* Restaurant Info on Side Bar */}
          <Info restaurant={restaurant} />
          {/* Hours of Operation */}
          <Hours restaurant={restaurant} />
        </div>
      </div>
    </main>
  );
};

export default Submission;
