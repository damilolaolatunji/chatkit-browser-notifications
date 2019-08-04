import { ChatManager, TokenProvider } from "@pusher/chatkit-client";

function handleInput(event) {
  const { value, name } = event.target;

  this.setState({
    [name]: value
  });
}

function connectToChatkit(event) {
  event.preventDefault();
  const { userId } = this.state;

  const tokenProvider = new TokenProvider({
    url:
    "<your token provider endpoint>"
  });

  const chatManager = new ChatManager({
    instanceLocator: "<your instance locator>",
    userId,
    tokenProvider
  });

  return chatManager
    .connect({
      onRoomUpdated: room => {
        console.log(room);
      }
    })
    .then(currentUser => {
      this.setState(
        {
          currentUser,
        },
        () => connectToRoom.call(this)
      );
    })
    .catch(console.error);
}

function grantPermission() {
  if (!('Notification' in window)) {
    alert('This browser does not support system notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification('You are already subscribed to web notifications');
    return;
  }

  if (
    Notification.permission !== 'denied' ||
    Notification.permission === 'default'
  ) {
    Notification.requestPermission().then(result => {
      if (result === 'granted') {
        new Notification(
          'New notification from Chatkit', {
            body: "Awesome, you will start receiving notifications for new messages"
          }
        );
      }
    });
  }

  this.setState({
    showNotificationToast: false
  });
};

function showNotificationToast() {
  if (window.Notification && Notification.permission === "granted") return

  this.setState({
    showNotificationToast: true
  });
}

function showNotification(message) {
  let messageText;
  message.parts.forEach(p => {
    messageText = p.payload.content;
  });

  new Notification(message.senderId, {
    body: messageText,
  });
};

function connectToRoom(roomId = "<your room id>") {
  const { currentUser } = this.state;
  this.setState({
    messages: []
  });

  return currentUser
    .subscribeToRoomMultipart({
      roomId,
      messageLimit: 0,
      hooks: {
        onMessage: message => {
          this.setState({
            messages: [...this.state.messages, message],
          });

          if (message.senderId !== currentUser.id) {
            showNotification(message)
          }
        },
      }
    })
    .then(currentRoom => {
      this.setState({
        currentRoom,
        rooms: currentUser.rooms,
      });

      showNotificationToast.call(this);
    })
    .catch(console.error);
}

function sendMessage(event) {
  event.preventDefault();
  const { newMessage, currentUser, currentRoom } = this.state;
  const parts = [];

  if (newMessage.trim() === "") return;

  parts.push({
    type: "text/plain",
    content: newMessage
  });

  currentUser.sendMultipartMessage({
    roomId: `${currentRoom.id}`,
    parts
  });

  this.setState({
    newMessage: "",
  });
}

export {
  handleInput,
  connectToRoom,
  connectToChatkit,
  sendMessage,
  grantPermission,
}
