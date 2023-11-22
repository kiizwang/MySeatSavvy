import React, { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";
import Banner from "../components/Banner.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchRestaurants } from "../store/restaurantsSlice.js";
import { useSelector, useDispatch } from "react-redux";
import Hours from "../components/Hours.js";
import { Divider, Grid, IconButton, Typography } from "@mui/material";
import { Box, style } from "@mui/system";
import { faCcMastercard } from "@fortawesome/free-brands-svg-icons/faCcMastercard";
import { faPhone, faLocationDot, faUtensils } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const Submission = () => {
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants.entities);
  const restaurantsStatus = useSelector((state) => state.restaurants.status);
  useEffect(() => {
    if (restaurantsStatus === "idle") {
      dispatch(fetchRestaurants());
    }
  }, [restaurantsStatus, dispatch]);

  const { state } = useLocation();

  const formattedDate = moment.utc(state.date).format("ddd, DD MMM YYYY"); // format date in Sun, 23 Sep 2023 format
  return (
    <main>
      <div className="main">
        <Banner />
        <div className="content">
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h3" fontWeight="600">
              {" "}
              {restaurants.length > 0 ? restaurants[0].name : "Loading..."}
            </Typography>
            <Divider />
            <Typography variant="h4" fontWeight="600" style={{ paddingTop: "8px" }}>
              Submission details
            </Typography>
            <Typography style={{ paddingTop: "8px", paddingBottom: "16px" }}>
              Your reservation has been made.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography fontWeight="600">Party Size</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography>2 Adults</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography fontWeight="600">Date</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography>{formattedDate}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography fontWeight="600">Time</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography>{state.time}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography fontWeight="600">Seating</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography>A1</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography fontWeight="600">Name</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography>{state.firstname + " " + state.lastname}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography fontWeight="600">Phone Number</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography>{state.phone}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography fontWeight="600">Email</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography>{state.email}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography fontWeight="600">Note</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography>{state.note}</Typography>
              </Grid>
            </Grid>
          </Box>
        </div>
        <div className="sidebar">
          <div className="content">
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography align="center" variant="h5" fontWeight="600">
                {" "}
                Restaurant Information
              </Typography>
              <br></br>
              <Box display="flex" alignItems="left">
                <IconButton sx={{ mr: "16px" }} disableFocusRipple>
                  <FontAwesomeIcon icon={faUtensils} />
                </IconButton>
                <Typography paddingTop={1}> {restaurants.length > 0 ? restaurants[0].type : "Loading..."}</Typography>
              </Box>
              <Box display="flex" alignItems="left">
                <IconButton sx={{ mr: "16px" }} disableFocusRipple>
                  <FontAwesomeIcon icon={faCcMastercard} />
                </IconButton>
                <Typography paddingTop={1}>
                  {restaurants.length > 0 ? restaurants[0].payments : "Loading..."}
                </Typography>
              </Box>
              <Box display="flex" alignItems="left">
                <IconButton sx={{ mr: "16px" }} disableFocusRipple>
                  <FontAwesomeIcon icon={faLocationDot} />
                </IconButton>
                <Typography paddingTop={1}>{restaurants.length > 0 ? restaurants[0].address : "Loading..."}</Typography>
              </Box>
              <Box display="flex" alignItems="left">
                <IconButton sx={{ mr: "16px" }} disableFocusRipple>
                  <FontAwesomeIcon icon={faPhone} />
                </IconButton>
                <Typography paddingTop={1}>{restaurants.length > 0 ? restaurants[0].phone : "Loading..."}</Typography>
              </Box>
            </Box>
            <br></br>
            <Divider />
            <br></br>
            <div className="content">
              <Hours restaurants={restaurants} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Submission;
