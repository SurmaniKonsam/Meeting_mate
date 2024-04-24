console.log(`inside dashboard page`);
//use for extracting query param from the url
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * getUserData : function, used here can be imported, it returns the user_details from the local storage.
 * @returns
 */
function getUserData() {
  let user_data = JSON.parse(localStorage.getItem("user_details")) || [];
  const arr = Object.keys(user_data).map((key) => ({
    key,
    value: user_data[key],
  }));
  return arr;
}

//set profile picture
/**
 * setProfilePic : function, will set the profile picture for the user dashboard page iteratively.
 * Currently, the profile pic will always set the last available user details profile_pic.
 */
function setProfilePic() {
  let getUserName = getParameterByName("user_name");
  console.log(`username : ${getUserName}`);
  let fetchData = getUserData();
  let profilePicture;
  fetchData.forEach((x) => {
    profilePicture = `${x.value.profile_pic}`;
  });

  const profile_pic = document.getElementById("profile_pic_id");
  profile_pic.src = profilePicture;
  profile_pic.classList.add("profile_pic_style");
}

/**
 * checkOrganiserMeetingRooms : function, checks the available meeting room for the logged in user, via array.length feature.
 * If the returned length is 0 then the user doesn't have any meeting room on his/her name.
 * @returns
 */
function checkOrganiserMeetingRooms() {
  let getUserEmail = getParameterByName("email");
  let fetchData = getUserData();
  let user_fetched_data = fetchData.find(
    (data) => data.value.email === getUserEmail
  );
  let meeting_rooms = user_fetched_data.value.meetingRooms;
  return meeting_rooms.length;
}

function setOrganiserMeetingInfo() {
  const meeting_room_container = document.getElementById(
    "wrapper_meeting_mate_id"
  );
  meeting_room_container.classList.add("meeting_container_style");

  //executing/apending step by step
  appendMeetingContainerContent(meeting_room_container);

  //second, appending meeting rooms with meeting room images, adding/selecting meeting room and search meeting room
  appendMeetingRooms(meeting_room_container);
}

//appending meeting header, depending upon availablity of the meeting rooms by the organizer
/**
 * appendMeetingHeader : function,
 * @param {*} meeting_room_container
 */
function appendMeetingContainerContent(meeting_room_container) {
  const documentFragment = document.createDocumentFragment();
  const upcoming_meeting_header = document.createElement("div");
  upcoming_meeting_header.id = "upcoming_meeting_container_id";
  upcoming_meeting_header.classList.add("upcoming_meeting_container_style");
  let meeting_rooms_length = checkOrganiserMeetingRooms();
  console.log(`meeting rooms length : ${meeting_rooms_length}`);
  const meetingHeader = document.createElement("h3");
  meetingHeader.classList.add("upcoming_meeting_header_style");
  meetingHeader.id = "upcoming_meeting_header_id";
  if (meeting_rooms_length === 0) {
    meetingHeader.textContent = "No Upcoming Meetings";
    upcoming_meeting_header.appendChild(meetingHeader);
  } else {
    meetingHeader.textContent = "My Upcoming Meetings";
    upcoming_meeting_header.appendChild(meetingHeader);
  }
  documentFragment.appendChild(upcoming_meeting_header);
  meeting_room_container.appendChild(documentFragment);
}

function appendMeetingRooms(meeting_room_container) {
  const documentFragment = document.createDocumentFragment();
  const meetingsRoomsContainer = document.createElement("div");
  meetingsRoomsContainer.id = "meeting_rooms_container_id";
  meetingsRoomsContainer.classList.add("meeting_rooms_container_style");

  //this need to be segregated and modularised.
  const meetingRoomHeader = document.createElement("h3");
  meetingRoomHeader.id = "meeting_room_header_id";
  meetingRoomHeader.classList.add("meeting_room_header_style");
  meetingRoomHeader.textContent = "Meeting Rooms";
  meetingsRoomsContainer.appendChild(meetingRoomHeader);

  //this container will be for the search meeting room box
  const searchMeetingRoom = document.createElement("input");
  searchMeetingRoom.placeholder = "Search meeting rooms...";
  searchMeetingRoom.id = "search_room_id";
  searchMeetingRoom.classList.add("search_room_style");
  meetingsRoomsContainer.appendChild(searchMeetingRoom);

  //meeting rooms container
  const meetingRooms = document.createElement("div");
  meetingRooms.id = "meeting_rooms_id";
  meetingRooms.classList.add("meeting_rooms_style");
  meetingsRoomsContainer.appendChild(meetingRooms);

  //all the meeting rooms available will be appended from this function mentioned.
  meetingRoomsAppendingChild(meetingRooms);

  documentFragment.appendChild(meetingsRoomsContainer);
  //until here.

  meeting_room_container.appendChild(documentFragment);
}

/**
 * meetingRoomsAppendingChild : function, will append all the meeting rooms available which fetched from the local folder
 * data/roomData.json.
 * @param {*} meetingRooms
 */
function meetingRoomsAppendingChild(meetingRooms) {
  const documentFragment = document.createDocumentFragment();
  console.log("meeting rooms child");
  fetch("../data/roomdata.json")
    .then((response) => {
      //if response is not ok then throw error
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((element, index) => {
        console.log(`img url : ${element.image_url}`);
        const meetingRoom = document.createElement("div");
        meetingRoom.classList.add("room_style");

        //container for the meeting room image
        const meetingRoomImageContainer = document.createElement("figure");
        meetingRoomImageContainer.classList.add(
          "meeting_image_container_style"
        );

        //image element itself for the image
        const roomImage = document.createElement("img");
        roomImage.classList.add("room_image");
        roomImage.src = `${element.image_url}`;

        //appended room image to the meeting image container
        meetingRoomImageContainer.appendChild(roomImage);

        //available meeting room sign
        const availableContainer = document.createElement("div");
        availableContainer.classList.add("available_sign_style");

        //available sign red or green dot
        const availableSign = document.createElement("div");
        availableSign.classList.add("sign_style");

        //available sign text content "available"
        const availableText = document.createElement("div");
        availableText.classList.add("available_text_style");
        availableText.textContent = "Available";

        availableContainer.appendChild(availableSign);
        availableContainer.appendChild(availableText);

        meetingRoomImageContainer.appendChild(availableContainer);
        meetingRoom.appendChild(meetingRoomImageContainer);

        //meeting room name
        const meetingRoomName = document.createElement("div");
        meetingRoomName.classList.add("meeting_room_name");
        meetingRoomName.textContent = `${element.room_name}`;
        meetingRoom.appendChild(meetingRoomName);

        documentFragment.appendChild(meetingRoom);
      });
      meetingRooms.appendChild(documentFragment);
    })
    .catch((error) => {
      //if there is error in reading the json file will catch the error and log it to the console.
      console.error("Error fetching the JSON file:", error);
    });
}

/**
 * addingMeetingFunction : function, will take to the scheduleMeetingPage when clicked.
 */
function addingMeetingFunction() {
  const meetingBtn = document.getElementById("add_meeting_id");
  meetingBtn.addEventListener("click", function () {
    //window.location.href = `dashboard.htm?user_name=${userNameValue}&email=${emailValue}`;
    // alert("meeting btn clicked");
    window.location.href = `scheduleMeetingPage.htm`;
  });
}

addingMeetingFunction();
setOrganiserMeetingInfo();
setProfilePic();
