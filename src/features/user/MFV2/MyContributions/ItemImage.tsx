import {
  GiftGivenDetails,
  GiftReceivedDetails,
} from '../../../common/types/myForestv2';
import GiftLabel from './GiftLabel';
import styles from './MyContributions.module.scss';

interface Props {
  imageUrl?: string;
  giftDetails?: GiftGivenDetails | GiftReceivedDetails;
}

const ItemImage = ({ imageUrl, giftDetails }: Props) => {
  return (
    <div
      className={styles.itemImageContainer}
      style={
        imageUrl
          ? {
              // backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4), rgba(0,0,0,0), rgba(0,0,0,0)),url(${imageUrl})`,
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }
          : undefined
      }
    >
      {giftDetails !== undefined && <GiftLabel giftDetails={giftDetails} />}
    </div>
  );
};

export default ItemImage;
