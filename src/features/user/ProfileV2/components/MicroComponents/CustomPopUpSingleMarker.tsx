import { Popup } from 'react-map-gl';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { CustomPopupMarkerProps } from '../../../../common/types/map';
import { DonationPopUp, RegisteredTreePopUp } from '../MicroComponents/PopUp';

const CustomPopUpSingleMarker = ({
  geoJson,
  showPopUp,
  profile,
  onMouseEnter,
  onMouseLeave,
}: CustomPopupMarkerProps) => {
  return (
    <div className={MyForestMapStyle.singleMarkerContainer}>
      {showPopUp ? (
        <Popup
          className={MyForestMapStyle.mapboxglPopup}
          latitude={parseInt(`${geoJson.geometry.coordinates[1]}`)}
          longitude={parseInt(`${geoJson.geometry.coordinates[0]}`)}
          closeButton={false}
          tipSize={geoJson.properties.contributionType === 'planting' ? 10 : 0}
        >
          {geoJson.properties.contributionType === 'planting' ? (
            <RegisteredTreePopUp
              geoJson={geoJson}
              onMouseLeave={onMouseLeave}
            />
          ) : (
            <DonationPopUp
              startDate={
                geoJson?.properties?.created || geoJson?.properties?.startDate
              }
              endDate={geoJson?.properties?.endDate}
              country={
                geoJson?.properties?.plantProject?.country.toLowerCase() ||
                geoJson?.properties?.project?.country.toLowerCase()
              }
              projectName={
                geoJson?.properties?.plantProject?.name ||
                geoJson?.properties?.project?.name
              }
              projectImage={
                geoJson?.properties?.plantProject?.image ||
                geoJson?.properties?.project?.image
              }
              numberOfTrees={
                parseInt(`${geoJson.properties.quantity}`) ||
                parseFloat(geoJson?.properties?.quantity?.toFixed(10))
              }
              totalContribution={Number(geoJson.properties.totalContributions)}
              projectId={
                geoJson?.properties?.plantProject?.guid ||
                geoJson?.properties?.project?.id
              }
              tpoName={
                geoJson?.properties?.plantProject?.tpo.name ||
                geoJson?.properties?.project?.organization.name
              }
              profile={profile}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          )}
        </Popup>
      ) : (
        <></>
      )}
    </div>
  );
};
export default CustomPopUpSingleMarker;
