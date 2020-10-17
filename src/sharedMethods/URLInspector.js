exports.validateURL = (url) => {
  if (url) {
    console.log('validateURL rec:' + url);
    if (!url.startsWith('https://')) url = 'https://'.concat(url);
    if (
      !url.startsWith('https://www.instagram.com/p/') &&
      !url.startsWith('https://www.instagram.com/reel/')
    )
      return false;
    try {
      let validate_url = new URL(url);
      return url;
    } catch (_) {
      return false;
    }
  } else return false;
};

exports.extractURL = (text) => {
  let link = text.substr(
    text.indexOf('https://www.instagram.com/p/') > -1
      ? text.indexOf('https://www.instagram.com/p/')
      : text.indexOf('https://www.instagram.com/reel/'),
  );
  link = link.substr(
    0,
    link.indexOf(' ') > -1 ? link.indexOf(' ') : link.length,
  );
  return link;
};
