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

//Get Count of All Members of All Types
  memberTypes = () => {
    
    //Create Map to store counts.
    var counts = new Map();

    counts.set("Family Membership", 0);
    counts.set("Single Membership", 0);
    counts.set("Senior Membership", 0);
    counts.set("Lifetime Member", 0);
    counts.set("Senior Couple", 0);
    counts.set("Basic Membership", 0);
  
    //Get all Badge Numbers from Database
    var ref = firebase.database().ref("badges");
    
    //Iterates on map to check which membership type and increment that value in the counts map.
    const getTypes = (value, key, map) => {
      var newref = firebase.database().ref("users/" + value + "/type");
      newref.once("value", data => {
        var tempType = data.val();
        var tempCount = counts.get(tempType);
        tempCount++;
        counts.set(tempType, tempCount);
        store(counts);
      });

    };
    
    console.log(counts);
    
    //Sorts the badge numbers to get one person from each to avoid duplicate counts
    //Calls getTypes to count types on the created map.
    ref.once("value", data => {
      var temp = data.val();
      var map = new Map();
      Object.keys(temp).forEach(key => {
        map.set(key, Object.keys(temp[key])[0]);
      });
      map.forEach(getTypes);
    });
    
    //Updates state to contain the counts of memberships
    this.setState({
      getType: true,
      singleCount: counts.get("Single Membership"),
      seniorCount: counts.get("Senior Membership"),
      familyCount: counts.get("Family Membership")
    });
    
    //returns dataset
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
