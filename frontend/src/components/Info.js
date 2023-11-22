import React from "react";

const Info = ({ restaurant }) => {
  return (
    <section className="restaurant-side-info">
      <h3 className="text-center">Restaurant Information</h3>
      <div className="restaurant-side-info-wrapping">
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
  );
};

export default Info;
