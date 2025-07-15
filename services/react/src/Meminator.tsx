import { useState } from "react";

export default function Meminator() {

  const [image, setImage] = useState<Blob | null>(null);
  const [phrase, setPhrase] = useState<string>('');
  const [fetching, setFetching] = useState<boolean>(false);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fetchMeme();
  };

  const fetchMeme = async () => {
    setFetching(true);
    try {
        const response = await fetch('/api/createPicture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: phrase ? JSON.stringify({phrase: phrase}) : null
        });
        setImage(await response.blob());
    } catch (e) {
        alert("that was bad...");
    } finally {
        setFetching(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const phraseText = event.target.value;
      if (event.target.value) {
          setPhrase(phraseText)
      } else {
          setPhrase('')
      }
  }

  return (
    <div>
      <h3>Enter a phrase, then click 'GO'!</h3>
      <div className="block">
      <input id="meme" onChange={handleChange} />
         <button id="self-meme" disabled={fetching} onClick={handleClick}>GO</button>
      </div>
      <div>&nbsp;</div>
      <div className="block">
      { image && <img src={URL.createObjectURL(image)} alt="meme" /> }
      </div>
    </div>
  );
}
