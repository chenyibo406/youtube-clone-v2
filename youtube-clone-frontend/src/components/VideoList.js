import React, { useState, useEffect } from 'react'
import sanityClient from '../sanityClient'

function VideoList() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "video"]{
        title,
        description,
        thumbnailUrl,
        views,
        "channelName": channel->name
      }`)
      .then((data) => setVideos(data))
      .catch(console.error)
  }, [])

  return (
    <div>
      {videos.map((video) => (
        <div key={video._id}>
          <h2>{video.title}</h2>
          <p>{video.description}</p>
          <img src={video.thumbnailUrl} alt={video.title} />
          <p>Views: {video.views}</p>
          <p>Channel: {video.channelName}</p>
        </div>
      ))}
    </div>
  )
}

export default VideoList