/**
 * selectMeetingRoom will be added with click event, for constructing room availablity page in the html page : 'nextPage`
 */
function selectMeetingRoom() {
  const selectAllRoom = document.querySelectorAll(".meeting_rooms");
  selectAllRoom.forEach((x) => {
    x.addEventListener("click", function (event) {
      event.preventDefault();
      let room_data_details =
        JSON.parse(localStorage.getItem("room_details")) || [];
      if (!Array.isArray(room_data_details)) {
        room_data_details = [];
      }
      let room = x.textContent.trim().split(" ");
      let roomFullName = x.textContent.trim();
      let fetchedRoomLength = `${room.length}`;
      let lsRoomName;

      if (Number(fetchedRoomLength) === 3) {
        lsRoomName = room[2];
      } else {
        lsRoomName = room[1];
      }

      const room_data = {
        roomName: roomFullName,
        roomAvailable: true,
        upcomingMeeting: "",
      };

      /**
       * persistingRoomName : function, will set new room name to the local storage everytime, the room name has been clicked.
       */
      persistingRoomName(lsRoomName);

      room_data_details.push(room_data);
      localStorage.setItem("room_details", JSON.stringify(room_data_details));
      window.location.href = `nextPage.htm`;
    });
  });
}

/**
 * persistingRoomName : function, will persist new room name to key "room_name", everytime the user clicks to the room name
 * @param {*} roomFullName 
 */
function persistingRoomName(roomFullName) {
  localStorage.setItem("room_name", roomFullName);
}

selectMeetingRoom();
