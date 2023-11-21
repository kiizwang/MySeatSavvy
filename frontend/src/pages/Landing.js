import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchRestaurants } from "../store/restaurantsSlice.js";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const CustomAutocomplete = Autocomplete;

const Landing = () => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [inputError, setInputError] = useState(false);

  // Redux
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants.entities);
  const restaurantsStatus = useSelector((state) => state.restaurants.status);
  const restaurantsError = useSelector((state) => state.restaurants.error);

  // Navigation
  const navigate = useNavigate();

  useEffect(() => {
    if (restaurantsStatus === "idle") {
      dispatch(fetchRestaurants());
    }
  }, [restaurantsStatus, dispatch]);

  // Auto Complete
  const restaurantNames = restaurants.map((restaurant) => restaurant.name);

  const checkInputAndNavigate = () => {
    if (!selectedRestaurantId) {
      setInputError(true);
      return;
    }

    setInputError(false);
    navigate(`/intro/${selectedRestaurantId}`);
  };

  const handleAutocompleteChange = (event, value) => {
    const restaurant = restaurants.find((r) => r.name === value);
    setSelectedRestaurantId(restaurant ? restaurant._id : "");

    if (value) {
      setInputError(false); // 當輸入框有值時，清除錯誤提示
    }
  };

  return (
    <main className="landing">
      {/* 01 Hero Section */}
      <section className="landing-hero d-flex align-items-center">
        <div className="container">
          <div className="landing-hero-wrapping row d-flex justify-content-center align-items-center column-gap-5 row-gap-4">
            <div className="landing-hero-slogan col-md-12 col-lg-10 col-xl-5">
              <h1>Cherish the Moments,</h1>
              <h1>Savor the Flavors with SeatSavvy.</h1>
            </div>
            <div className="landing-hero-box col-sm-9 col-md-7 col-lg-5 col-xl-4">
              <div className="mb-4">
                <h3>Find Your Perfect Table,</h3>
                <h3>Where Every Meal Becomes a Treasured Memory.</h3>
              </div>
              <CustomAutocomplete
                options={restaurantNames}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search a Restaurant"
                    error={inputError}
                    helperText={inputError ? "Please select a restaurant from the list." : ""}
                  />
                )}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()))
                }
                onChange={handleAutocompleteChange}
              />
              <div className="d-grid mt-4">
                <input
                  type="submit"
                  value="Savor the Moment"
                  className="landing-cta-btn btn btn-warning btn-lg"
                  // onClick={() => navigate(`/intro/${selectedRestaurantId}`)}
                  onClick={checkInputAndNavigate}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 02 Restaurants Section */}
      <section className="landing-restaurants">
        <div className="landing-restaurants-wrapping">
          <h2 className="">Restaurants chosen for you</h2>
          <div className="landing-restaurants-items">
            {restaurants.map((restaurant, index) => (
              <div className="restaurants-item" key={index} onClick={() => navigate(`/intro/${restaurant._id}`)}>
                <div
                  className="item-image"
                  style={{ backgroundImage: `url(/images/${restaurant.banner_image})` }}
                ></div>
                <div className="item-text">
                  <h3>{restaurant.name}</h3>
                  <p>{restaurant.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* 03 Contact Section */}
      <section className="landing-contact">
        <div className="landing-contact-wrapping d-flex flex-column jutisft-content-center align-items-center">
          <h2 className="mb-4">Are You a Restaurant Owner?</h2>
          <input type="submit" value="Contact Us" className="btn btn-lg btn-warning landing-cta-btn" onClick="" />
          <div className="landing-contact-slogan"></div>
        </div>
      </section>
    </main>
  );
};

export default Landing;
