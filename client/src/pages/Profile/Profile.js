import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserContext } from "../../components/Contexts/UserContext";
import "./Profile.css";
import profilePhoto from "./BibhaSthapit.jpeg";

function ProfileCard() {
  const { user } = useContext(UserContext);
  const [username] = useState(user);

  return (
    <div className="ProfileCard">
      <div className="photograph-part">
        <div className="image-container">
          <img src={profilePhoto} alt="" height="800px" width="800px" />
        </div>
      </div>

      <div className="description-part">
        <h1>
          <font color="#2566bb" />
          ID: BS
        </h1>
        <h2>Bibha Sthapit</h2>
        <h3 id="dept">Department of Computer and Electronics Engineering</h3>
        <h1>{username}</h1>

        <Router>
          <Link to="/routine">
            <button className="btn">Close</button>
          </Link>
        </Router>
      </div>
    </div>
  );
}

export default ProfileCard;
