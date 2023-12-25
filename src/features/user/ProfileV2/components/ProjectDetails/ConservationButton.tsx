import {
  ConservationTreeSvg,
  DownWardArrowSvg,
  ArrowSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import theme from '../../../../../theme/themeProperties';

export interface ConservationButtonProps {
  conservedArea: number | null | undefined;
}

const ConservationButton = ({
  conservedArea,
}: ConservationButtonProps): ReactElement => {
  const { lightBlueColor, light } = theme;
  const {
    isConservedButtonActive,
    setIsConservedButtonActive,
    setIsTreePlantedButtonActive,
  } = useUserProps();
  const { t } = useTranslation(['donate']);

  const handleClick = () => {
    if (isConservedButtonActive) {
      setIsConservedButtonActive(false);
    } else {
      if (conservedArea && conservedArea > 0) {
        setIsTreePlantedButtonActive(false);
        setIsConservedButtonActive(true);
      }
    }
  };
  return (
    <div
      className={`${
        isConservedButtonActive
          ? myForestStyles.conservedAreaButtonContainerActive
          : myForestStyles.conservedAreaButtonContainer
      }`}
      onClick={handleClick}
    >
      <>
        <div className={myForestStyles.labelContainer}>
          <div className={myForestStyles.conservedSvg}>
            <ConservationTreeSvg
              color={
                isConservedButtonActive ? `${light.light}` : `${lightBlueColor}`
              }
            />
          </div>
          <div className={myForestStyles.conservedLabel}>
            {t('donate:conservation')}
          </div>
        </div>
        <div className={myForestStyles.conservedAreaValue}>
          <div className={myForestStyles.value}>
            {conservedArea ? conservedArea : 0}
          </div>
          <div className={myForestStyles.unit}>{'m²'}</div>
          {conservedArea !== null &&
            conservedArea !== undefined &&
            conservedArea > 0 && (
              <div className={myForestStyles.svgContainer}>
                {isConservedButtonActive ? (
                  <DownWardArrowSvg color={`${light.light}`} />
                ) : (
                  <ArrowSvg color={`${lightBlueColor}`} />
                )}
              </div>
            )}
        </div>
      </>
    </div>
  );
};

export default ConservationButton;
