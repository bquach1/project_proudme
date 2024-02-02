import React from "react";
import pdf from "../../components/cafeteria/proudme_cafeteria.pdf";
import "../../css/cafeteria.css";

const Cafeteria = () => {
  return (
    <div>
      <h1 className="cafeteria-header">ProudMe Cafeteria</h1>
      <div className="info-text">
        The ProudMe Cafeteria is designed to help schools make environmental and
        policy changes to their cafeterias. Our research team assesses the
        cafeterias using the Smarter Lunchroom Scorecard. We then offer specific
        training and support to the lunchroom staff within each school and
        assist them in making effective and efficient changes at the cafeteria.
      </div>
      <br />
      <div className="info-text">
        A healthy food environment empowers healthy eating. The ProudMe
        Cafeteria will promote healthier eating among students at the
        participating schools.
      </div>
      <div className="info-text" style={{textAlign: "center", marginTop: "1%", marginBottom: "1%", fontSize: 20}}>
      <a href={pdf} target="blank">
        <strong>Click here to view the full ProudMe Cafeteria module!</strong>
      </a>
      </div>
      <div className="pdf-container">
        <img
          src={require("../../components/cafeteria/page_1.jpg")}
          alt="Page 1 of Cafeteria Module"
          className="pdf-page"
        />
        <img
          src={require("../../components/cafeteria/page_2.jpg")}
          alt="Page 2 of Cafeteria Module"
          className="pdf-page"
        />
        <img
          src={require("../../components/cafeteria/page_17.jpg")}
          alt="Page 3 of Cafeteria Module"
          className="pdf-page"
        />
        <img
          src={require("../../components/cafeteria/page_21.jpg")}
          alt="Page 4 of Cafeteria Module"
          className="pdf-page"
        />
      </div>      
    </div>
  );
};

export default Cafeteria;
