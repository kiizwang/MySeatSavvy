import React, { useState, useEffect } from "react";
import Banner from "../components/Banner.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { fetchRestaurants } from "../store/restaurantsSlice.js";
import { useSelector, useDispatch } from "react-redux";
import Info from "../components/Info.js";
import Hours from "../components/Hours.js";
import {
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box, color, style } from "@mui/system";
import { faCcMastercard } from "@fortawesome/free-brands-svg-icons/faCcMastercard";
import {
  faPhone,
  faLocationDot,
  faUtensils,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { grey } from "@mui/material/colors";
import {loadStripe} from '@stripe/stripe-js';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import moment from "moment";

const Diner = () => {
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants.entities);
  const restaurantsStatus = useSelector((state) => state.restaurants.status);
  useEffect(() => {
    if (restaurantsStatus === "idle") {
      dispatch(fetchRestaurants());
    }
  }, [restaurantsStatus, dispatch]);
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const partySizeParam = queryParams.get('partySize');
  const dateParam = queryParams.get('date');
  const timeParam = queryParams.get('time');

  // Format date and time
  const dateTimeString = `${dateParam} ${timeParam}`; // Concatenate the date and time strings to form a complete datetime string
  const parsedDateTime = moment(dateTimeString, 'YYYY-MM-DD HH:mm');  // Create a moment object by parsing the datetime string
  const formattedDateTime = parsedDateTime.format('hh:mmA, ddd D MMM YYYY');  // Format the parsed datetime as required (including AM/PM for time)
  const selectedTable = queryParams.get("selected_table")
  const selectedRestaurant = queryParams.get('restaurantId')
  const restaurant = restaurants.filter((key) => key._id == selectedRestaurant)[0]


  //State management of reservation details
  const [reservationDetails, setReservationDetails] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    specialRequest: " ",
  });

  const handleChange = (e, field) => {
    setReservationDetails({ ...reservationDetails, [field]: e.target.value });
  };

  function validateName(name) {
    const namePattern = /^[a-zA-Z]{2,}$/;
    return namePattern.test(name);
  }

  function validatePhoneNumber(phoneNumber) {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phoneNumber);
  }

  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  const customBackButtonStyle = {
    backgroundColor: "#FFFFFF",
    color: "#000000",
  };

  const disableSubmitButton =
    reservationDetails.email.length > 0 &&
    reservationDetails.firstName.length > 0 &&
    reservationDetails.lastName.length > 0 &&
    reservationDetails.phoneNumber.length > 0 &&
    validateEmail(reservationDetails.email) &&
    validateName(reservationDetails.firstName) &&
    validateName(reservationDetails.lastName) &&
    validatePhoneNumber(reservationDetails.phoneNumber);

  const customButtonStyle = {
    backgroundColor: disableSubmitButton ? "#FFD300" : grey,
    color: "#000000",
  };

  const makePayment = async(id, restaurantId)=>{
    const stripe = await loadStripe("pk_test_51O9u29GxPIHOFN70nBDCTbDystrGdqqaUo0Z6QIva1wU8RbuDa6LO2xmF2MuPkztNBCSWW3HiANCezaH5HQSryd2008cPqwEm6");

    const body = {
       reservationId : id,
       restaurantId : restaurantId
    }
    const headers = {
        "Content-Type":"application/json"
    }
    const response = await fetch("http://localhost:4000/payment",{
        method:"POST",
        headers:headers,
        body:JSON.stringify(body)
    });

    const session = await response.json();

    const result = stripe.redirectToCheckout({
        sessionId:session.id
    });

    if(result.error){
        console.log(result.error);
    }
}
  const submitReservations = () => {
    if (disableSubmitButton) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: reservationDetails.firstName,
          lastname: reservationDetails.lastName,
          email: reservationDetails.email,
          phone: reservationDetails.phoneNumber,
          guests: Number(partySizeParam),
          note: reservationDetails.specialRequest,
          date: dateParam || Date(),
          time: timeParam,
          restaurant_id: restaurant._id,
          table_id: selectedTable
        }),
      };
      fetch("http://localhost:4000/reservations", requestOptions)
        .then((response) => {
          return response.json()})
        .then((data) => {
          sessionStorage.setItem("reservationId", data._id);
           makePayment(data._id, restaurant._id);
        });
    }
  };

  const handleBack = () => {
    // Go back to the previous page
    navigate(-1);
  };

  return (
    <main>
      <div className="main">
        <Banner bannerImage={restaurant ? restaurant.banner_image : ""} />
        <div className="content">
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <h1>{restaurant ? restaurant.name : "Loading..."}</h1>

            <div className="restaurant-info-wrapping">
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">face</span>
                </div>
                <p>{`${partySizeParam} Adults`}</p>
              </div>
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">calendar_month</span>
                </div>
                <p>{`${formattedDateTime}`}</p>
              </div>
            </div>

            {/* <Box display="flex" alignItems="center">
              <IconButton sx={{ mr: "16px" }} disableFocusRipple>
                <FontAwesomeIcon icon={faUtensils} />
              </IconButton>
              <h6>{`${partySizeParam} Adults`} </h6>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton sx={{ mr: "16px" }} disableFocusRipple>
                <FontAwesomeIcon icon={faClock} />
              </IconButton>
              <h6>{`${formattedDateTime}`}</h6>
            </Box>
            <Divider /> */}
            <br></br>
            <h2>Dinner Details</h2>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  error={!validateName(reservationDetails.firstName) && reservationDetails.firstName.length > 0}
                  helperText={
                    !validateName(reservationDetails.firstName) && reservationDetails.firstName.length > 0
                      ? "Please Enter valid First Name"
                      : ""
                  }
                  name="firstName"
                  label="First Name"
                  placeholder="First Name"
                  variant="outlined"
                  value={reservationDetails.firstName}
                  onChange={(e) => {
                    handleChange(e, "firstName");
                  }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  error={!validateName(reservationDetails.lastName) && reservationDetails.lastName.length > 0}
                  helperText={
                    !validateName(reservationDetails.lastName) && reservationDetails.lastName.length > 0
                      ? "Please Enter valid Last Name"
                      : ""
                  }
                  name="lastName"
                  label="Last Name"
                  placeholder="Last Name"
                  variant="outlined"
                  value={reservationDetails.lastName}
                  onChange={(e) => {
                    handleChange(e, "lastName");
                  }}
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  error={
                    !validatePhoneNumber(reservationDetails.phoneNumber) && reservationDetails.phoneNumber.length > 0
                  }
                  helperText={
                    !validatePhoneNumber(reservationDetails.phoneNumber) && reservationDetails.phoneNumber.length > 0
                      ? "Please enter valid Phone Number"
                      : ""
                  }
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="Phone Number"
                  variant="outlined"
                  value={reservationDetails.phoneNumber}
                  onChange={(e) => {
                    handleChange(e, "phoneNumber");
                  }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  error={!validateEmail(reservationDetails.email) && reservationDetails.email.length > 0}
                  helperText={
                    !validateEmail(reservationDetails.email) && reservationDetails.email.length > 0
                      ? "Please Enter valid Email"
                      : ""
                  }
                  name="email"
                  label="Email"
                  placeholder="Email"
                  variant="outlined"
                  value={reservationDetails.email}
                  onChange={(e) => {
                    handleChange(e, "email");
                  }}
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  name="specialRequests"
                  label="Ask for any special requests"
                  placeholder="Ask for any special requests"
                  variant="outlined"
                  value={reservationDetails.specialRequest}
                  onChange={(e) => {
                    handleChange(e, "specialRequest");
                  }}
                  margin="normal"
                  minRows="3"
                />
              </Grid>
            </Grid>
            <h6 style={{ color: "green" }}> Payment of 20CAD is required to complete reservation of table.</h6>
            <Button
              disabled={!disableSubmitButton}
              onClick={submitReservations}
              variant="contained"
              style={customButtonStyle}
              sx={{ marginTop: "16px" }}
            >
              Pay 20CAD
            </Button>
            <Button variant="contained" sx={{ marginTop: "16px" }} style={customBackButtonStyle} onClick={handleBack}>
              Back
            </Button>
          </Box>
        </div>
        {/* Side Bar */}
        <div className="sidebar">
          {/* Restaurant Info on Side Bar */}
          <Info restaurant={restaurant} />
          {/* Hours of Operation */}
          <Hours restaurant={restaurant} />
        </div>
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

export default Diner;