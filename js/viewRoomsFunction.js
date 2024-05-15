/**
 * selectMeetingRoom will be added with click event, for constructing room availablity page in the html page : 'nextPage`
 */
function selectMeetingRoom() {
  let loginState = true;
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

      room_data_details.push(room_data);
      localStorage.setItem("room_details", JSON.stringify(room_data_details));
      const roomName = encodeURIComponent(lsRoomName);
      window.location.href = `nextPage.htm?room=${encodeURIComponent(
        roomName
      )}&roomLength=${fetchedRoomLength}&loginState=${loginState}`;
    });
  });
}

selectMeetingRoom();
