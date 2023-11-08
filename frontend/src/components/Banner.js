import React from "react";

const Banner = ({ bannerImage }) => {
  if (!bannerImage) {
    return null;
  }

  const backgroundImage = `url(/images/${bannerImage})`;

  return (
    <div className="banner" style={{ backgroundImage: backgroundImage }}>
    </div>
  );
};

export default Banner;
