import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { fetchRestaurants } from "../store/restaurantsSlice.js";
import { fetchTables } from "../store/tablesSlice.js";
import Banner from "../components/Banner.js";
import Hours from "../components/Hours.js";
import Info from "../components/Info.js";

const About = () => {
  // http://localhost:3000/about/65511ae91afd8462ae0877a2
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
            <h1>Temp</h1>
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
            </div>
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

export default About;
