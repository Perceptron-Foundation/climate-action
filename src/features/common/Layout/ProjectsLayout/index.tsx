import { FC } from 'react';
import styles from './ProjectsLayout.module.scss';
import Credits from '../../../projects/components/maps/Credits';
import { SetState } from '../../types/common';
import ProjectsMap from './ProjectsMap';
import { ProjectsProvider } from '../../../projectsV2/ProjectsContext';
import { ProjectsMapProvider } from '../../../projectsV2/ProjectsMapContext';

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
  return (
    <ProjectsProvider
      page={page}
      currencyCode={currencyCode}
      setCurrencyCode={setCurrencyCode}
    >
      <ProjectsMapProvider>
        <div className={styles.projectsLayout}>
          <main className={styles.mainContent}>
            <section className={styles.contentContainer}>{children}</section>
            <section className={styles.mapContainer}>
              <ProjectsMap />
            </section>
          </main>
          <Credits setCurrencyCode={setCurrencyCode} />
        </div>
      </ProjectsMapProvider>
    </ProjectsProvider>
  );
};

export default ProjectsLayout;
