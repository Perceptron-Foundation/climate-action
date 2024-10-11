import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './styles/ProjectListControls.module.scss';
import ProjectListTabForMobile from './microComponents/ProjectListTabForMobile';
import { SearchAndFilter } from './microComponents/ProjectSearchAndFilter';
import ViewModeTabs from './microComponents/ViewModeTabs';
import ClassificationDropDown from './microComponents/ClassificationDropDown';
import ActiveSearchField from './microComponents/ActiveSearchField';
import { TreeProjectClassification } from '@planet-sdk/common';
import { SetState } from '../../common/types/common';
import { ProjectTabs } from '.';
import { MapProject } from '../../common/types/projectv2';
import { ViewMode } from '../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import MapFeatureExplorer from '../ProjectsMap/MapFeatureExplorer';
import { MapOptions } from '../ProjectsMapContext';

interface ProjectListControlForMobileProps {
  projectCount: number | undefined;
  topProjectCount: number | undefined;
  tabSelected?: ProjectTabs;
  setTabSelected?: SetState<ProjectTabs>;
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  debouncedSearchValue: string;
  setDebouncedSearchValue: SetState<string>;
  isSearching: boolean;
  setIsSearching: SetState<boolean>;
  selectedMode: ViewMode | undefined;
  setSelectedMode: SetState<ViewMode> | undefined;
  isMobile: boolean;
  filteredProjects: MapProject[] | undefined;
  mapOptions: MapOptions;
  updateMapOption: (option: keyof MapOptions, value: boolean) => void;
}

const ProjectListControlForMobile = ({
  projectCount,
  topProjectCount,
  filteredProjects,
  tabSelected,
  setTabSelected,
  debouncedSearchValue,
  setDebouncedSearchValue,
  selectedClassification,
  setSelectedClassification,
  selectedMode,
  setSelectedMode,
  isMobile,
  isSearching,
  setIsSearching,
  mapOptions,
  updateMapOption,
}: ProjectListControlForMobileProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const tAllProjects = useTranslations('AllProjects');

  const hasFilterApplied = selectedClassification.length > 0;
  const shouldDisplayFilterResults = hasFilterApplied && selectedMode !== 'map';
  const shouldDisplayProjectListTab =
    !hasFilterApplied && selectedMode !== 'map';
  const shouldDisplayMapFeatureExplorer = selectedMode === 'map';
  const projectListControlsMobileClasses = `${
    styles.projectListControlsMobile
  } ${selectedMode === 'map' ? styles.mapModeControls : ''}`;

  const activeSearchFieldProps = {
    setIsFilterOpen,
    setIsSearching,
    debouncedSearchValue,
    setDebouncedSearchValue,
  };
  const viewModeTabsProps = {
    setIsFilterOpen,
    isSearching,
    setSelectedMode,
    selectedMode,
  };
  const tabProps = {
    projectCount,
    topProjectCount,
    tabSelected,
    setTabSelected,
    setIsFilterOpen,
  };
  const listControlProps = {
    hasFilterApplied,
    isFilterOpen,
    setIsFilterOpen,
    isSearching,
    setIsSearching,
    isMobile,
    selectedMode,
  };

  const classificationDropDownProps = {
    selectedClassification,
    setSelectedClassification,
    isMobile,
    selectedMode,
    filteredProjects,
  };
  return (
    <>
      {isSearching ? (
        <div className={styles.searchFieldAndViewTabsContainer}>
          <ActiveSearchField {...activeSearchFieldProps} />
          <ViewModeTabs {...viewModeTabsProps} />
        </div>
      ) : (
        <div className={projectListControlsMobileClasses}>
          {shouldDisplayFilterResults &&
            filteredProjects &&
            filteredProjects?.length > 0 && (
              <div className={styles.filterResultContainerMobile}>
                {tAllProjects('filterResult', {
                  count: filteredProjects?.length,
                })}
              </div>
            )}
          {shouldDisplayProjectListTab && (
            <ProjectListTabForMobile {...tabProps} />
          )}
          <SearchAndFilter {...listControlProps} />
          {shouldDisplayMapFeatureExplorer && (
            <MapFeatureExplorer
              mapOptions={mapOptions}
              updateMapOption={updateMapOption}
            />
          )}
          <ViewModeTabs {...viewModeTabsProps} />
        </div>
      )}
      {isFilterOpen && !isSearching && (
        <ClassificationDropDown {...classificationDropDownProps} />
      )}
    </>
  );
};

export default ProjectListControlForMobile;
