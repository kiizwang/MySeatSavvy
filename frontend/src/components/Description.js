import React from 'react'

const Description = ({ restaurants }) => {
  return (
    <section className="restaurant-side-content">
      <div className="restaurant-side-content-wrapping">
        {restaurants.length > 0 ? (
          restaurants[0].description.map((desc, index) => <p key={index}>{desc}</p>)
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </section>
  );
};

export default Description