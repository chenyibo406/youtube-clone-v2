import React, { useState, useEffect } from 'react';
import { client as sanityClient } from '../services/sanityClient';
import VideoCard from '../components/VideoCard';

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const result = await sanityClient.fetch(`
          *[_type == "channel" && subscribed == true] {
            name,
            profileImageUrl,
            subscriberCount
          }
        `);
        setSubscriptions(result);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };

    const fetchVideos = async () => {
      try {
        const result = await sanityClient.fetch(`
          *[_type == "video" && references(*[_type == "channel" && subscribed == true]._id)] | order(publishedAt desc) [0...20] {
            title,
            description,
            thumbnailUrl,
            views,
            likes,
            publishedAt,
            "channelName": channel->name,
            "channelImageUrl": channel->profileImageUrl
          }
        `);
        setVideos(result);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchSubscriptions();
    fetchVideos();
  }, []);

  return (
    <div className="subscriptions">
      <h1>Subscriptions</h1>
      <div className="subscriptions__channels">
        {subscriptions.map((channel, index) => (
          <div key={index} className="subscription__channel">
            <img src={channel.profileImageUrl} alt={channel.name} className="channel__image" />
            <p>{channel.name}</p>
          </div>
        ))}
      </div>
      <div className="subscriptions__videos">
        {videos.map((video, index) => (
          <VideoCard key={index} video={video} />
        ))}
      </div>
    </div>
  );
}

export default Subscriptions;