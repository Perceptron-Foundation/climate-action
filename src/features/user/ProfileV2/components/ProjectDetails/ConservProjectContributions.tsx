import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import ContributedProjectList from './ContributedProjectList';
import { ReactElement } from 'react';
import { TreeContributedProjectListProps } from '../../../../common/types/myForest';

type AreaConservedProjectListProps = Omit<
  TreeContributedProjectListProps,
  'userProfile' | 'restoredAreaUnit'
>;

const ConservProjectContributions = ({
  contribution,
  handleFetchNextPage,
}: AreaConservedProjectListProps): ReactElement => {
  const { t, ready } = useTranslation(['me']);

  return ready ? (
    <div className={myForestStyles.areaConservedMainContainer}>
      <div className={myForestStyles.textContainer}>
        <div className={myForestStyles.conservedAreaText}>
          <div>{t('me:areaConserved')}</div>
          <div className={myForestStyles.hrLine} />
        </div>
      </div>
      <div className={myForestStyles.areaConservedContainer}>
        <ContributedProjectList
          contributionProjectList={contribution?.pages}
          handleFetchNextPage={handleFetchNextPage}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ConservProjectContributions;
