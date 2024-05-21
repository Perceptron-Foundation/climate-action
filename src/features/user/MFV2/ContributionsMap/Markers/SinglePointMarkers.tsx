import { Marker } from 'react-map-gl-v7';
import { useMemo } from 'react';
import RegisteredTreeIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/RegisteredTreeIcon';
import NaturalRegeneration from '../../../../../../public/assets/images/icons/myForestV2Icons/NaturalRegeneration';
import Mangroves from '../../../../../../public/assets/images/icons/myForestV2Icons/Mangroves';
import ManagedRegeneration from '../../../../../../public/assets/images/icons/myForestV2Icons/ManagedRegeneration';
import Agroforestry from '../../../../../../public/assets/images/icons/myForestV2Icons/Agroforestry';
import UrbanRestoration from '../../../../../../public/assets/images/icons/myForestV2Icons/UrbanRestoration';
import Conservation from '../../../../../../public/assets/images/icons/myForestV2Icons/Conservation';
import TreePlanting from '../../../../../../public/assets/images/icons/myForestV2Icons/TreePlanting';
import OtherPlanting from '../../../../../../public/assets/images/icons/myForestV2Icons/OtherPlanting';
import themeProperties from '../../../../../theme/themeProperties';
import { AnyProps, PointFeature } from 'supercluster';
import {
  MyContributionsSingleRegistration,
  DonationGeojson,
} from '../../../../common/types/myForestv2';

type Classification =
  | 'natural-regeneration'
  | 'mangroves'
  | 'managed-regeneration'
  | 'agroforestry'
  | 'urban-planting'
  | 'conservation'
  | 'large-scale-planting'
  | 'other-planting';
interface ProjectTypeIconProps {
  purpose: string;
  classification: Classification;
}

const ProjectTypeIcon = ({ purpose, classification }: ProjectTypeIconProps) => {
  const getMarkerColor = (purpose: string) => {
    switch (purpose) {
      case 'conservation':
        return `${themeProperties.mediumBlue}`;
      case 'restoration':
        return `${themeProperties.electricPurple}`;
      default:
        return `${themeProperties.primaryDarkColorX}`;
    }
  };
  const Markercolor = useMemo(() => getMarkerColor(purpose), [purpose]);
  const IconProps = {
    width: 68,
    color: Markercolor,
  };

  switch (classification) {
    case 'natural-regeneration':
      return <NaturalRegeneration {...IconProps} />;
    case 'mangroves':
      return <Mangroves {...IconProps} />;
    case 'managed-regeneration':
      return <ManagedRegeneration {...IconProps} />;
    case 'agroforestry':
      return <Agroforestry {...IconProps} />;
    case 'urban-planting':
      return <UrbanRestoration {...IconProps} />;
    case 'conservation':
      return <Conservation {...IconProps} />;
    case 'large-scale-planting':
      return <TreePlanting {...IconProps} />;
    case 'other-planting':
      return <OtherPlanting {...IconProps} />;
    default:
      return null;
  }
};

interface SinglePointMarkersProps {
  superclusterResponse: PointFeature<AnyProps>;
}

const SinglePointMarkers = ({
  superclusterResponse,
}: SinglePointMarkersProps) => {
  if (!superclusterResponse) return null;
  const { coordinates } = superclusterResponse.geometry;
  const { type, projectInfo } = superclusterResponse.properties;
  return (
    <Marker longitude={coordinates[0]} latitude={coordinates[1]}>
      {type === 'registration' ? (
        <RegisteredTreeIcon />
      ) : (
        <ProjectTypeIcon
          purpose={projectInfo.purpose}
          classification={projectInfo.classification}
        />
      )}
    </Marker>
  );
};

export default SinglePointMarkers;
