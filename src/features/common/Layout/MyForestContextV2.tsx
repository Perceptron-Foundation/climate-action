import {
  FC,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { trpc } from '../../../utils/trpc';
import { ErrorHandlingContext } from './ErrorHandlingContext';
import { Point } from 'geojson';
import {
  ProjectListResponse,
  MyForestProject,
  ContributionsResponse,
  MyContributionsSingleRegistration,
  MyContributionsSingleProject,
  MapLocation,
  MyContributionsMapItem,
  Leaderboard,
} from '../types/myForestv2';
import { updateStateWithTrpcData } from '../../../utils/trpcHelpers';
import { SetState } from '../types/common';

export interface RegistrationGeojson {
  type: 'Feature';
  geometry: Point;
  properties: MyContributionsSingleRegistration;
}

export interface DonationGeojson {
  type: 'Feature';
  geometry: Point;
  properties: {
    projectInfo: MyForestProject;
    contributionInfo: MyContributionsSingleProject;
  };
}

interface UserInfo {
  profileId: string;
  slug: string;
  targets: {
    treesDonated: number;
    areaRestored: number;
    areaConserved: number;
  };
}
interface MyForestContextV2Interface {
  projectListResult: ProjectListResponse | undefined;
  contributionsResult: ContributionsResponse | undefined;
  leaderboardResult: Leaderboard | undefined;
  isLeaderboardLoaded: boolean;
  contributionsMap: Map<string, MyContributionsMapItem> | undefined;
  registrationGeojson: RegistrationGeojson[];
  donationGeojson: DonationGeojson[];
  userInfo: UserInfo | null;
  setUserInfo: SetState<UserInfo | null>;
}

const MyForestContextV2 = createContext<MyForestContextV2Interface | null>(
  null
);

export const MyForestProviderV2: FC = ({ children }) => {
  const [projectListResult, setProjectListResult] =
    useState<ProjectListResponse>();
  const [contributionsResult, setContributionsResult] =
    useState<ContributionsResponse>();
  const [leaderboardResult, setLeaderboardResult] = useState<
    Leaderboard | undefined
  >();
  const [isLeaderboardLoaded, setIsLeaderboardLoaded] = useState(false);
  const [contributionsMap, setContributionsMap] =
    useState<Map<string, MyContributionsMapItem>>();
  const [registrationGeojson, setRegistrationGeojson] = useState<
    RegistrationGeojson[]
  >([]);

  const [donationGeojson, setDonationGeojson] = useState<DonationGeojson[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { setErrors } = useContext(ErrorHandlingContext);

  const _projectList = trpc.myForestV2.projectList.useQuery();
  const _contributions = trpc.myForestV2.contributions.useQuery({
    profileId: `${userInfo?.profileId}`,
    slug: `${userInfo?.slug}`,
  });
  const _leaderboard = trpc.myForestV2.leaderboard.useQuery({
    profileId: `${userInfo?.profileId}`,
    slug: `${userInfo?.slug}`,
  });

  useEffect(() => {
    if (_projectList.data) {
      updateStateWithTrpcData(_projectList, setProjectListResult, setErrors);
    }
  }, [_projectList.data]);

  useEffect(() => {
    if (_contributions.data) {
      updateStateWithTrpcData(
        _contributions,
        setContributionsResult,
        setErrors
      );
    }
  }, [_contributions.data]);

  useEffect(() => {
    if (_leaderboard.data) {
      updateStateWithTrpcData(_leaderboard, setLeaderboardResult, setErrors);
      setIsLeaderboardLoaded(true);
    }
  }, [_leaderboard?.data]);

  //format geojson
  const _generateDonationGeojson = (
    project: MyForestProject,
    contributionsForProject: MyContributionsSingleProject
  ) => {
    return {
      type: 'Feature',
      geometry: project.geometry,
      properties: {
        projectInfo: project,
        contributionInfo: contributionsForProject,
      },
    };
  };

  const _generateRegistrationGeojson = (
    registrationLocation: MapLocation,
    registration: MyContributionsSingleRegistration
  ) => {
    return {
      type: 'Feature',
      geometry: registrationLocation.geometry,
      properties: registration,
    };
  };

  useEffect(() => {
    if (contributionsResult) {
      const _registrationGeojson: RegistrationGeojson[] = [];
      const _donationGeojson: DonationGeojson[] = [];

      setContributionsMap(contributionsResult.myContributionsMap);

      //iterate through contributionsMap and generate geojson for each contribution
      contributionsResult.myContributionsMap.forEach((item, key) => {
        if (item.type === 'project') {
          // add to donation Geojson
          if (projectListResult && projectListResult[key]) {
            const geojson = _generateDonationGeojson(
              projectListResult[key],
              item
            );
            _donationGeojson.push(geojson);
          }
        } else {
          // add to registration Geojson
          const registrationLocation =
            contributionsResult.registrationLocationsMap.get(key);
          if (registrationLocation) {
            const geojson = _generateRegistrationGeojson(
              registrationLocation,
              item
            );
            _registrationGeojson.push(geojson);
          }
        }
      });

      if (_registrationGeojson.length > 0)
        setRegistrationGeojson(_registrationGeojson);

      if (_donationGeojson.length > 0) setDonationGeojson(_donationGeojson);
    }
  }, [contributionsResult, projectListResult]);

  const value = useMemo(
    () => ({
      projectListResult,
      contributionsResult,
      leaderboardResult,
      isLeaderboardLoaded,
      contributionsMap,
      registrationGeojson,
      donationGeojson,
      userInfo,
      setUserInfo,
    }),
    [
      projectListResult,
      contributionsResult,
      leaderboardResult,
      isLeaderboardLoaded,
      contributionsMap,
      registrationGeojson,
      donationGeojson,
      userInfo,
      setUserInfo,
    ]
  );

  return (
    <MyForestContextV2.Provider value={value}>
      {children}
    </MyForestContextV2.Provider>
  );
};

export const useMyForestV2 = () => {
  const context = useContext(MyForestContextV2);
  if (!context) {
    throw new Error('MyForestContextV2 must be used within MyForestProvider');
  }
  return context;
};
