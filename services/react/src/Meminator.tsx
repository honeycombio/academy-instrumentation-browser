import { useEffect, useState } from "react";

export default function Meminator() {

  const [image, setImage] = useState<Blob | null>(null);
  
  useEffect(() => {
    fetchMeme();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fetchMeme();
  };

  const fetchMeme = () => {
    fetch('/api/createPicture', { method: 'POST' })
        .then((response) => response.blob())
        .then((data) => setImage(data));
  };

  return (
    <div>
      <h1>Meminator</h1>
      <div>
         <button onClick={handleClick}>GO</button>
      </div>
      <div>
      { image && <img src={URL.createObjectURL(image)} alt="meme" /> }
      </div>
    </div>
  );
}
