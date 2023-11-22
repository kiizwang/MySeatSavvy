import React from "react";

const Description = ({ restaurant }) => {
  return (
    <section className="restaurant-side-content">
      <div className="restaurant-side-content-wrapping">
        {restaurant ? restaurant.description.map((desc, index) => <p key={index}>{desc}</p>) : <p>Loading...</p>}
      </div>
    </section>
  );
};

export default Description;
