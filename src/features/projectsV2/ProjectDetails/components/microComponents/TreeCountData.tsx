import { localizedAbbreviatedNumber } from '../../../../../utils/getFormattedNumber';
import styles from '../../styles/PlantLocationInfo.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { formatHid } from '../../utils';

interface Props {
  plHid: string | undefined;
  totalTreesCount: number;
  plantedLocationArea: number;
}

const TreePlantedData = ({
  plHid,
  totalTreesCount,
  plantedLocationArea,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const locale = useLocale();
  return (
    <div className={styles.treeCountWrapper}>
      <div className={styles.treeCount}>
        {tProjectDetails.rich('totalPlantedSpecies', {
          count: totalTreesCount,
          formattedCount: localizedAbbreviatedNumber(
            locale,
            Number(totalTreesCount),
            1
          ),
          area: plantedLocationArea.toFixed(3),
          areaContainer: (chunks) => <span>{chunks}</span>,
        })}
      </div>
      <div className={styles.hid}>{formatHid(plHid)}</div>
    </div>
  );
};

export default TreePlantedData;
