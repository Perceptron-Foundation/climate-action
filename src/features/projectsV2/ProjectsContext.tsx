import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { ExtendedProject, MapProject } from '../common/types/projectv2';
import { useLocale } from 'next-intl';
import getStoredCurrency from '../../utils/countryCurrency/getStoredCurrency';
import { getRequest } from '../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../common/Layout/ErrorHandlingContext';
import {
  APIError,
  CountryCode,
  handleError,
  TreeProjectClassification,
} from '@planet-sdk/common';
import { useTenant } from '../common/Layout/TenantContext';
import { SetState } from '../common/types/common';
import { ViewMode } from '../common/Layout/ProjectsLayout/MobileProjectsLayout';
import { useTranslations } from 'next-intl';
import {
  PlantLocation,
  SamplePlantLocation,
} from '../common/types/plantLocation';
import { useRouter } from 'next/router';
import { updateUrlWithParams } from '../../utils/projectV2';

interface ProjectsState {
  projects: MapProject[] | null;
  singleProject: ExtendedProject | null;
  setSingleProject: SetState<ExtendedProject | null>;
  plantLocations: PlantLocation[] | null;
  setPlantLocations: SetState<PlantLocation[] | null>;
  selectedPlantLocation: PlantLocation | null;
  setSelectedPlantLocation: SetState<PlantLocation | null>;
  samplePlantLocation: SamplePlantLocation | null;
  setSamplePlantLocation: SetState<SamplePlantLocation | null>;
  hoveredPlantLocation: PlantLocation | SamplePlantLocation | null;
  setHoveredPlantLocation: SetState<PlantLocation | SamplePlantLocation | null>;
  selectedSite: number | null;
  setSelectedSite: SetState<number | null>;
  isLoading: boolean;
  setIsLoading: SetState<boolean>;
  isError: boolean;
  setIsError: SetState<boolean>;
  filteredProjects: MapProject[] | undefined;
  topProjects: MapProject[] | undefined;
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  debouncedSearchValue: string;
  setDebouncedSearchValue: SetState<string>;
  isSearching: boolean;
  setIsSearching: SetState<boolean>;
  selectedMode?: ViewMode;
  setSelectedMode?: SetState<ViewMode>;
}

const ProjectsContext = createContext<ProjectsState | null>(null);

type ProjectsProviderProps = {
  page: 'project-list' | 'project-details';
  currencyCode: string;
  setCurrencyCode: SetState<string>;
  selectedMode?: ViewMode;
  setSelectedMode?: SetState<ViewMode>;
};

