import { useEffect, useContext, useState, ReactElement } from 'react';
import myForestStyles from '../../../ProfileV2/styles/MyForest.module.scss';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import PlantedTreesButton from '../ProjectDetails/PlantedTreesButton';
import ConservationButton from '../ProjectDetails/ConservationButton';
import DonationInfo from '../ProjectDetails/DonationInfo';
import TreeContributedProjectList from '../ProjectDetails/TreeContributedProjectList';
import { trpc } from '../../../../../utils/trpc';
import AreaConservedProjectList from '../ProjectDetails/AreaConservedProjectList';
import { useProjectProps } from '../../../../common/Layout/ProjectPropsContext';
import { Purpose } from '../../../../../utils/constants/myForest';
import { Contributions } from '../../../../common/types/myForest';
import { QueryResult } from '../../../../../server/router/myForest';
import { MyTreesProps } from '../../../../common/types/map';
import SwipeLeftIcon from '@mui/icons-material/SwipeLeft';
import RestoredButton from '../ProjectDetails/RestoredButton';

const MyTreesMap = dynamic(() => import('../MyForestMap'), {
  loading: () => <p>loading</p>,
});

export default function MyTrees({
  profile,
  authenticatedType,
}: MyTreesProps): ReactElement | null {
  const { ready } = useTranslation(['country', 'me']);
  const [projectsForTreePlantaion, setProjectsForTreePlantaion] = useState<
    Contributions[]
  >([]);
  const [projectsForAreaConservation, setProjectsForAreaConservation] =
    useState<Contributions[]>([]);
  const [otherDonationInfo, setOthercontributionInfo] = useState<QueryResult[]>(
    []
  );
  const [page, setPage] = useState(0);
  const { setErrors } = useContext(ErrorHandlingContext);
  const {
    setConservationProjects,
    setTreePlantedProjects,
    setIsTreePlantedButtonActive,
    isConservedButtonActive,
    setIsConservedButtonActive,
    isTreePlantedButtonActive,
  } = useProjectProps();

  const _detailInfo = trpc.myForest.stats.useQuery({
    profileId: `prf_6RaZcCpeJIlTA4DKEPKje1T6`,
  });
  console.log(_detailInfo.data, '===');
  const _conservationGeoJsonData = trpc.myForest.contributionsGeoJson.useQuery({
    profileId: `prf_6RaZcCpeJIlTA4DKEPKje1T6`,
    purpose: Purpose.CONSERVATION,
  });

  const _treePlantedGeoJsonData = trpc.myForest.contributionsGeoJson.useQuery({
    profileId: `prf_6RaZcCpeJIlTA4DKEPKje1T6`,
    purpose: Purpose.TREES,
  });

  const _contributionDataForPlantedtrees =
    trpc.myForest.contributions.useInfiniteQuery(
      {
        profileId: `prf_6RaZcCpeJIlTA4DKEPKje1T6`,
        limit: 15,
        purpose: Purpose.TREES,
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  const _contributionData = trpc.myForest.contributions.useInfiniteQuery(
    {
      profileId: `prf_6RaZcCpeJIlTA4DKEPKje1T6`,
      limit: 15,
      purpose: Purpose.CONSERVATION,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const handleFetchNextPage = (): void => {
    _contributionData.fetchNextPage();
    setPage((prev) => prev + 1);
  };
  const handleFetchNextPageforPlantedTrees = (): void => {
    _contributionDataForPlantedtrees.fetchNextPage();
    setPage((prev) => prev + 1);
  };

  const _handleErrors = (
    trpcProcedure: any,
    stateUpdaterFunction: any
  ): void => {
    if (!trpcProcedure.isLoading) {
      if (trpcProcedure.error) {
        setErrors(
          handleError(
            new APIError(
              trpcProcedure.error?.data?.httpStatus as number,
              trpcProcedure.error
            )
          )
        );
      }
      stateUpdaterFunction(trpcProcedure?.data);
    }
  };

  useEffect(() => {
    _handleErrors(_contributionData, setProjectsForAreaConservation);
  }, [_contributionData.isLoading, _contributionData.data]);

  useEffect(() => {
    _handleErrors(
      _contributionDataForPlantedtrees,
      setProjectsForTreePlantaion
    );
  }, [
    _contributionDataForPlantedtrees.isLoading,
    _contributionDataForPlantedtrees.data,
  ]);

  useEffect(() => {
    _handleErrors(_conservationGeoJsonData, setConservationProjects);
  }, [_conservationGeoJsonData.isLoading]);

  useEffect(() => {
    _handleErrors(_treePlantedGeoJsonData, setTreePlantedProjects);
  }, [_treePlantedGeoJsonData.isLoading]);

  useEffect(() => {
    _handleErrors(_detailInfo, setOthercontributionInfo);
  }, [_detailInfo.isLoading]);

  const handleClick = () => {
    if (isTreePlantedButtonActive) {
      setIsTreePlantedButtonActive(false);
    } else {
      if (otherDonationInfo?.treeCount && otherDonationInfo?.treeCount > 0) {
        setIsTreePlantedButtonActive(true);
        setIsConservedButtonActive(false);
      }
    }
  };

  return ready && otherDonationInfo ? (
    <div className={myForestStyles.mapMainContainer}>
      {/* <MyTreesMap /> */}
      <div className={myForestStyles.mapButtonMainContainer}>
        <div className={myForestStyles.mapButtonContainer}>
          <div style={{ display: 'flex', gap: '1px' }} onClick={handleClick}>
            <PlantedTreesButton plantedTrees={otherDonationInfo?.treeCount} />
            <RestoredButton restoredArea={otherDonationInfo?.squareMeters} />
          </div>
          <ConservationButton conservedArea={otherDonationInfo?.conserved} />
          <DonationInfo
            projects={otherDonationInfo?.projects}
            countries={otherDonationInfo?.countries}
            donations={otherDonationInfo?.donations}
          />
        </div>
      </div>
      <div className={myForestStyles.swipeConatiner}>
        <SwipeLeftIcon />
      </div>
      {/* {isTreePlantedButtonActive && !isConservedButtonActive && (
        <TreeContributedProjectList
          contribution={projectsForTreePlantaion}
          userprofile={profile}
          authenticatedType={authenticatedType}
          handleFetchNextPage={handleFetchNextPageforPlantedTrees}
        />
      )}

      {isConservedButtonActive && !isTreePlantedButtonActive && (
        <AreaConservedProjectList
          contribution={projectsForAreaConservation}
          handleFetchNextPage={handleFetchNextPage}
        />
      )} */}
    </div>
  ) : null;
}
