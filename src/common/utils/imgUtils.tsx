import noimg from "assets/img/noimg.jpg";

export function imgSrc(path: string | undefined): string {
  if (path) {
    return `${process.env.REACT_APP_IMG_PATH}${path}`;
  } else {
    return noimg;
  }
}

export function handleImgError(event: React.SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.src = noimg;
}