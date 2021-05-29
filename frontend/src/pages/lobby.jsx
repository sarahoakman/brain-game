import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api.jsx';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Grow from '@material-ui/core/Grow';
import LinearProgress from '@material-ui/core/LinearProgress';
import { createApi } from 'unsplash-js';
import styles from './game.module.css';

// get instance of unsplash api
const unsplash = createApi({
  accessKey: 'pBLSegxU5ZhdU1BqZNq5isNZRRjAyxYL9Ja9xAEk0P4'
});

// ids of collections to use for images
const listImageId = ['531563', '1368747', '2203755', '225', '540518', '2489501', '789734', '827743', '1538150', '2254180', '1767181', '357786', '291422', '1166960', '428621', '1793372', '545337', '1074434', '1673600', '1717137']

// render the lobby page
export default function Lobby () {
  // change the background styling
  document.body.style.background = 'linear-gradient(to right top, #fcc35b, #ffb368, #ffa578, #ff998b, #ff929c, #fd89a7, #f681b5, #ea7dc4, #d676d3, #b873e3, #8b74f2, #3377ff) no-repeat';
  // set up the variables
  const params = useParams();
  const [quotes, setQuotes] = useState([]);
  const [images, setImages] = useState([]);
  const [next, setNext] = useState(true);
  const [index, setIndex] = useState(0);
  const [indexImage, setIndexImage] = useState(0);
  // set up the page
  useEffect(async () => {
    // get random index for listImageId
    const randomImage = listImageId[Math.floor(Math.random() * listImageId.length)];
    // get images from unsplash with random collection
    unsplash.collections.getPhotos({
      collectionId: randomImage,
      perPage: 50,
      orientation: 'landscape'
    }).then(res => {
      setImages(res)
    });
    // get quotes for the lobby page
    fetch('https://type.fit/api/quotes')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setQuotes(data);
      });
    // go to game page if started
    const checkStatus = async () => {
      const checkGame = await api.getStatus(params.id);
      if (checkGame.started) {
        window.location = '/game/' + params.id;
      } else if (checkGame.error) {
        window.location = '/player/results/' + params.id;
      }
    }
    // get the next quote and image
    const getQuotes = () => {
      setNext(false);
      setTimeout(() => {
        setNext(true);
        setIndex((prev) => prev + 1);
        setIndexImage((prev) => prev + 1);
      }, 1000);
    }
    // interval to show new quotes every 10s
    const showQuotes = setInterval(getQuotes, 10000);
    // interval to check if game has started
    const interval = setInterval(checkStatus, 1000);
    return () => {
      clearInterval(interval);
      clearInterval(showQuotes);
    }
  }, []);

  // go through first 30 questions and repeat when done
  function getIndex () {
    return indexImage % 30;
  }
  // wait for quotes and images to be fetched
  if (quotes.length === 0 || !images.response) return null;
  return (
    <Grow
      in={true}
      style={{ transformOrigin: '0 0 0' }}
      {...(next ? { timeout: 1000 } : {})}
    >
      <div className={styles.lobbyContainer}>
        <div className={styles.lobbyFlex}>
          <HourglassEmptyIcon style={{ padding: '10px' }}/>
          <LinearProgress style={{ width: '200px' }}color='secondary'/>
        </div>
        <h2>GAME COMING SOON!</h2>
        <p>Enjoy some quotes while you&apos;re waiting...</p>
        <Grow
          in={next}
          style={{ transformOrigin: '0 0 0' }}
          {...(next ? { timeout: 1000 } : {})}
        >
          <img
            className={styles.lobbyImage}
            src={images.response.results[getIndex()].urls.small}
            alt='unsplash photo'
          />
        </Grow>
        <Grow
          in={next}
         style={{ transformOrigin: '0 0 0' }}
          {...(next ? { timeout: 1000 } : {})}
        >
          <h3>{quotes[index].text}</h3>
        </Grow>
        <Grow
          in={next}
          style={{ transformOrigin: '0 0 0' }}
          {...(next ? { timeout: 3000 } : {})}
        >
          <p style={{ marginBottom: '50px' }}>
            <i>{quotes[index].author}</i>
          </p>
        </Grow>
      </div>
    </Grow>
  );
}
