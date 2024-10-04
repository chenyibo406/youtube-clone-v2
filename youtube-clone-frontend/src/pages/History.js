import React from 'react';

function VideoCard({ video }) {
  return (
    <div className="col">
      <div className="card h-100 video-card">
        <img src={video.thumbnail} className="card-img-top" alt={video.title} />
        <div className="card-body">
          <h5 className="card-title">{video.title}</h5>
          <p className="card-text">{video.channelTitle}</p>
          <p className="card-text">
            <small className="text-muted">{video.views} views • {video.publishedAt}</small>
          </p>
        </div>
        <div className="play-all position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-50 text-white p-2 rounded d-none">
          <i className="bi bi-play-fill"></i> Play All
        </div>
      </div>
    </div>
  );
}

export default VideoCard;