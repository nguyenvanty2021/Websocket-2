import ReactDOM from "react-dom";
import React, { Component } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Card, Avatar, Input, Typography } from "antd";
import "antd/dist/antd.css";
import "./index.css";

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;
//const webSocket = useRef(null);
// cách khác
const client = new W3CWebSocket("ws://127.0.0.1:8000");

export default class App extends Component {
  // dùng để scrollBottom cho message mới
  //const scrollBottomRef = useRef(null);
  state = {
    userName: "",
    isLoggedIn: false,
    messages: [],
  };

  onButtonClicked = (value) => {
    //webSocket.current.send(JSON.stringify(new ChatMessageDto(user, message)))
    // Bước 2: gửi message lên server
    client.send(
      JSON.stringify({
        type: "message",
        msg: value,
        user: this.state.userName,
      })
    );
    this.setState({ searchVal: "" });
  };
  // useEffect(() => {
  // webSocket.current = new WebSocket("ws://127.0.0.1:8000")
  // webSocket.current.onopen = (e) => {
  //   console.log("Open: ", e);
  // };
  // webSocket.current.onclose = (e) => {
  //   console.log("Close: ", e);
  // };
  //   return () => {
  //     console.log("Closing WebSocket");
  //     webSocket.current.close();
  //   }
  // }, [])
  // const [chatMessages, setChatMessages] = useState([])
  // useEffect(() => {
  //   webSocket.current.onmessage = (e) => {
  //     const chatMessageDto = JSON.parse(event);
  //     console.log("Message: ", chatMessageDto);
  //     setChatMessages([...chatMessages, {user: chatMessageDto.user,message: chatMessageDto.message}])
  //   }
  // },[chatMessages])
  componentDidMount() {
    // Bước 1: connect với server
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    // Bước 3: server respon obj message về cho client, client lưu vào mảng để render ra
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log("got reply! ", dataFromServer);
      if (dataFromServer.type === "message") {
        this.setState((state) => ({
          messages: [
            ...state.messages,
            {
              msg: dataFromServer.msg,
              user: dataFromServer.user,
            },
          ],
        }));
        // if (scrollBottomRef.current) {
        //   scrollBottomRef.current.scrollIntoView({ behavior: "smooth" });
        // }
      }
    };
  }
  render() {
    return (
      <div className="main" id="wrapper">
        {this.state.isLoggedIn ? (
          <div>
            <div className="title">
              <Text
                id="main-heading"
                type="secondary"
                style={{ fontSize: "36px" }}
              >
                Websocket Chat: {this.state.userName}
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingBottom: 50,
              }}
              id="messages"
            >
              {this.state.messages.map((message) => (
                <Card
                  //   ref={scrollBottomRef}
                  key={message.msg}
                  style={{
                    width: 300,
                    margin: "16px 4px 0 4px",
                    alignSelf:
                      this.state.userName === message.user
                        ? "flex-end"
                        : "flex-start",
                  }}
                  loading={false}
                >
                  <Meta
                    avatar={
                      <Avatar
                        style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                      >
                        {message.user[0].toUpperCase()}
                      </Avatar>
                    }
                    title={message.user + ":"}
                    description={message.msg}
                  />
                </Card>
              ))}
            </div>
            <div className="bottom">
              <Search
                placeholder="input message and send"
                enterButton="Send"
                value={this.state.searchVal}
                size="large"
                onChange={(e) => this.setState({ searchVal: e.target.value })}
                onSearch={(value) => this.onButtonClicked(value)}
              />
            </div>
          </div>
        ) : (
          <div style={{ padding: "200px 40px" }}>
            <Search
              placeholder="Enter Username"
              enterButton="Login"
              size="large"
              onSearch={(value) =>
                this.setState({ isLoggedIn: true, userName: value })
              }
            />
          </div>
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
