  memberTypes = async() => {

    var counts = new Map();

    counts.set("Family Membership", 0);
    counts.set("Single Membership", 0);
    counts.set("Senior Membership", 0);
    counts.set("Lifetime Member", 0);
    counts.set("Senior Couple", 0);
    counts.set("Basic Membership", 0);

    var ref = firebase.database().ref("badges");

    const setAndReturn = () => {
      this.setState({
        getType: true,
        singleCount: counts.get("Single Membership"),
        seniorCount: counts.get("Senior Membership"),
        familyCount: counts.get("Family Membership"),
        lifetimeCount: counts.get("Lifetime Member"),
        seniorCoupleCount: counts.get("Senior Couple"),
        basicCount: counts.get("Basic Membership")
      });
      return {
        datasets: [
          {
            data: [
              this.state.singleCount,
              this.state.familyCount,
              this.state.seniorCount,
              this.state.lifetimeCount,
              this.state.seniorCoupleCount,
              this.state.basicCount
            ]
          }
        ],
        labels: ["Single", "Family", "Senior", "Lifetime", "Senior Couple", "Basic"]
      };

    }

    var itemsProcessed = 0;

    const getTypes = async (value, key, map) => {
      var newref = firebase.database().ref("users/" + value + "/type");
      await newref.once("value", data => {
        var tempType = data.val();
        var tempCount = counts.get(tempType);
        tempCount++;
        counts.set(tempType, tempCount);
        itemsProcessed++;
      }).then((res) =>{
        if(itemsProcessed === map.size)
        {
          setAndReturn();
        }
      });
      

    };

    await ref.once("value", async(data) => {
      var temp = data.val();
      var map = new Map();
      Object.keys(temp).forEach(key => {
        map.set(key, Object.keys(temp[key])[0]);
      });
      map.forEach(getTypes);
    });

  

  }
