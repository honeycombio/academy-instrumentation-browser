import { useState } from "react";

export default function SelfMeminator() {

  const [image, setImage] = useState<Blob | null>(null);
  const [phrase, setPhrase] = useState<string>('');
  const [valid, setValid] = useState<boolean>(false);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fetchMeme();
  };

  const fetchMeme = async () => {
    const response = await fetch('/api/createPicture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phrase: phrase })
    });
    setImage(await response.blob());
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const phraseText = event.target.value;
      if (event.target.value) {
          setValid(true);
          setPhrase(phraseText)
      } else {
          setValid(false);
          setPhrase('')
      }
  }

  return (
    <div>
      <h3>Enter a phrase, then click 'GO'!</h3>
      <div className="block">
      <input id="meme" onChange={handleChange} />
         <button id="self-meme" disabled={!valid} onClick={handleClick}>GO</button>
      </div>
      <div>&nbsp;</div>
      <div className="block">
      { image && <img src={URL.createObjectURL(image)} alt="meme" /> }
      </div>
    </div>
  );
}
