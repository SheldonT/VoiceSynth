import {useState} from "react";
import './App.css';
import Key from "./Key"
import * as Tone from "tone";

function App() {

  const [audioURL, setAudioURL] = useState(null);

  let chunks = [];

  let recordedAudio = null;

  const whiteKeyWidth = 2;
  const blackKeyWidth = 1;

  const keyContainer = {
    position: "relative",
  };
  const synth = new Tone.Synth().toDestination();
  const player = new Tone.Player().toDestination();

  const mic = new Tone.UserMedia();
  const dest = mic.context.createMediaStreamDestination();
  const mediaRecorder = new MediaRecorder(dest.stream);
  mic.connect(dest);

  const onMic = (event) => {
    //for some reason, recording won't start unless I play a tone first.
    
    synth.triggerAttackRelease("C4", 0.1);

    setTimeout(async () => {
    try {
      mediaRecorder.start();
      await mic.open();

      event.target.disabled = true;

      setTimeout(() => {
        mediaRecorder.stop();
        mic.close();
        event.target.disabled = false
      }, 1000);
    } catch(e) {
      console.log(e);
    }}, 100);
  }


  mediaRecorder.ondataavailable = (evt) => {
    // Push each chunk (blobs) in an array
    chunks.push(evt.data);
  };

  mediaRecorder.onstop = (evt) => {
    // Make blob out of our blobs, and open it.
    recordedAudio = new Blob(chunks, { type: "audio/wav" });
    setAudioURL(URL.createObjectURL(recordedAudio));
  };

  return (
    <div className="App">
        <h1 className="title">Voice Synth</h1>
        <button className="micButton"
          onClick={ onMic }
        >
          Mic On
        </button>


        <button
          className="playBack"
          onClick={async () => {
            try{
              await player.load(audioURL);
              player.start();

            } catch (e){console.log(e)}
            
          }}
          disabled={audioURL === null ? true : false}>
          PlayBack
        </button>


        <div style={{...keyContainer, left: "-7rem"}}>
          <Key width={whiteKeyWidth} note="C4" sample={audioURL} />

          <Key color="black" width={blackKeyWidth} index="1" note="C#4" sample={audioURL} offSet="1.5"/>

          <Key width={whiteKeyWidth} note="D4" sample={audioURL} offSet="2"/>

          <Key color="black" width={blackKeyWidth} index="1" note="D#4" sample={audioURL} offSet="3.5" />

          <Key width={whiteKeyWidth} note="E4" sample={audioURL} offSet="4" />

          <Key width={whiteKeyWidth} note="F4" sample={audioURL} offSet="6" />

          <Key color="black" width={blackKeyWidth} index="1" note="F#4" sample={audioURL} offSet="7.5" />

          <Key width={whiteKeyWidth} note="G4" sample={audioURL} offSet="8"/>

          <Key color="black" width={blackKeyWidth} index="1" note="G#4" sample={audioURL} offSet="9.5" />

          <Key width={whiteKeyWidth} note="A4" sample={audioURL} offSet="10" />

          <Key color="black" width={blackKeyWidth} index="1" note="A#4" sample={audioURL} offSet="11.5" />

          <Key width={whiteKeyWidth} note="B4" sample={audioURL} offSet="12" />
      </div>

    </div>
  );
}

export default App;
