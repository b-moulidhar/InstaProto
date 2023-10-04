import { useEffect } from 'react'

const ImagesComp = (heros) => {
    const {hero,index} = heros;

    useEffect(() => {
      if(document.getElementsByClassName("allImages").length>0){
  
      const container = document.getElementsByClassName("container")[0];
      const image = Array.from(document.getElementsByClassName("allImages"));
      let scale = 1;
      let offsetX = 0;
      let offsetY = 0;
      let isDragging = false;
  
  
  
  image.forEach((imgs)=>{
    imgs.addEventListener("wheel", (e) => {
      e.preventDefault();
      scale += e.deltaY * -0.0005; // Adjust the delta multiplier for slower zoom
      scale = Math.min(Math.max(1, scale), 1.5); // Adjust min and max zoom levels
      updateImage(imgs);
      container.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
            console.log("drg",offsetX,offsetY);
        });
      
        window.addEventListener("mousemove", (e) => {
          if (!isDragging) return;
          const x = e.clientX - container.getBoundingClientRect().left;
          const y = e.clientY - container.getBoundingClientRect().top;
          const deltaX = x - offsetX;
          const deltaY = y - offsetY;
          offsetX = x;
          offsetY = y;
          container.scrollLeft -= deltaX;
          container.scrollTop -= deltaY;
          console.log("drg",container.scrollLeft,y);
        });
        window.addEventListener("mouseup", () => {
            isDragging = false;
        });
        
      });
    })
    function updateImage(imgs) {
        imgs.style.transform = `scale(${scale})`;
    }  
  
  
    }  
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

  return <>
  
  <img src={createBlobUrl(hero.filedata, hero.filetype)} alt={`Hero ${index}`} className="allImages" draggable="true" />
  <p>{hero.filename}</p>
  {/* Render the image using createBlobUrl */}
  {hero.filetype === "application/pdf" && (
    <a href={createBlobUrl(hero.filedata, hero.filetype)} download={hero.filename}>
      download
    </a>
  )}
   {hero.filetype === "application/pdf" && revokeBlobUrl(createBlobUrl(hero.filedata, hero.filetype))}
  </>

}

export default ImagesComp;