import noimg from "../../assets/img/noimg.jpg";

export function imgSrc(path: string): string {
  return `${process.env.REACT_APP_IMG_PATH}${path}`;
}

export function handleImgError(event: React.SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.src = noimg;
}