import React from 'react';

const ProxiedIframe = ({ url }) => {
  debugger;
  const proxyUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(url)}`;

  return (
    <iframe
      src={proxyUrl}
      style={{ 
        border: 'none',
        width: "100vw",
        height: "100vh",
       }}
      title="Proxied Content"
    />
  );
};

export default ProxiedIframe;
