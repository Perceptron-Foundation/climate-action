import ProjectSiteDropdown from './ProjectSiteDropDown';
import ProjectListControlForMobile from '../ProjectListControls/ProjectListControlForMobile';
import { useProjectsMap } from '../ProjectsMapContext';
import { useProjects } from '../ProjectsContext';
import LayerIcon from '../../../../public/assets/images/icons/LayerIcon';
import LayerDisabled from '../../../../public/assets/images/icons/LayerDisabled';
import CrossIcon from '../../../../public/assets/images/icons/projectV2/CrossIcon';
import styles from '../ProjectsMap/ProjectsMap.module.scss';
import { ViewMode } from '../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import { SetState } from '../../common/types/common';

interface MapControlsProps {
  isMobile: boolean;
  selectedMode: ViewMode | undefined;
  setSelectedMode: SetState<ViewMode> | undefined;
  page: 'project-list' | 'project-details';
}

const MapControls = ({
  isMobile,
  selectedMode,
  setSelectedMode,
  page,
}: MapControlsProps) => {
  const { setIsSatelliteView, isSatelliteView, updateMapOption, mapOptions } =
    useProjectsMap();
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
    selectedPlantLocation,
    setSelectedPlantLocation,
  } = useProjects();
  const hasProjectSites =
    singleProject?.sites?.length !== undefined &&
    singleProject?.sites?.length > 1;
  const siteDropdownProps = {
    selectedSite,
    setSelectedSite,
    projectSites: singleProject?.sites,
    selectedPlantLocation,
    setSelectedPlantLocation,
  };
  const projectListControlProps = {
    ...siteDropdownProps,
    projectCount: projects?.length,
    topProjectCount: topProjects?.length,
    filteredProjects,
    selectedClassification,
    setSelectedClassification,
    debouncedSearchValue,
    setDebouncedSearchValue,
    selectedMode,
    setSelectedMode,
    isMobile,
    isSearching,
    setIsSearching,
    page,
    hasProjectSites,
    mapOptions,
    updateMapOption,
  };
  const isProjectDetailsPage = page === 'project-details';
  return (
    <>
      {isMobile && page === 'project-list' && (
        <div className={styles.projectListControlsContainer}>
          <ProjectListControlForMobile {...projectListControlProps} />
        </div>
      )}
      {isProjectDetailsPage && (
        <>
          {isMobile ? (
            <div className={styles.projectDetailsControlsContainer}>
              {hasProjectSites && (
                <ProjectSiteDropdown {...siteDropdownProps} />
              )}
              <button
                onClick={() => setSelectedMode && setSelectedMode('list')}
              >
                <CrossIcon width={18} />
              </button>
            </div>
          ) : (
            <>
              {hasProjectSites && (
                <ProjectSiteDropdown {...siteDropdownProps} />
              )}
            </>
          )}
          <button
            className={styles.layerToggle}
            onClick={() => setIsSatelliteView(!isSatelliteView)}
          >
            {isSatelliteView ? <LayerIcon /> : <LayerDisabled />}
          </button>
        </>
      )}
    </>
  );
};

export default MapControls;
