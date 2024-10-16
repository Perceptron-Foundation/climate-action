import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { NavigationControl } from 'react-map-gl-v7/maplibre';
import { useCallback, useState } from 'react';
import { useRef, MutableRefObject } from 'react';
import { useProjectsMap } from '../ProjectsMapContext';
import MultipleProjectsView from './MultipleProjectsView';
import SingleProjectView from './SingleProjectView';
import { getPlantLocationInfo } from '../../../utils/projectV2';
import MapControls from './MapControls';
import { useProjects } from '../ProjectsContext';
import { ViewMode } from '../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import { SetState } from '../../common/types/common';
import MultiPlantLocationInfo from '../ProjectDetails/components/MultiPlantLocationInfo';
import SinglePlantLocationInfo from '../ProjectDetails/components/SinglePlantLocationInfo';
import { PlantLocationSingle } from '../../common/types/plantLocation';

export type ProjectsMapDesktopProps = {
  isMobile: false;
  page: 'project-list' | 'project-details';
};
export type ProjectsMapMobileProps = {
  selectedMode: ViewMode;
  setSelectedMode: SetState<ViewMode>;
  isMobile: true;
  page: 'project-list' | 'project-details';
};
export type ProjectsMapProps = ProjectsMapMobileProps | ProjectsMapDesktopProps;

function ProjectsMap(props: ProjectsMapProps) {
  const mapRef: MutableRefObject<null> = useRef(null);
  const { viewState, setViewState, mapState, mapOptions } = useProjectsMap();
  const [isOnSampleMarker, setIsOnSampleMarker] = useState(false);
  const {
    plantLocations,
    setHoveredPlantLocation,
    setSelectedPlantLocation,
    setSelectedSite,
    setSelectedSamplePlantLocation,
  } = useProjects();
  const {
    projects,
    singleProject,
    selectedPlantLocation,
    selectedSamplePlantLocation,
  } = useProjects();

  const shouldShowSingleProjectsView =
    singleProject !== null && props.page === 'project-details';
  const shouldShowMultipleProjectsView =
    mapOptions.showProjects &&
    projects &&
    projects.length > 0 &&
    !shouldShowSingleProjectsView;
  const shouldShowMultiPlantLocationInfo =
    props.isMobile &&
    selectedSamplePlantLocation === null &&
    selectedPlantLocation?.type === 'multi-tree-registration';
  const shouldShowSinglePlantLocationInfo =
    props.isMobile &&
    (selectedSamplePlantLocation !== null ||
      selectedPlantLocation?.type === 'single-tree-registration');
  const shouldShowNavigationControls = !(
    shouldShowMultiPlantLocationInfo || shouldShowSinglePlantLocationInfo
  );

  const mapControlProps = {
    selectedMode: props.isMobile ? props.selectedMode : undefined,
    setSelectedMode: props.isMobile ? props.setSelectedMode : undefined,
    isMobile: props.isMobile,
    page: props.page,
  };

  const onMouseMove = useCallback(
    (e) => {
      if (props.page !== 'project-details') return;
      const hoveredPlantLocation = getPlantLocationInfo(
        plantLocations,
        mapRef,
        e.point
      );
      if (
        !hoveredPlantLocation ||
        hoveredPlantLocation.hid === selectedPlantLocation?.hid
      ) {
        setHoveredPlantLocation(null);
        return;
      }
      setHoveredPlantLocation(hoveredPlantLocation);
    },
    [plantLocations, props.page, selectedPlantLocation]
  );

  const onClick = useCallback(
    (e) => {
      if (props.page !== 'project-details') return;
      const result = getPlantLocationInfo(plantLocations, mapRef, e.point);
      const isClickedOnSamePlantLocation =
        result?.geometry.type === 'Point' &&
        result.id === selectedPlantLocation?.id &&
        singleProject?.slug;

      //Clear the sample plant state if the parent plant location (polygon) is selected
      if (isOnSampleMarker === false) setSelectedSamplePlantLocation(null);

      //Clear plant location info (single-tree-registration) if it is clicked twice
      if (isClickedOnSamePlantLocation) {
        setSelectedSite(0);
        setSelectedPlantLocation(null);
        return;
      }
      if (result) {
        setSelectedSite(null);
        setSelectedPlantLocation(result);
      }
    },
    [plantLocations, props.page, selectedPlantLocation, isOnSampleMarker]
  );

  const singleProjectViewProps = {
    mapRef,
    setIsOnSampleMarker,
  };
  const multipleProjectsViewProps = {
    mapRef,
    setViewState,
  };
  return (
    <>
      <MapControls {...mapControlProps} />
      <Map
        {...viewState}
        {...mapState}
        onMove={(e) => setViewState(e.viewState)}
        onMouseMove={onMouseMove}
        onMouseOut={() => setHoveredPlantLocation(null)}
        onClick={onClick}
        attributionControl={false}
        ref={mapRef}
        interactiveLayerIds={
          singleProject !== null
            ? ['plant-polygon-layer', 'point-layer']
            : undefined
        }
      >
        {shouldShowSingleProjectsView && (
          <SingleProjectView {...singleProjectViewProps} />
        )}
        {shouldShowMultipleProjectsView && (
          <MultipleProjectsView {...multipleProjectsViewProps} />
        )}
        {shouldShowNavigationControls && (
          <NavigationControl
            position="bottom-right"
            showCompass={false}
            style={{
              position: 'relative',
              bottom: props.isMobile ? '120px' : '0px',
            }}
          />
        )}
      </Map>
      {shouldShowMultiPlantLocationInfo && (
        <MultiPlantLocationInfo
          plantLocationInfo={selectedPlantLocation}
          isMobile={props.isMobile}
          setSelectedSamplePlantLocation={setSelectedSamplePlantLocation}
        />
      )}
      {shouldShowSinglePlantLocationInfo && (
        <SinglePlantLocationInfo
          plantData={
            selectedSamplePlantLocation ||
            (selectedPlantLocation as PlantLocationSingle)
          }
          isMobile={props.isMobile}
          setSelectedSamplePlantLocation={setSelectedSamplePlantLocation}
        />
      )}
    </>
  );
}

export default ProjectsMap;
