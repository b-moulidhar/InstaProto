import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewComp = () => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const refresh = () => {
    axios.get("http://localhost:5000/getImages").then((res) => {
        console.log(res.data)
      setHeroes(res.data);
      setLoading(false);
    });
  };
  useEffect(() => {
    refresh();
  }, []);


  // Function to convert base64 to blob and create URL
  const createBlobUrl = async(base64String, fileType) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    console.log(byteArray);
  
    // Set the correct MIME type based on the fileType parameter
    let mimeType;
    switch (fileType) {
      case "jpeg":
        mimeType = "image/jpeg";
        break;
      case "pdf":
        mimeType = "application/pdf";
        break;
      case "png":
        mimeType = "image/png";
        break;
      default:
        mimeType = "image/png"; // Default to image/jpeg if the fileType is unknown
        break;
    }
    console.log(URL.createObjectURL(new Blob([byteArray], { type: mimeType })));
    return URL.createObjectURL(new Blob([byteArray], { type: mimeType }));
  };
  

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        heroes.map((hero, index) => (
          <div key={index}>
            {/* Render the individual properties of the hero object */}
            <h2>{hero.filename}</h2>
            <p>{hero.filetype}</p>
            {/* Render the image using createBlobUrl */}
            <img src={createBlobUrl(hero.filedata, hero.filetype)} alt={`Hero ${index}`} />
            {
              hero.filetype === "application/pdf" &&
            <a href={createBlobUrl(hero.filedata, hero.filetype)} download={hero.filename}>download</a>
            }
          </div>
        ))
      )}
    </>
  );
};

export default ViewComp;