export const ProjectsProvider: FC<ProjectsProviderProps> = ({
  children,
  page,
  currencyCode,
  setCurrencyCode,
  selectedMode,
  setSelectedMode,
}) => {
  const [projects, setProjects] = useState<MapProject[] | null>(null);
  const [singleProject, setSingleProject] = useState<ExtendedProject | null>(
    null
  );
  const [plantLocations, setPlantLocations] = useState<PlantLocation[] | null>(
    null
  );
  const [selectedPlantLocation, setSelectedPlantLocation] =
    useState<PlantLocation | null>(null);
  const [samplePlantLocation, setSamplePlantLocation] =
    useState<SamplePlantLocation | null>(null);
  const [hoveredPlantLocation, setHoveredPlantLocation] = useState<
    PlantLocation | SamplePlantLocation | null
  >(null);
  const [selectedClassification, setSelectedClassification] = useState<
    TreeProjectClassification[]
  >([]);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSite, setSelectedSite] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { setErrors } = useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();
  const locale = useLocale();
  const tCountry = useTranslations('Country');
  const router = useRouter();
  const { ploc: requestedPlantLocation, site: requestedSite } = router.query;
  //* Function to filter projects based on classification
  const filterByClassification = useCallback(
    (projects: MapProject[]) => {
      if (selectedClassification.length === 0) return projects;
      return projects.filter((project) => {
        if (project.properties.purpose === 'trees')
          return selectedClassification.includes(
            project.properties.classification
          );
      });
    },
    [selectedClassification]
  );

  const topProjects = useMemo(
    () =>
      projects?.filter((projects) => {
        if (projects.properties.purpose === 'trees')
          return projects.properties.isTopProject === true;
      }),
    [projects]
  );

  const getSearchProjects = useCallback(
    (projects: MapProject[] | null, keyword: string) => {
      if (!keyword?.trim()) {
        return [];
      }

      const normalizedKeyword = keyword
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

      const filteredProjects = projects?.filter((project: MapProject) => {
        const normalizedText = (text: string | undefined | null) => {
          return text
            ? text
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
            : '';
        };

        const projectName = normalizedText(project.properties.name);
        const projectLocation =
          project.properties.purpose === 'trees'
            ? normalizedText(project.properties.location)
            : '';
        const tpoName = normalizedText(project.properties.tpo.name);
        const country = normalizedText(
          tCountry(
            project.properties.country.toLowerCase() as Lowercase<CountryCode>
          )
        );
        return (
          projectName.includes(normalizedKeyword) ||
          projectLocation.includes(normalizedKeyword) ||
          tpoName.includes(normalizedKeyword) ||
          country.includes(normalizedKeyword)
        );
      });
      return filteredProjects;
    },
    []
  );

  const filteredProjects = useMemo(() => {
    let result = projects || [];

    if (selectedClassification?.length > 0)
      result = filterByClassification(result);

    if (debouncedSearchValue)
      result = getSearchProjects(result, debouncedSearchValue) || result;

    return result;
  }, [projects, selectedClassification, debouncedSearchValue]);

  useEffect(() => {
    async function loadProjects() {
      if (page !== 'project-list' || !currencyCode) {
        return;
      }
      if (projects !== null) {
        return;
      }
      setIsLoading(true);
      setIsError(false);

      try {
        const fetchedProjects = await getRequest<MapProject[]>(
          tenantConfig.id,
          `/app/projects`,
          {
            _scope: 'map',
            currency: currencyCode,
            tenant: tenantConfig.id,
            'filter[purpose]': 'trees,conservation',
            locale: locale,
          }
        );
        setProjects(fetchedProjects);
      } catch (err) {
        setErrors(handleError(err as APIError));
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, [currencyCode, locale, page]);
  useEffect(() => {
    if (!currencyCode) {
      const currency = getStoredCurrency();
      setCurrencyCode(currency);
    }
  }, [currencyCode, setCurrencyCode]);

  useEffect(() => {
    setDebouncedSearchValue('');
    if (page === 'project-details') {
      if (setSelectedMode) setSelectedMode('list');
      setIsSearching(false);
      setSelectedClassification([]);
    } else {
      setSelectedPlantLocation(null);
      setSingleProject(null);
      setHoveredPlantLocation(null);
      setSelectedSite(0);
    }
  }, [page]);

  const pushWithShallow = (pathname: string, queryParams = {}) => {
    router.push({ pathname, query: queryParams }, undefined, {
      shallow: true,
    });
  };
  const pathname = `/${locale}/prd/${singleProject?.slug}`;
  const updateUrlWithSiteId = (siteId: string) => {
    const updatedQueryParams = updateUrlWithParams(
      router.asPath,
      router.query,
      siteId
    );
    pushWithShallow(pathname, updatedQueryParams);
  };
  // Helper function to set the selected site and update the URL with the corresponding site ID
  const updateSiteAndUrl = (index: number) => {
    setSelectedSite(index);
    const siteId = singleProject?.sites?.[index].properties.id;
    if (siteId) updateUrlWithSiteId(siteId);
  };
  useEffect(() => {
    if (
      !router.isReady ||
      (plantLocations && plantLocations?.length === 0) ||
      page !== 'project-details' ||
      selectedSite !== null ||
      (requestedPlantLocation && requestedSite)
    )
      return;

    // Handle the case where a direct link requests a specific plant location (via URL query).
    // This will update the ploc param based on the requestedPlantLocation. If the requested hid is invalid,
    // it falls back to the default (first) site.
    if (requestedPlantLocation && selectedPlantLocation === null) {
      const result = plantLocations?.find(
        (plantLocation) => plantLocation.hid === requestedPlantLocation
      );
      if (result) {
        setSelectedPlantLocation(result);
      } else {
        updateSiteAndUrl(0);
      }
    }

    // Handles updating the URL with the 'ploc' parameter when a user selects a different plant location.
    if (selectedPlantLocation) {
      const updatedQueryParams = { ploc: selectedPlantLocation.hid };
      pushWithShallow(pathname, updatedQueryParams);
    }
  }, [
    page,
    requestedPlantLocation,
    router.isReady,
    selectedPlantLocation,
    selectedSite,
  ]);

  useEffect(() => {
    if (
      !router.isReady ||
      !singleProject ||
      page !== 'project-details' ||
      selectedPlantLocation !== null
    )
      return;

    // Handle the case where a direct link requests a specific site (via URL query)
    // This will update the site param based on the requestedSite. If the requested site ID is invalid,
    // it falls back to the default (first) site.
    if (requestedSite && selectedSite === null) {
      const index = singleProject.sites?.findIndex(
        (site) => site.properties.id === requestedSite
      );
      if (index !== undefined) updateSiteAndUrl(index !== -1 ? index : 0);
      return;
    }

    //Handle the case where user manually selects a site from the site list on the project detail page
    if (selectedSite) {
      updateSiteAndUrl(selectedSite);
      return;
    }

    //If the user navigates to the project detail page from the project list (no specific site selected)
    // This defaults to the first site and updates the URL accordingly.
    if (!requestedPlantLocation) updateSiteAndUrl(0);
  }, [
    page,
    selectedSite,
    singleProject?.sites,
    requestedSite,
    router.isReady,
    selectedPlantLocation,
  ]);

  const value: ProjectsState | null = useMemo(
    () => ({
      projects,
      isLoading,
      setIsLoading,
      isError,
      setIsError,
      filteredProjects,
      debouncedSearchValue,
      setDebouncedSearchValue,
      isSearching,
      setIsSearching,
      topProjects,
      selectedClassification,
      setSelectedClassification,
      selectedMode,
      setSelectedMode,
      singleProject,
      setSingleProject,
      plantLocations,
      setPlantLocations,
      selectedPlantLocation,
      setSelectedPlantLocation,
      hoveredPlantLocation,
      setHoveredPlantLocation,
      samplePlantLocation,
      setSamplePlantLocation,
      selectedSite,
      setSelectedSite,
    }),
    [
      projects,
      isLoading,
      isError,
      filteredProjects,
      isSearching,
      topProjects,
      selectedClassification,
      debouncedSearchValue,
      selectedMode,
      singleProject,
      plantLocations,
      selectedPlantLocation,
      samplePlantLocation,
      hoveredPlantLocation,
      selectedSite,
    ]
  );

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsState => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('ProjectsContext must be used within ProjectsProvider');
  }
  return context;
};
