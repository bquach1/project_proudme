import React from "react";
import withAuth from "components/auth/withAuth";

const PetScreen = () => {
  return (
    <div className="pet">
      <h1>Coming soon!</h1>
    </div>
  );
};

export default withAuth(PetScreen);
