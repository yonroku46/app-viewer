import noimg from "assets/img/noimg.jpg";

export function imgSrc(path: string | undefined): string {
  const externalKey = 'https';
  if (path) {
    return path.includes(externalKey) ? path : `${process.env.REACT_APP_IMG_PATH}/${path}`;
  } else {
    return noimg;
  }
}

export function handleImgError(event: React.SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.src = noimg;
}