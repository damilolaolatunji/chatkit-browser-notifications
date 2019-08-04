import React, { Component } from "react";
import {
  handleInput,
  connectToChatkit,
  connectToRoom,
  sendMessage,
  grantPermission,
} from "./methods";

import "skeleton-css/css/normalize.css";
import "skeleton-css/css/skeleton.css";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      userId: "",
      currentUser: null,
      currentRoom: null,
      rooms: [],
      messages: [],
      newMessage: "",
      showNotificationToast: false,
    };

    this.handleInput = handleInput.bind(this);
    this.connectToChatkit = connectToChatkit.bind(this);
    this.connectToRoom = connectToRoom.bind(this);
    this.sendMessage = sendMessage.bind(this);
    this.grantPermission = grantPermission.bind(this)
  }

  render() {
    const {
      rooms,
      currentRoom,
      currentUser,
      messages,
      newMessage,
      showNotificationToast,
    } = this.state;

    const roomList = rooms.map(room => {
      const isRoomActive = room.id === currentRoom.id ? 'active' : '';
      return (
        <li
          className={isRoomActive}
          key={room.id}
          onClick={() => this.connectToRoom(room.id)}
        >
          <span className="room-name">{room.name}</span>
        </li>
      );
    });

    const messageList = messages.map(message => {
      const arr = message.parts.map(p => {
          return (
            <span className="message-text">{p.payload.content}</span>
          );
      });

      return (
        <li className="message" key={message.id}>
          <div>
            <span className="user-id">{message.senderId}</span>
            {arr}
          </div>
        </li>
      )
    });

    return (
      <div className="App">
        {showNotificationToast ? (
        <div className="notification-toast">
          Chatkit needs your permission to <span onClick={this.grantPermission}>enable desktop notifications</span>
        </div>
        ) : null}
        <aside className="sidebar left-sidebar">
          {!currentUser ? (
              <div className="login">
                <h3>Join Chat</h3>
                <form id="login" onSubmit={this.connectToChatkit}>
                  <input
                    onChange={this.handleInput}
                    className="userId"
                    type="text"
                    name="userId"
                    placeholder="Enter your username"
                  />
                </form>
              </div>
            ) : null
          }
          {currentRoom ? (
            <div className="room-list">
              <h3>Rooms</h3>
              <ul className="chat-rooms">
                {roomList}
              </ul>
            </div>
            ) : null
          }
        </aside>
        {
          currentUser ? (
            <section className="chat-screen">
              <ul className="chat-messages">
                {messageList}
              </ul>
              <footer className="chat-footer">
                <form onSubmit={this.sendMessage} className="message-form">
                  <input
                    type="text"
                    value={newMessage}
                    name="newMessage"
                    className="message-input"
                    placeholder="Type your message and hit ENTER to send"
                    onChange={this.handleInput}
                  />
                </form>
              </footer>
            </section>
          ) : null
        }
      </div>
    );
  }
}

export default App;
