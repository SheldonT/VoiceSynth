import {useEffect} from "react";
import * as Tone from "tone";

export default function Key({color, width, index, note, sample, offSet}) {

  
  const player = new Tone.Player().toDestination();
  player.loop = true;

  useEffect(() => {
    const loadSample = async () => {
      try{
        if (sample !== null) await player.load(sample);
      } catch (e) {console.log(e)}
    }
    loadSample();
  },[sample]);
  
  const playTone = () => {
    if (sample !== null) {
    try{
      player.start();

      setTimeout(() => {
        const frequencyOfNote = Tone.Frequency(note).toFrequency();
        player.playbackRate = frequencyOfNote / Tone.Frequency("C3").toFrequency();
      }, 100);


    } catch (e){console.log(e)}
  }
  };
    
  const endTone = () => {
    player.stop();
  }

    const whiteKeys =  {
        position: "absolute",
        width: `${width}rem`,
        height: `${width * 4}rem`,
        borderStyle: "solid",
        borderColor: "black",
        borderRadius: "0 0 0.5rem 0.5rem",
        borderWidth: "0.1rem",
        backgroundColor: color ? color : "white",
        zIndex: index ? index : "0",
      }

    return(
        <div style={{...whiteKeys, left: offSet ? `${offSet}rem` : "0"}}
            onMouseDown={ () => playTone() }
            onTouchStart={ () => playTone() }

            onMouseUp={ () => endTone() }
            onTouchEnd={ () => endTone() }

            onMouseLeave={ () => endTone() }
            onTouchCancel={ () => endTone() }
            
            onMouseEnter={(e) => {if (e.buttons === 1) playTone()}}>
        </div>
    ) 
}