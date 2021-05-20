var conversation = {};

// Fetching JSON file from API link
fetch("https://redventures.github.io/chatly-ifier/api/v1.json")
  .then(response => response.json())
  .then(json => {
    if (json.status === 200) {
      render(json.data, "chatBox");
    }
});

/// Generates markup and appends to the DOM
/// data [object]: full conversation data
/// parentId [string]: DOM parent element id
function render(data, parentId) {
  let html = '';
  // make local copy of conversation data
  conversation = data;
  // display conversation data in chat transcript title
  // generate markup
  html += renderHeader(data.conversationDate);
  html += renderMessages(data.messages);
  // write to DOM
  const elem = document.getElementById(parentId);
  elem.innerHTML = html;
}

/// Generates header markup
/// returns html string
function renderHeader(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let conversationDate = new Date(date).toLocaleDateString(undefined, options);
  // render header
  let html =
  `<div class="chat-title flex space-between row">
    <div class="column logo">CHAT TRANSCRIPT</div>
    <div class="column conversation-date">${conversationDate}</div>
  </div>
  `
  return html;
}
  
/// Generates messages markup
/// returns html string
function renderMessages(messages) {
  let html = '';
  let users = [];
  // user id
  let uid = [];

  messages.forEach((msg, index) => {
    // if user exists, retrieve
    let user = users.find(u => u.username === msg.username);
    if (user === undefined) { 
      // else add to user list - use id for styling
      user = { id: uid, username: msg.username, image: msg.image, time: msg.timestamp };
      users.push(user);
      uid++;
    }
    // formats timestamp to show HH:MM
    user.time = new Date(msg.timestamp).toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
    // generate markup 
    if (user.id === 1) {
      // first user on the left
      html +=
      `<div class="container flex">
        <div class="container tri-right message-container sent-message" data-msg-index=${index}>
          <div class="chat-message">${msg.message}</div>
          <div class="message-footer flex row align-center">
            <div class="sender">${user.username}</div>
            <div class="timestamp align-center">
              <img class="clock-icon" src="./img/clock-icon.svg"/>${user.time}
            </div>
          </div>
        </div>
        <img class="user-icon column" src=${user.image} />
      </div>`
    } else {
      // second user on the right
      html +=
      `<div class="container flex">
        <img class="user-icon column" src=${user.image} />
        <div class="tri-left message-container received-message" data-msg-index=${index} onclick=messageOnClick(this)>
          <div class="chat-message">${msg.message}</div>
          <div class="message-footer flex row align-center">
            <div class="column user-id receiver">${user.username}</div>
            <div class="timestamp align-center">
              <img class="clock-icon" src="./img/clock-icon.svg"/>${user.time}
            </div>
          </div>
        </div>
      </div>`
    } 
  });
  return html;
} 
