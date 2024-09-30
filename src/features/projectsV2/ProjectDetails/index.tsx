import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProjectSnippet from '../ProjectSnippet';
import { useProjects } from '../ProjectsContext';
import ProjectInfo from './components/ProjectInfo';
import { getRequest } from '../../../utils/apiRequests/api';
import { useTenant } from '../../common/Layout/TenantContext';
import { useLocale } from 'next-intl';
import { handleError, APIError, ClientError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import styles from './ProjectDetails.module.scss';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { PlantLocation } from '../../common/types/plantLocation';
import PlantLocationInfo from './components/PlantLocationInfo';
import { ExtendedProject } from '../../common/types/projectv2';
import { updateUrlWithParams } from '../../../utils/projectV2';
import SamplePlantInfo from './components/SamplePlantInfo';

const ProjectDetails = ({
  currencyCode,
  isMobile,
}: {
  currencyCode: string;
  isMobile: boolean;
}) => {
  const {
    singleProject,
    selectedSite,
    setSingleProject,
    setPlantLocations,
    setIsLoading,
    setIsError,
    setSelectedMode,
    selectedPlantLocation,
    hoveredPlantLocation,
    selectedSamplePlantLocation,
    setSelectedSamplePlantLocation,
  } = useProjects();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();
  const locale = useLocale();
  const router = useRouter();
  const {
    p: projectSlug,
    ploc: requestedPlantLocation,
    site: requestedSite,
  } = router.query;

  useEffect(() => {
    async function loadProject(
      projectSlug: string,
      locale: string,
      currency: string
    ) {
      setIsLoading(true);
      setIsError(false);
      try {
        const fetchedProject = await getRequest<ExtendedProject>(
          tenantConfig.id,
          `/app/projects/${projectSlug}`,
          {
            _scope: 'extended',
            currency: currency,
            locale: locale,
          }
        );
        const { purpose } = fetchedProject;
        if (purpose === 'conservation' || purpose === 'trees') {
          setSingleProject(fetchedProject);
        } else {
          throw new ClientError(404, {
            error_type: 'project_not_available',
            error_code: 'project_not_available',
          });
        }
      } catch (err) {
        setErrors(handleError(err as APIError | ClientError));
        setIsError(true);
        redirect('/');
      } finally {
        setIsLoading(false);
      }
    }

    if (typeof projectSlug === 'string' && currencyCode)
      loadProject(projectSlug, locale, currencyCode);
  }, [projectSlug, locale, currencyCode]);

  useEffect(() => {
    async function loadPlantLocations() {
      setIsLoading(true);
      try {
        const result = await getRequest<PlantLocation[]>(
          tenantConfig.id,
          `/app/plantLocations/${singleProject?.id}`,
          {
            _scope: 'extended',
          },
          '1.0.4'
        );
        setPlantLocations(result);
      } catch (err) {
        setErrors(handleError(err as APIError | ClientError));
        setIsError(true);
        redirect('/');
      } finally {
        setIsLoading(false);
      }
    }
    if (singleProject && singleProject?.purpose === 'trees')
      loadPlantLocations();
  }, [singleProject]);
  // add  project site query
  useEffect(() => {
    const projectSites = singleProject?.sites;
    if (!projectSites) {
      return;
    }
    if (!router.isReady) return;
    const pushWithShallow = (pathname: string, queryParams = {}) => {
      router.push({ pathname, query: queryParams }, undefined, {
        shallow: true,
      });
    };

    // case 1: Update url with the selected site  param
    // case 2: Update url with the selected site  param if both params are present in the url (i.e ploc, site)
    if (selectedSite !== null || (requestedPlantLocation && requestedSite)) {
      const pathname = `/${locale}/prd/${singleProject.slug}`;
      const siteId = projectSites[selectedSite ?? 0].properties.id;
      const updatedQueryParams = updateUrlWithParams(
        router.asPath,
        router.query,
        siteId
      );
      pushWithShallow(pathname, updatedQueryParams);
      return;
    }

    // Update url with the selected plant location  param
    if (selectedPlantLocation) {
      const pathname = `/${locale}/prd/${singleProject.slug}`;
      const updatedQueryParams = { ploc: selectedPlantLocation.hid };
      pushWithShallow(pathname, updatedQueryParams);
    }
  }, [
    singleProject,
    selectedSite,
    selectedPlantLocation,
    locale,
    router.isReady,
    requestedPlantLocation,
    requestedSite,
  ]);
  const shouldShowPlantLocationInfo = hoveredPlantLocation
    ? hoveredPlantLocation
    : selectedPlantLocation && !selectedSamplePlantLocation && !isMobile;
  const shouldShowSamplePlantInfo =
    !hoveredPlantLocation && selectedSamplePlantLocation && !isMobile;
  const shouldShowProjectInfo =
    !hoveredPlantLocation &&
    !selectedPlantLocation &&
    !selectedSamplePlantLocation;

  // clean up sample plant location when plant location change
  useEffect(() => {
    if (selectedSamplePlantLocation)
      return setSelectedSamplePlantLocation(null);
  }, [selectedPlantLocation?.hid]);

  return singleProject ? (
    <div className={styles.projectDetailsContainer}>
      <ProjectSnippet
        project={singleProject}
        showTooltipPopups={false}
        isMobile={isMobile}
        page="project-details"
      />
      {shouldShowSamplePlantInfo && (
        <SamplePlantInfo samplePlantData={selectedSamplePlantLocation} />
      )}
      {shouldShowPlantLocationInfo && (
        <PlantLocationInfo
          plantLocationInfo={
            hoveredPlantLocation ? hoveredPlantLocation : selectedPlantLocation
          }
        />
      )}
      {shouldShowProjectInfo && (
        <ProjectInfo
          project={singleProject}
          isMobile={isMobile}
          setSelectedMode={setSelectedMode}
        />
      )}
    </div>
  ) : (
    <Skeleton className={styles.projectDetailsSkeleton} />
  );
};

export default ProjectDetails;
