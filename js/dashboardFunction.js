console.log(`inside dashboard page`);

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
 * getLoggedInEmailId : function, returns current logged in email id
 * @returns
 * Is a util
 */
function getLoggedInEmailId() {
  let emailId = localStorage.getItem("email");
  console.log(`email id : ${emailId}`);
  return emailId;
}

/**
 * getUpcomingMeetings : function, is used for getting the upcoming_meetings details from the local storage
 */
function getUpcomingMeetings() {
  let emailId = getLoggedInEmailId();
  // console.log(`emaild : ${emailId}`);
  const upcoming_meetings =
    JSON.parse(localStorage.getItem("upcoming_meetings")) || [];

  if (!Array.isArray(upcoming_meetings)) {
    upcoming_meetings = []; //converting retrieved object back to array.
  }

  const index = upcoming_meetings.findIndex((obj) => obj.email === emailId);
  if (index < 0) {
    return 0;
  } else {
    return upcoming_meetings[index].upcomingMeetingList.length;
  }

  // console.log(`upcoming meeting lengths : ${upcomingMeetingList.length}`);
}

/**
 * returnUpcomingMeetingList : function, will return the upcoming meetinglist for the email_id
 * @returns
 */
function returnUpcomingMeetingList() {
  let emailId = getLoggedInEmailId();
  // console.log(`emaild : ${emailId}`);
  const upcoming_meetings =
    JSON.parse(localStorage.getItem("upcoming_meetings")) || [];

  if (!Array.isArray(upcoming_meetings)) {
    upcoming_meetings = []; //converting retrieved object back to array.
  }
  const index = upcoming_meetings.findIndex((obj) => obj.email === emailId);

  return upcoming_meetings[index].upcomingMeetingList;
}

// getUpcomingMeetings();

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
  let meeting_rooms_length = getUpcomingMeetings();
  // console.log(`meeting rooms length : ${meeting_rooms_length}`);
  const meetingHeader = document.createElement("h3");
  meetingHeader.classList.add("upcoming_meeting_header_style");
  meetingHeader.id = "upcoming_meeting_header_id";
  //meeting_rooms_length should now be taken from the upcoming_meetings key stored in the local storage
  //where, the container will be displayed with grid-template-columns : repeated(3/1fr).
  //the container height will be kept constant allowing it to scroll vertically.

  //check first, if the email id is new for each login attempts.
  //on the top page.
  if (meeting_rooms_length === 0) {
    meetingHeader.textContent = "No Upcoming Meetings";
    upcoming_meeting_header.classList.add("reduce_height");
    upcoming_meeting_header.appendChild(meetingHeader);
    const noUpcomingText = document.createElement("div");
    noUpcomingText.textContent = "No Upcoming Meetings Available";
    noUpcomingText.classList.add("no_upcoming_text_style");
    upcoming_meeting_header.appendChild(noUpcomingText);
  } else {
    // console.log(`we have our upcoming meetings`);
    meetingHeader.textContent = "My Upcoming Meetings";
    upcoming_meeting_header.appendChild(meetingHeader);

    //this can be put into separate code.
    appendingUpcomingMeetings(upcoming_meeting_header);
  }
  documentFragment.appendChild(upcoming_meeting_header);
  meeting_room_container.appendChild(documentFragment);
}

/**
 * appendingUpcomingMeetings : function, used for appending booked meetings into the meeting container.
 * @param {*} upcoming_meeting_header
 */
function appendingUpcomingMeetings(upcoming_meeting_header) {
  const upcomingsMeetingContainer = document.createElement("div");
  upcomingsMeetingContainer.id = "upcoming_meeting_container_id";
  upcomingsMeetingContainer.classList.add("upcoming_meetings_style");
  upcoming_meeting_header.appendChild(upcomingsMeetingContainer);

  //now time to append the actual booked meetings.
  let upcomingMeetings = returnUpcomingMeetingList();
  upcomingMeetings.forEach((x) => {
    // console.log(`meetings : ${x}`);
    const meetingInfoCard = document.createElement("div");
    meetingInfoCard.classList.add("upcoming_meeting_info");
    meetingInfoCard.id = "meeting_info_card_id";
    // meetingInfoCard.textContent = x.roomName;
    upcomingsMeetingContainer.appendChild(meetingInfoCard);
    appendingMeetingInfoDetails(meetingInfoCard, x);
  });
}

