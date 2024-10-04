import React from 'react';
import { Avatar } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import './VideoCard.css';
import { Link } from 'react-router-dom';
import withHtmlDecoding from '../components/withHtmlDecoding';

function VideoCard({ video }) {
  return (
  
    <div className="videoCard">
        <Link to={`/video/${video.id}`}>
      <img 
        className="videoCard__thumbnail" 
        src={video.thumbnails.medium.url} 
        alt={video.title} 
      />
      </Link>
      <div className="videoCard__info">
        <Avatar 
          className="videoCard__avatar" 
          alt={video.channelTitle} 
          src={`https://i.pravatar.cc/150?u=${video.channelId}`}
        />
        <div className="videoCard__text">
        <Link to={`/video/${video.id}`}>
          <h4 className="videoCard__title">{video.title}</h4>
        </Link>
          <p className="videoCard__channel">{video.channelTitle}</p>
          <p className="videoCard__stats">
            {video.views} views • {formatDistanceToNow(new Date(video.publishedAt))} ago
          </p>
        </div>
      </div>
    </div>
  
  );
}

export default withHtmlDecoding(VideoCard);