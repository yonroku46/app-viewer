import ClothesSpriteSVG from "assets/icon/clothes_sprite.svg";

interface ClothesSpriteProps {
  id: string;
  color?: string;
  size?: number;
}

const ClothesSprite: React.FC<ClothesSpriteProps> = ({ id, color, size = 65 }) => (
  <svg fill={color} width={size} height={size}>
    <use href={`${ClothesSpriteSVG}#${id}`}/>
  </svg>
);

export default ClothesSprite;