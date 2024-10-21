import React, { ReactElement, useCallback, useContext, useMemo } from 'react';
import {
  ConservationProjectConcise,
  ConservationProjectExtended,
  TreeProjectConcise,
  TreeProjectExtended,
  EcosystemTypes,
  Review,
  TreeProjectClassification,
  CountryCode,
  CurrencyCode,
} from '@planet-sdk/common';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';
import ProjectInfoSection from './microComponents/ProjectInfoSection';
import ImageSection from './microComponents/ImageSection';
import styles from './styles/ProjectSnippet.module.scss';
import { getProjectCategory } from '../../../utils/projectV2';
import TpoName from './microComponents/TpoName';
import { useLocale } from 'next-intl';
import Link from 'next/link';

interface Props {
  project:
    | TreeProjectConcise
    | ConservationProjectConcise
    | TreeProjectExtended
    | ConservationProjectExtended;
  showTooltipPopups: boolean;
  isMobile?: boolean;
  page?: 'project-list' | 'project-details';
}

type ProjectSnippetContentProps = Omit<Props, 'isMobile'>;
export interface CommonProps {
  slug: string;
  isApproved: boolean;
  isTopProject: boolean;
  allowDonations: boolean;
  purpose: 'trees' | 'conservation';
}

export interface ImageSectionProps extends CommonProps {
  projectName: string;
  image: string;
  ecosystem: EcosystemTypes | null;
  showTooltipPopups: boolean;
  projectReviews: Review[] | undefined;
  classification: TreeProjectClassification;
  page?: 'project-list' | 'project-details';
}

export interface ProjectInfoProps extends CommonProps {
  unitType: 'm2' | 'tree';
  unitCount: number | undefined;
  unitCost: number;
  country: CountryCode;
  currency: CurrencyCode;
  slug: string;
}

const ProjectSnippetContent = ({
  project,
  showTooltipPopups,
  page,
}: ProjectSnippetContentProps) => {
  const isTopProject = project.purpose === 'trees' && project.isTopProject;
  const isApproved = project.purpose === 'trees' && project.isApproved;
  const ecosystem =
    project._scope === 'map' ? project.ecosystem : project.metadata.ecosystem;
  const progressPercentage = useMemo(() => {
    if (project.purpose === 'trees' && project.countTarget) {
      return Math.min((project.countPlanted / project.countTarget) * 100, 100);
    }
    return 0;
  }, [
    project.purpose === 'trees' && project.countPlanted,
    project.countTarget,
  ]);
  const progressBarClass = useMemo(() => {
    return `${styles[getProjectCategory(project)]}`;
  }, [
    project.purpose,
    project.purpose === 'trees' && (project.isTopProject, project.isApproved),
    project.allowDonations,
  ]);

  const commonProps: CommonProps = {
    slug: project.slug,
    isApproved: isApproved,
    isTopProject: isTopProject,
    allowDonations: project.allowDonations,
    purpose: project.purpose,
  };
  const imageProps: ImageSectionProps = {
    ...commonProps,
    projectName: project.name,
    image: project.image,
    ecosystem: ecosystem,
    showTooltipPopups: showTooltipPopups,
    projectReviews: project.reviews,
    classification: (project as TreeProjectConcise).classification,
    page,
  };
  const projectInfoProps: ProjectInfoProps = {
    ...commonProps,
    unitType: project.unitType,
    unitCount:
      project.unitType === 'tree'
        ? project.unitsContributed?.tree
        : project.unitsContributed?.m2,
    unitCost: project.unitCost,
    country: project.country,
    currency: project.currency,
  };
  return (
    <>
      <ImageSection {...imageProps} />
      <div className={styles.progressBar}>
        <div
          className={`${styles.progressBarHighlight} ${progressBarClass}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <ProjectInfoSection {...projectInfoProps} />
    </>
  );
};

export default function ProjectSnippet({
  project,
  showTooltipPopups,
  isMobile,
  page,
}: Props): ReactElement {
  const { embed, callbackUrl } = useContext(ParamsContext);
  const locale = useLocale();
  const isTopProject = project.purpose === 'trees' && project.isTopProject;
  const isApproved = project.purpose === 'trees' && project.isApproved;

  const projectSnippetContainerClasses = `${styles.singleProject} ${
    page === 'project-details' && isMobile
      ? styles.projectDetailsSnippetMobile
      : ''
  }`;
  const ProjectSnippetContentProps = {
    showTooltipPopups,
    page,
    project,
  };
  const getProjectPath = useCallback(() => {
    let path = `/${locale}/prd/${project.slug}`;
    if (embed === 'true') {
      const params = new URLSearchParams({ embed: 'true' });
      if (callbackUrl !== undefined && typeof callbackUrl === 'string') {
        params.append('callback', callbackUrl);
      }
      path += `?${params.toString()}`;
    }
    return path;
  }, [page, locale, project.slug, embed, callbackUrl]);
  return (
    <>
      <div className={projectSnippetContainerClasses}>
        {page === 'project-details' ? (
          <ProjectSnippetContent {...ProjectSnippetContentProps} />
        ) : (
          <Link href={getProjectPath()} style={{ cursor: 'pointer' }}>
            <ProjectSnippetContent {...ProjectSnippetContentProps} />
          </Link>
        )}

        {!isMobile && (
          <TpoName
            projectTpoName={project.tpo.name}
            allowDonations={project.allowDonations}
            isTopProject={isTopProject}
            isApproved={isApproved}
            page={page}
            tpoSlug={project.tpo.slug}
            embed={embed}
          />
        )}
      </div>
      {isMobile && (
        <TpoName
          page={page}
          projectTpoName={project.tpo.name}
          allowDonations={project.allowDonations}
          isTopProject={isTopProject}
          isApproved={isApproved}
          tpoSlug={project.tpo.slug}
          embed={embed}
        />
      )}
    </>
  );
}
