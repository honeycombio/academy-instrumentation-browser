import { useState } from "react";
// To extend active sessions based on our session definition: First, we have to import the `updateExpireTime` function from the `session-management.ts`.
// We're importing it here because this is where the "GO" button is.
import {updateExpireTime} from './session-management';

export default function Meminator() {

  const [image, setImage] = useState<Blob | null>(null);
  const [phrase, setPhrase] = useState<string>('');
  const [fetching, setFetching] = useState<boolean>(false);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Then, we call the `updateExpireTime` function when the "GO" button is clicked to extend the session expiration time.
    // After defining sessions, rerun the app in the root directory. Then see the defined sessions in Honeycomb.
    updateExpireTime();
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
