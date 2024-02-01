import { Marker } from 'react-map-gl';
import { useState, ReactElement } from 'react';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { SingleMarkerProps } from '../../../../common/types/map';
import SingleMarkerImageContainer from '../MicroComponents/SingleMarkerImageContainer';
import SingleMarkerUnits from '../MicroComponents/SingleMarkerUnits';
import CustomPopUpSingleMarker from '../MicroComponents/CustomPopUpSingleMarker';

const SingleMarker = ({
  geoJson,
  profile,
}: SingleMarkerProps): ReactElement => {
  const [showPopUp, setShowPopUp] = useState(false);

  const handleMarkerMouseOver = () => {
    setShowPopUp(true);
  };

  const handleMarkerMouseLeave = () => {
    setShowPopUp(false);
  };

  return (
    <>
      <CustomPopUpSingleMarker
        geoJson={geoJson}
        showPopUp={showPopUp}
        profile={profile}
        onMouseEnter={handleMarkerMouseOver}
        onMouseLeave={handleMarkerMouseLeave}
      />
      {geoJson?.geometry.coordinates[1] !== null && (
        <Marker
          latitude={Number(geoJson?.geometry.coordinates[1])}
          longitude={Number(geoJson?.geometry.coordinates[0])}
        >
          <div
            className={MyForestMapStyle.markerContainer}
            onMouseEnter={handleMarkerMouseOver}
            onMouseLeave={
              geoJson?.properties?.contributionType === 'planting'
                ? handleMarkerMouseLeave
                : undefined
            }
          >
            <SingleMarkerImageContainer
              isNormalTreeDonation={
                geoJson.properties?.plantProject?.unitType === 'tree'
              }
              isRegisteredTree={
                geoJson?.properties?.contributionType === 'planting'
              }
              isRestorationTreePlantation={
                geoJson.properties?.plantProject?.unitType === 'm2' &&
                geoJson.properties?.purpose === 'trees'
              }
              isConservation={geoJson.properties?.purpose === 'conservation'}
              isGiftContribution={
                geoJson.properties?.purpose === 'trees' &&
                geoJson.properties?._type === 'gift'
              }
              isMergeContribution={
                geoJson.properties._type === 'merged_contribution_and_gift'
              }
            />
            <SingleMarkerUnits
              isConservation={geoJson.properties?.purpose === 'conservation'}
              isRestorationTreePlantation={
                geoJson.properties?.plantProject?.unitType === 'm2'
              }
              units={
                geoJson.properties.totalTrees ||
                parseInt(geoJson.properties.quantity) ||
                parseFloat(geoJson.properties.quantity.toFixed(10)) ||
                0
              }
              isRegisteredTree={
                geoJson?.properties?.contributionType === 'planting'
              }
              isNormalTreeDonation={
                geoJson.properties?.plantProject?.unitType === 'tree'
              }
              isGiftContribution={geoJson?.properties?._type === 'gift'}
              isMergeContribution={
                geoJson.properties._type === 'merged_contribution_and_gift'
              }
            />
          </div>
        </Marker>
      )}
    </>
  );
};

export default SingleMarker;
