import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProjectSnippet from '../ProjectSnippet';
import { ProjectExtend, useProjects } from '../ProjectsContext';
import ProjectInfoSection from './components/ProjectInfoSection';
import { getRequest } from '../../../utils/apiRequests/api';
import { useTenant } from '../../common/Layout/TenantContext';
import { useLocale } from 'next-intl';
import { handleError, APIError, ClientError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import styles from './ProjectDetails.module.scss';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProjectDetails = ({
  currencyCode,
  isMobile,
}: {
  currencyCode: string;
  isMobile: boolean;
}) => {
  const {
    singleProject,
    setSingleProject,
    setIsLoading,
    setIsError,
    setSelectedMode,
    setSelectedClassification,
    setDebouncedSearchValue,
  } = useProjects();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (setSelectedMode) setSelectedMode('list');
    setSelectedClassification([]);
    setDebouncedSearchValue('');
  }, []);

  useEffect(() => {
    async function loadProject() {
      setIsLoading(true);
      setIsError(false);
      try {
        const { p } = router.query;
        const fetchedProject = await getRequest<ProjectExtend>(
          tenantConfig.id,
          `/app/projects/${p}`,
          {
            _scope: 'extended',
            currency: currencyCode,
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

    if (router.query.p && currencyCode) loadProject();
  }, [router.query.p, locale, currencyCode]);

  return singleProject ? (
    <div className={styles.projectDetailsContainer}>
      <ProjectSnippet
        project={singleProject}
        showTooltipPopups={false}
        showBackButton={true}
        isMobile={isMobile}
        page="project-details"
      />
      <ProjectInfoSection
        project={singleProject}
        isMobile={isMobile}
        setSelectedMode={setSelectedMode}
      />
    </div>
  ) : (
    <Skeleton className={styles.projectInfoSkeleton} />
  );
};

export default ProjectDetails;
