window.irma_keyshare_webclient = {
  keyshare_server_url: 'http://localhost:8080/irma_keyshare_server/api/v1',
  irma_server_url: 'http://localhost:8088',
};

let config = {};
if (window !== undefined)
  config = window.irma_keyshare_webclient;

export default config;