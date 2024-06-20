import { Popup } from 'react-map-gl-v7';
import { PointFeature } from 'supercluster';
import style from '../MyForestV2.module.scss';
import { SetState } from '../../../../common/types/common';
import ProjectInfoSection from './ProjectInfoSection';
import ContributionInfoList from './ContributionInfoList';
import PopupImageSection from './PopupImageSection';
import { DonationProperties } from '../../../../common/Layout/MyForestContextV2';

interface DonationPopupProps {
  superclusterResponse: PointFeature<DonationProperties>;
  setShowPopUp: SetState<boolean>;
  pageType: 'public' | 'private';
  supportedTreecounter: string | undefined;
}

const DonationPopup = ({
  superclusterResponse,
  setShowPopUp,
  pageType,
  supportedTreecounter,
}: DonationPopupProps) => {
  if (!superclusterResponse) return null;
  const { coordinates } = superclusterResponse.geometry;
  const ProjectInfoSectionProps = {
    superclusterResponse,
    pageType,
    supportedTreecounter,
  };
  return (
    <Popup
      latitude={coordinates[1]}
      longitude={coordinates[0]}
      className={style.contributionPopup}
      offset={30}
      closeButton={false}
    >
      <div
        className={style.donationPopupContainer}
        onMouseOver={() => setShowPopUp(true)}
        onMouseLeave={() => setShowPopUp(false)}
      >
        <PopupImageSection superclusterResponse={superclusterResponse} />
        <ProjectInfoSection {...ProjectInfoSectionProps} />
        <ContributionInfoList superclusterResponse={superclusterResponse} />
      </div>
    </Popup>
  );
};

export default DonationPopup;
