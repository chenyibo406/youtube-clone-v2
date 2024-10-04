import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Avatar, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './VideoPage.css';
import { Divider } from '@mui/material';
import { formatDistanceToNow, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;


function VideoPage() {
    const { videoId } = useParams();
    const [videoDetails, setVideoDetails] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
 
    useEffect(() => {
        if (videoId) {
          fetchVideoDetails(videoId);
          fetchRelatedVideos(videoId);
        }
      }, [videoId]);

      const fetchVideoDetails = async (id) => {
        try {
            console.log('Fetching details for video ID:', id);
          const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
              part: 'snippet,statistics',
              id: id,
              key: API_KEY
            }
          });
          console.log('API response:', response.data);
    
          if (response.data.items.length > 0) {
            const videoData = response.data.items[0];
            setVideoDetails({
              id: videoData.id,
              title: videoData.snippet.title,
              views: videoData.statistics.viewCount,
              likes: videoData.statistics.likeCount,
            //   uploadDate: new Date(videoData.snippet.publishedAt).toLocaleDateString(),
              uploadDate: videoData.snippet.publishedAt,
              channelName: videoData.snippet.channelTitle,
              description: videoData.snippet.description,
            });
          }
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching video details:', error);
          setIsLoading(false);
        }
      };

      const fetchRelatedVideos = async (id, title) => {
        try {
            console.log('Fetching related videos for:', title);
          const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                type: 'video',
                maxResults: 10,
                q: title,
                key: API_KEY
            }
          });
          console.log('Related videos response:', response.data);
       
    
          const relatedVideoIds = response.data.items.map(item => item.id.videoId).join(',');
          const statsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
              part: 'statistics',
              id: relatedVideoIds,
              key: API_KEY
            }
          });

          const relatedVideosWithStats = response.data.items
      .filter(item => item.id.videoId !== id) // Remove the current video from results
      .map((item, index) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelName: item.snippet.channelTitle,
        views: statsResponse.data.items[index].statistics.viewCount,
        uploadDate: new Date(item.snippet.publishedAt).toLocaleDateString()
      }));

    setRelatedVideos(relatedVideosWithStats);
  } catch (error) {
    console.error('Error fetching related videos:', error.response ? error.response.data : error.message);
  }
};


      if (isLoading) {
        return <div>Loading...</div>;
      }
    
      if (!videoDetails) {
        return <div>Video not found</div>;
      }

      function formatViewCount(viewCount) {
        const count = parseInt(viewCount, 10);
        if (count >= 1000000000) {
          return Math.floor(count / 1000000000) + 'B';
        } else if (count >= 1000000) {
          return Math.floor(count / 1000000) + 'M';
        } else if (count >= 1000) {
          return Math.floor(count / 1000) + 'K';
        } else {
          return '';
        }
      }

    function formatUploadDate(uploadDate) {
        const now = new Date();
        const uploadDateTime = new Date(uploadDate);
        const daysDiff = differenceInDays(now, uploadDateTime);
        const monthsDiff = differenceInMonths(now, uploadDateTime);
        const yearsDiff = differenceInYears(now, uploadDateTime);

        if (daysDiff < 30) {
            return formatDistanceToNow(uploadDateTime, { addSuffix: true });
        } else if (monthsDiff < 12) {
            return `${monthsDiff} ${monthsDiff === 1 ? 'month' : 'months'} ago`;
        } else {
            return `${yearsDiff} ${yearsDiff === 1 ? 'year' : 'years'} ago`;
        }
        }

  return (
    <div className="videoPage">
      <div className="videoPage__left">
        <div className="videoPage__player">
          <iframe
            width="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={videoDetails.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <h1 className="videoPage__title">{videoDetails.title}</h1>
        <div className="videoPage__interaction">
          <div className="videoPage__channelInfo">
            <Avatar className="videoPage__avatar" alt={videoDetails.channelName} src={`https://i.pravatar.cc/40?u=${videoDetails.id}`} />
            <div className="videoPage__channelText">
              <h2>{videoDetails.channelName}</h2>
              <p>{videoDetails.subscribers}</p>
            </div>
            <button className="videoPage__subscribeButton">Subscribe</button>
          </div>
          <div className="videoPage__buttons">
            {/* <Button variant="contained" className="videoPage__joinButton">Join</Button> */}
         
            <div className="videoPage__likeButtons">
                <div className="videoPage__thumbUp_box">
              <IconButton className="videoPage__thumbUp ">
                <ThumbUpIcon style={{ fontSize: 20 }} />
                <span>{formatViewCount(videoDetails.likes)}</span>
              </IconButton>
              </div>
              <div className="videoPage__dividerWrapper">
                <Divider orientation="vertical" flexItem className="videoPage__divider" />
              </div>
              <div className="videoPage__thumbDown_box">
              <IconButton className="videoPage__thumbDown ">
                <ThumbDownIcon style={{ fontSize: 20 }} />
              </IconButton>
              </div>
            </div>
            <div className="videoPage__shareButtons_box">
              <IconButton className="videoPage__shareButton">
                <ShareIcon style={{ fontSize: 20 }} />
                <span>Share</span>
              </IconButton>
            </div>
            <div className="videoPage__moreButtons_box">
              <IconButton className="videoPage__moreButton">
                <MoreVertIcon />
            </IconButton>
            </div>
          </div>
        </div>
        <div className="videoPage__description">
        <p>{formatViewCount(videoDetails.views)} views &nbsp; {formatUploadDate(videoDetails.uploadDate)}</p>
            <p>{videoDetails.description}</p>
        </div>
      </div>
      <div className="videoPage__right">
        {relatedVideos.map((relatedVideo) => (
          <div key={relatedVideo.id} className="videoPage__relatedVideo">
            <img src={relatedVideo.thumbnail} alt={relatedVideo.title} className="videoPage__relatedThumbnail" />
            <div className="videoPage__relatedInfo">
              <h3>{relatedVideo.title}</h3>
              <p>{relatedVideo.channelName}</p>
              <p>{formatViewCount(relatedVideo.views)} views • {formatUploadDate(relatedVideo.uploadDate)}</p>
            </div>
            <IconButton className="videoPage__relatedMoreButton" style={{ padding: 0, alignSelf: 'flex-start' }}>
              <MoreVertIcon />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoPage;