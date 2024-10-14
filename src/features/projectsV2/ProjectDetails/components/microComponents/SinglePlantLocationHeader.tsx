import { useTranslations } from 'next-intl';
import getImageUrl from '../../../../../utils/getImageURL';
import { formatHid } from '../../../../../utils/projectV2';
import {
  type PlantLocationSingle,
  type SamplePlantLocation,
} from '../../../../common/types/plantLocation';
import styles from '../../styles/PlantLocationInfo.module.scss';

type Props = {
  plantData: PlantLocationSingle | SamplePlantLocation;
};

function SinglePlantLocationHeader({ plantData }: Props) {
  const t = useTranslations('ProjectDetails');
  const isSamplePlant = plantData.type === 'sample-tree-registration';
  const image = plantData?.coordinates?.[0]?.image ?? '';

  return (
    <>
      <div
        className={`single-plant-location-heading ${styles.singlePlantLocationHeading}`}
      >
        <h1 className="tree-count">
          {isSamplePlant ? t('sampleTree') : t('1Tree')}
        </h1>
        <div className="hid">{formatHid(plantData?.hid)}</div>
      </div>
      {image && (
        <img
          src={getImageUrl('coordinate', 'large', image)}
          className={`single-plant-location-image ${styles.singlePlantLocationImage}`}
        />
      )}
    </>
  );
}
export default SinglePlantLocationHeader;
