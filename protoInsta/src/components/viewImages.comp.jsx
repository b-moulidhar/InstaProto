import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/viewComp.css"

const ViewComp = () => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const refresh = () => {
    axios.get("http://localhost:5000/getImages").then((res) => {
      console.log(res.data);
      setHeroes(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  // Function to convert base64 to blob and create URL
  const createBlobUrl = (base64String, fileType) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Set the correct MIME type based on the fileType parameter
    let mimeType;
    switch (fileType) {
      case "image/jpeg":
        mimeType = "image/jpeg";
        break;
      case "application/pdf":
        mimeType = "application/pdf";
        break;
      case "image/png":
        mimeType = "image/png";
        break;
      default:
        mimeType = "image/png"; // Default to image/jpeg if the fileType is unknown
        break;
    }

    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
  };

  // Function to revoke the URL and free up memory
  const revokeBlobUrl = (url) => {
    URL.revokeObjectURL(url);
  };

  return (
    <>
    <div className="container">

      {loading ? (
        <p>Loading...</p>
      ) : (
        heroes.map((hero, index) => (
          <div key={index} className="items">
            {/* Render the individual properties of the hero object */}
            <img src={createBlobUrl(hero.filedata, hero.filetype)} alt={`Hero ${index}`} height="150px" width="150px" />
            <p>{hero.filename}</p>
            <p>{hero.filetype}</p>
            {/* Render the image using createBlobUrl */}
            {hero.filetype === "application/pdf" && (
              <a href={createBlobUrl(hero.filedata, hero.filetype)} download={hero.filename}>
                download
              </a>
            )}
            {((hero.filetype === "image/jpeg")||(hero.filetype === "image/png"))&& <p>
              comments: <br />
              <input type="textbox" name="comment" id={hero.filename} />
            </p>
            }
            {/* Don't forget to revoke the URL after the download link is clicked */}
            {hero.filetype === "application/pdf" && revokeBlobUrl(createBlobUrl(hero.filedata, hero.filetype))}
          </div>
        ))
      )}
    </div>
    </>
  );
};

export default ViewComp;
