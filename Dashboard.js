import React, { Component } from "react";
import { AuthUser } from "./AuthContext";
import { Doughnut } from "react-chartjs-2";
import firebase from "./firebase";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      singleCount: 0,
      familyCount: 0,
      seniorCount: 0,
      seniorCoupleCount: 0,
      basicCount: 0,
      lifetimeCount: 0,
      getType: false
    };
    this.memberTypes = this.memberTypes.bind(this);
    this.getTypeData = this.getTypeData.bind(this);
  }

  getTypeData = () => {
    if (
      this.state.singleCount === 0 &&
      this.state.familyCount === 0 &&
      this.state.seniorCount === 0 &&
      this.state.getType === false
    ) {
      return this.memberTypes();
    } else {
      return {
        datasets: [
          {
            data: [
              this.state.singleCount,
              this.state.familyCount,
              this.state.seniorCount
            ]
          }
        ],
        labels: ["Single Membership", "Family Membership", "Senior Membership"]
      };
    }
  };

  logout = () => {
    console.log("Made it");
    window.location = "/";
  };

  memberTypes = () => {

    var counts = new Map();
    
    counts.set("Family Membership", 0);
    counts.set("Single Membership", 0);
    counts.set("Senior Membership", 0);
    counts.set("Lifetime Member", 0);
    counts.set("Senior Couple", 0);
    counts.set("Basic Membership", 0);

    var ref = firebase.database().ref("badges");


    const getTypes = (value, key, map) => {
      var newref = firebase.database().ref("users/" + value + "/type");
      newref.once("value", data => {
        var tempType = data.val();
        var tempCount = counts.get(tempType);
        tempCount++;
        counts.set(tempType, tempCount);
      });

    };

    console.log(counts);
    ref.once("value", data => {
      var temp = data.val();
      var map = new Map();
      Object.keys(temp).forEach(key => {
        map.set(key, Object.keys(temp[key])[0]);
      });
      map.forEach(getTypes);
    });

    this.setState({
      getType: true,
      singleCount: counts.get("Single Membership"),
      seniorCount: counts.get("Senior Membership"),
      familyCount: counts.get("Family Membership")
    });

    return {
      datasets: [
        {
          data: [
            this.state.singleCount,
            this.state.familyCount,
            this.state.seniorCount
          ]
        }
      ],
      labels: ["Single Membership", "Family Membership", "Senior Membership"]
    };
  };

  render() {
    /*return (
      <AuthUser>
        {({ isAuth, logout }) => (
          <div>
            <button
              type="submit"
              onClick={() => {
                this.logout();
              }}
            >
              Log Out
            </button>
          </div>
        )}
      </AuthUser>
    );*/
    return (
      <div>
        <Doughnut data={this.getTypeData} />
      </div>
    );
  }
}

export default Dashboard;
