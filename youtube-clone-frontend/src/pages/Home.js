import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import { fetchVideos } from '../services/youtubeApi';
import { client as sanityClient } from '../services/sanityClient';
import '../styles/VideoGrid.css';
import './Home.css'; // Make sure to create this CSS file


const filters = ['All', 'Music', 'Gaming', 'News', 'Live', 'Comedy', 'Sports', 'Education', 'Technology'];
function Home() {
  const [videos, setVideos] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    // Here you would typically fetch new videos based on the filter
    // For now, we'll just simulate a refresh by doing nothing
  };

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const youtubeVideos = await fetchVideos();
        const sanityVideos = await sanityClient.fetch(`*[_type == "video"] | order(publishedAt desc) [0...5]`);
        
        const combinedVideos = youtubeVideos.map(video => {
          const sanityVideo = sanityVideos.find(sv => sv.videoId === video.id.videoId);
          return {
            ...video.snippet,
            views: sanityVideo?.views || 0,
            id: video.id.videoId,
          };
        });
  
        setVideos(combinedVideos);
      } catch (error) {
        console.error('Error loading videos:', error);
        if (error.response && error.response.data) {
          console.error('API Error:', error.response.data);
        }
        // Set an error state or show a user-friendly error message
        setVideos([]);
        // Optionally, set an error state here if you want to display an error message to the user
        // setError('Failed to load videos. Please try again later.');
      }
    };
  
    loadVideos();
  }, []);

  return (
    <div className="main-content">
    <div className="home">
    <div className="filter-bar">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-item ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      <div className="home__videos video-grid">
        {videos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
    </div>
  );
}

export default Home;