import Map from 'react-map-gl-v7/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NavigationControl } from 'react-map-gl-v7/maplibre';
import { useRef, MutableRefObject } from 'react';
import { useProjectsMap } from '../ProjectsMapContext';
import MultipleProjectsView from './MultipleProjectsView';
import { useProjects } from '../ProjectsContext';
import { SetState } from '../../common/types/common';
import { ViewMode } from '../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import MobileControls from './microComponents/MobileControls';
import SingleProjectView from './SingleProjectView';
import ProjectSiteDropdown from './ProjectSiteDropDown';

type ProjectsMapMobileProps = {
  selectedMode: ViewMode;
  setSelectedMode: SetState<ViewMode>;
  isMobile: true;
  page: 'project-list' | 'project-details';
};

type ProjectsMapDesktopProps = {
  isMobile: false;
  page: 'project-list' | 'project-details';
};

type ProjectsMapProps = ProjectsMapMobileProps | ProjectsMapDesktopProps;

function ProjectsMap(props: ProjectsMapProps) {
  const mapRef: MutableRefObject<null> = useRef(null);
  const { viewState, setViewState, mapState } = useProjectsMap();
  const {
    projects,
    topProjects,
    selectedClassification,
    filteredProjects,
    setSelectedClassification,
    debouncedSearchValue,
    setDebouncedSearchValue,
    isSearching,
    setIsSearching,
    singleProject,
    selectedSite,
    setSelectedSite,
  } = useProjects();
  const topProjectCount = topProjects?.length;
  const projectCount = projects?.length;
  const projectListControlProps = {
    projectCount,
    topProjectCount,
    selectedClassification,
    setSelectedClassification,
    debouncedSearchValue,
    setDebouncedSearchValue,
    selectedMode: props.isMobile ? props.selectedMode : undefined,
    setSelectedMode: props.isMobile ? props.setSelectedMode : undefined,
    filteredProjects,
    isMobile: props.isMobile,
    isSearching,
    setIsSearching,
    page: props.page,
  };
  const siteDropdownProps = {
    selectedSite,
    setSelectedSite,
    projectSites: singleProject?.sites,
  };
  const hasMoreThanOneSite =
    singleProject?.sites && singleProject?.sites?.length > 1;
  return (
    <>
      <MobileControls {...projectListControlProps} />
      {props.page === 'project-details' && hasMoreThanOneSite && (
        <ProjectSiteDropdown {...siteDropdownProps} />
      )}
      <Map
        {...viewState}
        {...mapState}
        onMove={(e) => setViewState(e.viewState)}
        attributionControl={false}
        ref={mapRef}
        interactiveLayerIds={
          singleProject !== null ? ['polygon-layer', 'point-layer'] : undefined
        }
      >
        {singleProject && <SingleProjectView mapRef={mapRef} />}
        {projects && !singleProject && (
          <MultipleProjectsView setViewState={setViewState} mapRef={mapRef} />
        )}
        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>
    </>
  );
}

export default ProjectsMap;
