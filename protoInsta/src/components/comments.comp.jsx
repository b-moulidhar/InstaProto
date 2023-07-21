import { useState } from "react";
import axios from "axios";

const ImageComp = () => {
  const [file, setFile] = useState(null);
  const[data,SetData] = useState()

  function inputHandler(evt) {
    setFile(evt.target.files[0]);
  }

  function sendImage(e) {
    e.preventDefault();
    console.log("sending");

    // Create a new FormData instance and append the selected file
    const formData = new FormData();
    formData.append("file", file);

  


    axios
      .post("http://localhost:5000/upload", formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <form onSubmit={sendImage}>
        <label htmlFor="file">Select a file:</label>
        <br />
        <input type="file" name="file" id="file" onChange={inputHandler} />
        <br />
        <button type="submit">Upload File</button>
      </form>
    </>
  );
};

export default ImageComp;
