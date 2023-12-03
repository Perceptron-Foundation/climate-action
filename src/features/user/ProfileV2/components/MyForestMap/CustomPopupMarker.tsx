import { Popup } from 'react-map-gl';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { CustomPopupMarkerProps } from '../../../../common/types/map';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import { InfoInthePopUp } from '../MicroComponents/PopUp';

const CustomPopupMarker = ({ geoJson, showPopUp }: CustomPopupMarkerProps) => {
  const { isConservedButtonActive, isTreePlantedButtonActive } = useUserProps();
  return (
    <div className={MyForestMapStyle.singleMarkerContainer}>
      {showPopUp && (isConservedButtonActive || isTreePlantedButtonActive) ? (
        <Popup
          className={MyForestMapStyle.mapboxglPopup}
          latitude={Number(geoJson.geometry.coordinates[1])}
          longitude={Number(geoJson?.geometry.coordinates[0])}
          offsetTop={-15}
          offsetLeft={20}
          anchor="bottom"
          closeButton={false}
        >
          <InfoInthePopUp geoJson={geoJson} />
        </Popup>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomPopupMarker;
