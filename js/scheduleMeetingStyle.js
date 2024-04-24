/**
 * returnUserData : given function can be imported from its parent js folder where used. For the time being, its made
 * available in the same js page.
 * @returns
 */
function returnUserData() {
  let user_data = JSON.parse(localStorage.getItem("user_details")) || [];
  const arr = Object.keys(user_data).map((key) => ({
    key,
    value: user_data[key],
  }));
  return arr;
}

/**
 * selectOrganiserfunction : function, will take the number of existing user and be used as options for select organiser tag.
 */
function selectOrganiserfunction() {
  console.log("hellow");
  const organiserId = document.getElementById("organizer_id");
  const imageId = document.getElementById("profile_pic_id");
  const userData = returnUserData();
  const documentFragment = document.createDocumentFragment();
  userData.forEach((x) => {
    const organiser = document.createElement("option");
    organiser.value = `${x.value.userName}`;
    organiser.textContent = `${x.value.userName}`;
    imageId.src = `${x.value.profile_pic}`;
    documentFragment.appendChild(organiser);
  });
  organiserId.appendChild(documentFragment);
}

function setMeetingRoomName() {
  const meetingRoomContainer = document.getElementById("rooms_id");
  fetch("../data/roomdata.json")
    .then((response) => {
      //if response is not ok then throw error
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const documentFragment = document.createDocumentFragment();
      data.forEach((element, index) => {
        const room = document.createElement("option");
        room.value = `${element.room_name}`;
        room.textContent = `${element.room_name}`;
        documentFragment.appendChild(room);
      });
      meetingRoomContainer.appendChild(documentFragment);
    })
    .catch((error) => {
      //if there is error in reading the json file will catch the error and log it to the console.
      console.error("Error fetching the JSON file:", error);
    });
}

setMeetingRoomName();
selectOrganiserfunction();
