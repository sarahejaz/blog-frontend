export function stringAvatar(name) {
  if (/\s/.test(name))
    return `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`;
  else return name[0];
}

export function getDescriptionOfContent(content, maxWords) {
  const allWords = content.split(' ');
  let desc = '';

  if (allWords.length > maxWords) {
    for (let i = 0; i < maxWords; i++) {
      desc = desc + allWords[i] + ' ';
    }
  } else {
    desc = content;
  }
  if (desc[desc.length - 1] === ' ') desc = desc.slice(0, -1);
  desc = desc + '...';

  return desc;
}

export function getFormattedDate(date) {
  return new Date(date * 1000).toDateString();
}
