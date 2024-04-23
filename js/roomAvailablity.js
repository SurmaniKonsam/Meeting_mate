/**
 * getParameterByName will fetch the queryParam value that is room from the htm page click event 'selectMeetingRoom'
 * This can be exported to.
 * @param {*} name
 * @param {*} url
 * @returns
 */
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//Get the roomName from the query parameter
let roomName = getParameterByName("room");

//Get the roomLength
let roomLength = getParameterByName("roomLength");

//Get the loginState
let loginState = getParameterByName("loginState");

console.log(
  `room name via query param: ${roomName}\nroom length : ${roomLength}\nlogin state : ${loginState}`
);

/**
 * returnRoomData will return all the room data stored in the local storage.
 * */
function returnRoomData() {
  let user_data = JSON.parse(localStorage.getItem("room_details")) || [];
  const arr = Object.keys(user_data).map((key) => ({
    key,
    value: user_data[key],
  }));
  return arr;
}

/**
 * constructingRoomAvailablityPage function, constructs the whole room page when clicked on the meeting list rooms.
 * @param {*} roomAvailability
 * @param {*} amenityHeader
 */
function constructingRoomAvailablityPage(roomAvailability, amenityHeader) {
  const roomAvailabilityContainer = document.getElementById(
    "room_availablity_id"
  );
  const amenitiesHeader = document.getElementById("amenities_header_id");
  amenitiesHeader.textContent = amenityHeader;
  roomAvailabilityContainer.classList.add("room_style");
  roomAvailabilityStyling(roomAvailability, roomAvailabilityContainer);
  const wrapperMeetingContainer = document.getElementById("wrapper_meeting_id");
  wrapperMeetingContainer.classList.add("wrapper_meeting_style");
}

/**
 * roomAvailabilityStyling function, is used for checking whether the room is available or not via boolean value
 * roomAvailability
 * @param {*} roomAvailability
 * @param {*} roomAvailabilityContainer
 */
function roomAvailabilityStyling(roomAvailability, roomAvailabilityContainer) {
  if (roomAvailability === true) {
    console.log(`room is available`);
    roomAvailabilityContainer.textContent = "Room is Available";
    roomAvailabilityContainer.classList.add("room_available_style");
  } else {
    console.log(`room is not available`);
    roomAvailabilityContainer.textContent = "Room is Not Available";
    roomAvailabilityContainer.classList.add("room_not_available_style");
  }
}

/**
 * bookRoomFunction will make the pop-up confirmation for the login.
 */
function bookRoomFunction() {
  const bookRoom = document.getElementById("book_now_id");
  const loginContainerId = document.getElementById("login_container_id");
  bookRoom.addEventListener("click", function () {
    loginContainerId.style.display = "block";
    loginContainerId.classList.add("fade_out");
  });
}

/**
 * crossSignLogin, function will make the login pop-up close.
 */
function crossSignLogin() {
  const loginContainerId = document.getElementById("login_container_id");
  const crossSign = document.getElementById("cross_sign_warning_login_id");
  crossSign.addEventListener("click", function () {
    loginContainerId.style.display = "none";
  });
}

/**
 * confirmLoginFunction will redirect the page to index.htm, where the login credential is required.
 * it will make the pop login disappear
 */
function confirmLoginFunction() {
  const confirmLogin = document.getElementById("confirm_login_id");
  const loginContainerId = document.getElementById("login_container_id");
  let returnFrombookNow = true;
  confirmLogin.addEventListener("click", function () {
    loginContainerId.style.display = "none";
    /*window.location.href = `nextPage.htm?room=${encodeURIComponent(roomName)}&roomLength=${fetchedRoomLength}&loginState=${loginState}`;*/
    window.location.href = `index.htm`;
  });
}

bookRoomFunction();
crossSignLogin();
confirmLoginFunction();

/**
 * checkRoomName(roomName) : double checking if room name is there or not in the local storage
 * */
function checkRoomName(roomName) {
  const arr = returnRoomData();
  let roomAvailability;
  let amenityHeader;
  arr.forEach((x) => {
    let room = x.value.roomName;
    let fetchedRoomName = room.split(" ");
    if (
      fetchedRoomName[2] === `${roomName}` ||
      fetchedRoomName[1] === `${roomName}`
    ) {
      roomAvailability = x.value.roomAvailable;
      amenityHeader = room;
      constructingRoomAvailablityPage(roomAvailability, amenityHeader);
    }
  });
}

checkRoomName(roomName);
