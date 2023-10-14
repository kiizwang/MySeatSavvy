import React from 'react';
import Banner from "../components/Banner.js";

const Intro = () => {
  return (
    <main>
      <div className="main">
        <Banner />
        <div className="content">
          <section className="restaurant-info">
            <h1>The Rich Uncle Tavern</h1>
            <div className="restaurant-info-wrapping">
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">restaurant</span>
                </div>
                <p>Gastro Pub, Canadian, Burgers</p>
              </div>
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">payments</span>
                </div>
                <p>Credit Card, Mastercard, UnionPay via TheFork Pay, Visa</p>
              </div>
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">storefront</span>
                </div>
                <p>
                  45 King St W, Kitchener, ON N2G 1A1 <a href="#">View Map</a>
                </p>
              </div>
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">call</span>
                </div>
                <p>
                  <a href="#">(519) 208-8555</a>
                </p>
              </div>
            </div>
          </section>

          <section className="restaurant-content">
            <div className="restaurant-content-wrapping">
              <p>
                With a unique, inventive menu, The Rich Uncle Tavern is built on hearty live-fire fare and shareable
                snacks that pay homage to the brasseries and taverns of yesteryear. Defined by our humble and wholesome
                approach to food and beverage, The Rich Uncle Tavern features a charming and homely ambience for patrons
                to gather with old friends and find some new ones.
              </p>
              <p>
                Whether you’re partaking in a crafted cocktail during live music or a late-night bite in one of our
                booths, you’ll be able to experience a sociable atmosphere, curated beverages and delicious fare that
                will leave you sated.
              </p>
            </div>
          </section>

          <section className="restaurant-menu">
            <div className="restaurant-menu-wrapping">
              <h2>Menu</h2>
            </div>
          </section>
        </div>
        <div className="sidebar">
          <section className="reservation-info">
            <h2>Make A Reservation</h2>
            <div className="reservation-info-wrapping">
              <form action="" method="" className="reservation-form"></form>
            </div>
          </section>

          <section className="restaurant-hours">
            <h2>Make A Reservation</h2>
            <div className="reservation-hours-wrapping">
              <table className="hours-table"></table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Intro
