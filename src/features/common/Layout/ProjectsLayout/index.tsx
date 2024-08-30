import { FC, useMemo } from 'react';
import styles from './ProjectsLayout.module.scss';
import Credits from '../../../projects/components/maps/Credits';
import { SetState } from '../../types/common';
import ProjectsMap from '../../../projectsV2/ProjectsMap';
import { ProjectsProvider } from '../../../projectsV2/ProjectsContext';
import { ProjectsMapProvider } from '../../../projectsV2/ProjectsMapContext';
import { useRouter } from 'next/router';
import { useUserProps } from '../UserPropsContext';

interface ProjectsLayoutProps {
  currencyCode: string;
  setCurrencyCode: SetState<string>;
  page: 'project-list' | 'project-details';
}

const ProjectsLayout: FC<ProjectsLayoutProps> = ({
  children,
  currencyCode,
  setCurrencyCode,
  page,
}) => {
  const { query } = useRouter();
  const { isImpersonationModeOn } = useUserProps();

  const layoutClass = useMemo(() => {
    if (query.embed === 'true') return styles.embedMode;
    if (isImpersonationModeOn) return styles.impersonationMode;
    return styles.projectsLayout;
  }, [isImpersonationModeOn, query.embed]);

  return (
    <ProjectsProvider
      page={page}
      currencyCode={currencyCode}
      setCurrencyCode={setCurrencyCode}
    >
      <ProjectsMapProvider>
        <div className={layoutClass}>
          <main className={styles.mainContent}>
            <section className={styles.contentContainer}>{children}</section>
            <section className={styles.mapContainer}>
              <ProjectsMap isMobile={false} page={page} />
            </section>
          </main>
          <Credits setCurrencyCode={setCurrencyCode} />
        </div>
      </ProjectsMapProvider>
    </ProjectsProvider>
  );
};

export default ProjectsLayout;
