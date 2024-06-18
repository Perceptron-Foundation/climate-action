import WebappButton from '../../../common/WebappButton';
import styles from './ForestProgress.module.scss';
import { useTranslations } from 'next-intl';

interface EmptyProgressProps {
  handleOpen: () => void;
}

const EmptyProgress = ({ handleOpen }: EmptyProgressProps) => {
  const tProfile = useTranslations('Profile.progressBar');
  return (
    <div className={styles.emptyProgressContainer}>
      <div className={styles.emptyProgressInformation}>
        {tProfile('emptyProgressInformation')}
      </div>
      <WebappButton
        variant="primary"
        text={tProfile('setTargets')}
        onClick={handleOpen}
        elementType="button"
      />
    </div>
  );
};

export default EmptyProgress;
