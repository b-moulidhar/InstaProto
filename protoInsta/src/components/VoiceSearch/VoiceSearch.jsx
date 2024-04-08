import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import "./voiceSearch.css";
import Api from '../../api/api';

const VoiceSearchComp = () => {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const [results, setResults] = useState();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>Speech recognition is not supported in this browser.</div>;
  }

  const handleStart = () => {
    SpeechRecognition.startListening();
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
  };

  const handleResult = (result) => {
    if (result) {
      Api.post("/voiceSearch", { transcript: transcript })
        .then((response) => {
          console.log(response);
          setResults(response.data);
        })
        .catch((err) => {
          console.log("error", err);
          alert("no data found");
        });
    }
  };

  // Handle end of speech recognition
  if (!listening && transcript){
    // Trigger an action when speech recognition ends
    console.log("voice end")
    handleResult(transcript)
    resetTranscript()
  }

  return (
    <>
      <h1>Voice search</h1>
      <div className="container">
        <button className="btn btn-success" onClick={handleStart}>
          Start Listening
        </button>
        <button className="btn btn-danger" onClick={handleStop}>
          Stop Listening
        </button>
        <button className="btn btn-primary" onClick={resetTranscript}>
          Reset
        </button>
        <p>Transcript: {transcript}</p>
        <br />
        {console.log("results",results)}
        <div>
            <table className='table'>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>user name</th>
                        <th>email</th>
                    </tr>
                </thead>
          {results ? results.map((data,idx)=>{
              return<>
                    <tbody>
                        <tr>
                            <td>{data.id}</td>
                            <td>{data.u_name}</td>
                            <td>{data.email}</td>
                        </tr>
                    </tbody>
                </>
        }) : <div> No results found</div>}
        </table>
        </div>
      </div>
    </>
  );
};

export default VoiceSearchComp;