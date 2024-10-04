import React, { useState, useEffect } from 'react';
import { client as sanityClient } from '../services/sanityClient';

function Shorts() {
  const [shorts, setShorts] = useState([]);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const result = await sanityClient.fetch(`
          *[_type == "short"] | order(publishedAt desc) [0...10] {
            title,
            videoUrl,
            thumbnailUrl,
            views,
            likes,
            "creator": creator->name
          }
        `);
        setShorts(result);
      } catch (error) {
        console.error('Error fetching shorts:', error);
      }
    };

    fetchShorts();
  }, []);

  return (
    <div className="shorts">
      <h1>YouTube Shorts</h1>
      <div className="shorts__container">
        {shorts.map((short, index) => (
          <div key={index} className="short__card">
            <img src={short.thumbnailUrl} alt={short.title} className="short__thumbnail" />
            <h3>{short.title}</h3>
            <p>{short.creator}</p>
            <p>{short.views} views • {short.likes} likes</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shorts;