import { useContext } from 'react';
import { useRouter } from 'next/router';
import { useTranslations, useLocale } from 'next-intl';
import type { ImageSectionProps } from '..';
import getImageUrl from '../../../../utils/getImageURL';
import ProjectBadge from './ProjectBadge';
import ProjectTypeIcon from '../../../common/ProjectTypeIcon';
import { truncateString } from '../../../../utils/getTruncatedString';
import CustomTooltip from '../../../common/Layout/CustomTooltip';
import VerifiedIcon from '@mui/icons-material/Verified';
import TopProjectReports from '../../../projects/components/projectDetails/TopProjectReports';
import styles from '../styles/ProjectSnippet.module.scss';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';

const ImageSection = (props: ImageSectionProps) => {
  const {
    projectName,
    image,
    ecosystem,
    showTooltipPopups,
    projectReviews,
    purpose,
    classification,
    isApproved,
    isTopProject,
    allowDonations,
    page,
    setSelectedSite,
    setPreventShallowPush,
  } = props;
  const tManageProjects = useTranslations('ManageProjects');
  const tDonate = useTranslations('Donate');
  const router = useRouter();
  const locale = useLocale();
  const { embed, callbackUrl } = useContext(ParamsContext);
  const isEmbed = embed === 'true';

  const handleBackButton = () => {
    if (setPreventShallowPush) setPreventShallowPush(true);
    setSelectedSite(null);
    const previousPageRoute = sessionStorage.getItem('backNavigationUrl');
    const defaultRoute = `/${locale}/prd`;
    const queryParams = {
      ...(isEmbed ? { embed: 'true' } : {}),
      ...(isEmbed && callbackUrl !== undefined
        ? { callback: callbackUrl }
        : {}),
    };
    const routerPath = previousPageRoute
      ? previousPageRoute.split('?')[0]
      : defaultRoute;

    const isAbsoluteUrl =
      previousPageRoute &&
      (previousPageRoute.includes('http://') ||
        previousPageRoute.includes('https://'));
    const finalQueryParams = isAbsoluteUrl ? {} : queryParams;
    router
      .push({
        pathname: routerPath,
        query: finalQueryParams,
      })
      .then(() => sessionStorage.removeItem('backNavigationUrl'))
      .catch((error) => {
        console.error('Navigation failed:', error);
      });
  };

  const imageSource = image ? getImageUrl('project', 'medium', image) : '';
  const imageContainerClasses = `${styles.projectImage} ${
    page === 'project-details' ? styles.projectImageSecondary : ''
  }`;
  return (
    <div className={imageContainerClasses}>
      {page === 'project-details' && (
        <button onClick={handleBackButton} className={styles.backButton}>
          <BackButton />
        </button>
      )}
      <ProjectBadge
        isApproved={isApproved}
        allowDonations={allowDonations}
        isTopProject={isTopProject}
        showTooltipPopups={showTooltipPopups}
      />
      {image && typeof image !== 'undefined' ? (
        <>
          <img
            alt={'projectImage'}
            src={imageSource}
            width={'fit-content'}
            className={styles.projectImageFile}
          />
          <div className={styles.gradientOverlay} />
        </>
      ) : null}

      <div className={styles.projectImageBlock}>
        <div className={styles.projectEcosystemOrTypeContainer}>
          <div className={styles.projectTypeIcon}>
            <ProjectTypeIcon
              projectType={
                purpose === 'conservation' ? 'conservation' : classification
              }
            />
          </div>
          <div>
            {ecosystem !== null && (
              <div className={styles.projectEcosystem}>
                {tManageProjects(`ecosystemTypes.${ecosystem}`)}
                {' /'}
              </div>
            )}
            <div className={styles.projectType}>
              {classification && tDonate(classification)}
            </div>
          </div>
        </div>
        <div className={styles.projectName}>
          {truncateString(projectName, 30)}
          {isApproved && (
            <CustomTooltip
              showTooltipPopups={showTooltipPopups}
              triggerElement={
                <span className={styles.verifiedIcon}>
                  <VerifiedIcon sx={{ width: '100%' }} />
                </span>
              }
            >
              <div className={styles.topProjectReportsContainer}>
                <TopProjectReports projectReviews={projectReviews} />
              </div>
            </CustomTooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSection;
