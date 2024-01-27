import React from 'react';
import Navigation2 from '../../component/Navigation2';
import Pagenumber from '../../component/Pagenumber';
import Container from '../../component/Container';
import Switch from '../../component/Switch';
import Select from '../../component/Select';
import { Button } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';


function UserHomePage() {

  var pc = null;
function createPeerConnection() {
  

  return pc;
}

function negotiate() {
  console.log("negotiate");
  return pc
    .createOffer()
    .then(function(offer) {
      return pc.setLocalDescription(offer);
    })
    .then(function() {
      // wait for ICE gathering to complete
      return new Promise(function(resolve) {
        if (pc.iceGatheringState === "complete") {
          resolve();
        } else {
          function checkState() {
            if (pc.iceGatheringState === "complete") {
              pc.removeEventListener("icegatheringstatechange", checkState);
              resolve();
            }
          }
          pc.addEventListener("icegatheringstatechange", checkState);
        }
      });
    })
    .then(function() {
      var offer = pc.localDescription;
      console.log(
        "offer generated: " + JSON.stringify(offer).substring(0, 15) + "..."
      );
      console.log("offer");
      console.log(frameRate);

      return fetch("http://192.168.1.28:8000/p2sOffer", {
        body: JSON.stringify({
          type: offer.type,
          sdp: offer.sdp,
          framerate: frameRate,
        }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        method: "POST",
      }).catch((e) => console.log(e));
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(answer) {
      console.log(
        "answer recieved: " + JSON.stringify(answer).substring(0, 15) + "..."
      );
      return pc.setRemoteDescription(answer);
    })
    .catch(function(e) {
      alert(e);
    });
  }
  // let videoStream =  new MediaStream()

let frameRate = 1;
function start() {
  // frameRate = document.getElementById("framerate").value;
  frameRate = 10
  var config = {
    sdpSemantics: "unified-plan",
  };

  config.iceServers = [
    {
      urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
    },
  ];
  pc = new RTCPeerConnection(config);
  pc.addEventListener("track", function(evt) {
    console.log("recieved stream");
    console.log(pc.connectionState);
    // videoStream = evt.streams[0]
    document.getElementById("video").srcObject = evt.streams[0];
  });
  const transciever = pc.addTransceiver("video", { direction: "recvonly" });
  transciever.direction = "recvonly";
  const dc = pc.createDataChannel("chat");
  dc.onclose = function() {
    console.log("dc closed");
  };

  dc.onopen = function() {};

  dc.onmessage = function(evt) {
    console.log(evt.data);
  };
  negotiate();
}
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");

  return (
    <div>
        <Navigation2/><br></br>
      <div style={{ paddingLeft: 670, position: 'relative' }}>
        <div style={{ position: 'absolute' }}>
          <Select />
          <Button onClick={start}
              variant="contained">Start</Button>
        </div>
      </div>
      <Container/><br></br>
      <Container/>
      <Button>Hello</Button>
      <Switch/>
     <Pagenumber/> 
    </div>

    
  );
}

export default UserHomePage;
