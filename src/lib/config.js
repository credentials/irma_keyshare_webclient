export default () => {
  if (window !== undefined)
    return window.irma_keyshare_webclient;

  return {
    language: 'nl',
  }
}