function appendingMeetingInfoDetails(meetingInfoCard, data) {
  const meetingName = document.createElement("div");
  meetingName.classList.add("meeting_name_style");
  meetingName.textContent = data.meetingName;

  //organizer info, with profile pic and the organiser name.
  const organizer = document.createElement("div");
  organizer.classList.add("organizer_style");

  let checkboxValue = data.checkbox;
  console.log();

  //need to check here if the value is checked or not.
  console.log(`data.checkbox : ${typeof data.checkbox}`);

  let content;
  //if checked the check box the meeting name will be shown
  content = data.organizer;

  //organizer meeting.
  let imageUrl = "asset/user_pic.png";
  let htmlString = `
    <div>
        <img src="${imageUrl}" alt="user picture" class="user_style info_data_pic">
        ${content}
    </div>
`;
  organizer.innerHTML = htmlString;
  organizer.classList.add("meeting_info_margin_alignment");
  organizer.classList.add("meeting_info_font_style");

  const roomName = document.createElement("div");
  roomName.classList.add("room_name_style");
  roomName.classList.add("meeting_info_margin_alignment");
  roomName.classList.add("meeting_info_font_style");
  imageUrl = "asset/pin.png";
  content = data.roomName;
  htmlString = `
    <div>
        <img src="${imageUrl}" alt="locaiton picture" class="room_name_style info_data_pic">
        ${content}
    </div>
`;
  roomName.innerHTML = htmlString;

  const meetingDate = document.createElement("div");
  meetingDate.classList.add("meeting_date_style");
  meetingDate.classList.add("meeting_info_margin_alignment");
  meetingDate.classList.add("meeting_info_font_style");
  imageUrl = "asset/calendar-silhouette.png";
  content = data.expiryDate;
  htmlString = `
    <div>
        <img src="${imageUrl}" alt="date picture" class="date_style info_data_pic">
        ${content}
    </div>
`;
  meetingDate.innerHTML = htmlString;

  const meetingTime = document.createElement("div");
  meetingTime.classList.add("meeting_time_style");
  meetingTime.classList.add("meeting_info_margin_alignment");
  meetingTime.classList.add("meeting_info_font_style");
  imageUrl = "asset/time.png";
  content = `${data.startingTime} - ${data.endingTime}`;
  htmlString = `
    <div>
        <img src="${imageUrl}" alt="clock picture" class="clock_style info_data_pic">
        ${content}
    </div>
`;
  meetingTime.innerHTML = htmlString;

  //appending meeting info data
  meetingInfoCard.appendChild(meetingName);
  meetingInfoCard.appendChild(organizer);
  meetingInfoCard.appendChild(roomName);
  meetingInfoCard.appendChild(meetingDate);
  meetingInfoCard.appendChild(meetingTime);
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
  meetingRooms.classList.add("meeting_rooms_media_query");
  meetingsRoomsContainer.appendChild(meetingRooms);

  /*
  meeting rooms not available appended which shall be made appeared only if the search doesn't matches with any of the meeting
  room name
  */
  const meetingRoomsNotAvailable = document.createElement("div");
  meetingRoomsNotAvailable.id = "meeting_rooms_not_available_id";
  meetingRoomsNotAvailable.classList.add("meeting_room_not_available_style");
  meetingsRoomsContainer.appendChild(meetingRoomsNotAvailable);

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
  // console.log("meeting rooms child");
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
        // console.log(`img url : ${element.image_url}`);
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
      const elements = document.querySelectorAll(".meeting_room_name");
      searchCardFunction(elements);
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
    window.location.href = `scheduleMeetingPage.htm`;
  });
}

/**
 * searchCardFunction : function, will search for the elements passed as argument parent node.
 * Via every input value thus passed, the input value will be used to match the elements passed textContent
 * If the input passed matches the element passed textContent then, the element parent node will be displayed 'block'.
 * Else, the element parent node will be displayed 'none'.
 * If none of the input search text content matches, then all the element's parent node will get displayed.
 * @param {*} elements
 */
function searchCardFunction(elements) {
  const searchRoomId = document.getElementById("search_room_id");
  const roomNotAvailableContainer = document.getElementById(
    "meeting_rooms_not_available_id"
  );
  let timeoutId;
  // console.log(`length of element : ${elements.length}`);

  // Define a debounce function
  const debounce = (func, delay) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay);
  };

  searchRoomId.addEventListener("keyup", function () {
    //debounce function called to delay the execution time of the event 'keyup'
    debounce(() => {
      const searchText = searchRoomId.value.toLowerCase();
      let matchFound = false;
      let i = 0;
      elements.forEach((x) => {
        let elementText = x.textContent.toLowerCase();
        if (elementText.includes(searchText) || searchText === "") {
          x.parentNode.style.display = "block";
          roomNotAvailableContainer.style.display = "none";
          matchFound = true;
        } else {
          x.parentNode.style.display = "none";
        }
      });

      // If no match is found, display all parent nodes
      if (!matchFound && searchText !== "") {
        elements.forEach((x) => {
          x.parentNode.style.display = "none";
        });
        roomNotAvailableContainer.style.display = "flex";
        roomNotAvailableContainer.textContent = "No Room To Display";
        roomNotAvailableContainer.classList.add("room_not_available_style");
      }
    }, 1); // Adjust the delay (in milliseconds) as needed
  });
}

addingMeetingFunction();
setOrganiserMeetingInfo();
setProfilePic();
// searchCardFunction();
