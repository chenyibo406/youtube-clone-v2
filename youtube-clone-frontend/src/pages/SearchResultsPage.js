import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './SearchResultsPage.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import withHtmlDecoding from '../components/withHtmlDecoding';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

function SearchResultsPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    if (query) {
      setIsLoading(true);
      fetchYouTubeResults(query);
    }
  }, [location]);

  const fetchYouTubeResults = async (searchQuery) => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 10,
          q: searchQuery,
          type: 'video',
          order: 'viewCount',
          key: API_KEY
        }
      });

      const videoIds = response.data.items.map(item => item.id.videoId).join(',');
      const statsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'statistics',
          id: videoIds,
          key: API_KEY
        }
      });

      const channelIds = response.data.items.map(item => item.snippet.channelId).join(',');
      const channelResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'snippet',
          id: channelIds,
          key: API_KEY
        }
      });

      const resultsWithStats = response.data.items.map((item, index) => {
        const channelDetails = channelResponse.data.items.find(channel => channel.id === item.snippet.channelId);
        return {
          id: item.id.videoId,
          thumbnail: item.snippet.thumbnails.medium.url,
          title: item.snippet.title,
          views: statsResponse.data.items[index].statistics.viewCount,
          // uploadDate: new Date(item.snippet.publishedAt).toLocaleDateString(),
          uploadDate: item.snippet.publishedAt,
          channelName: item.snippet.channelTitle,
          channelAvatar: channelDetails.snippet.thumbnails.default.url,
          description: item.snippet.description
        };
      });

      setSearchResults(resultsWithStats);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (searchResults.length === 0) {
    return <div>No results found.</div>;
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
  
    <div className="searchResults">
      {searchResults.map((result, index) => (
     
        <div key={index} className="searchResult">
          <div className="searchResult__thumbnail">
            <Link to={`/video/${result.id}`}>
            <img src={result.thumbnail} alt={result.title} />
            </Link>
          </div>
          <div className="searchResult__info">
          <Link to={`/video/${result.id}`}>
            <h3 className="searchResult__title">{result.title}</h3>
          </Link>
            <div className="searchResult__metadata">
            <span className="searchResult__views">{formatViewCount(result.views)} views</span>
              <span className="searchResult__dot">•</span>
              <span className="searchResult__date">{formatUploadDate(result.uploadDate)}</span>
            </div>
            <div className="searchResult__channel">

            <img src={result.channelAvatar} alt={result.channelName} className="searchResult__channelAvatar" />
              <span className="searchResult__channelName">{result.channelName}</span>
              <CheckCircleIcon className="searchResult__verifiedIcon" />
            </div>
            <p className="searchResult__description">{result.description}</p>
          </div>
        </div>
   
      ))}
    </div>

  );
}


export default withHtmlDecoding(SearchResultsPage);