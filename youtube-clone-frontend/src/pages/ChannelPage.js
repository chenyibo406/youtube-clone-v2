import React from 'react';
import { useParams } from 'react-router-dom';

function ChannelPage() {
  const { id } = useParams();

  return (
    <div className="channelPage">
      <h1>Channel Page</h1>
      <p>Channel ID: {id}</p>
      {/* Add more channel content here */}
    </div>
  );
}

export default ChannelPage;