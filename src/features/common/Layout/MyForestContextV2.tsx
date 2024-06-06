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
} from '../types/myForestv2';
import { updateStateWithTrpcData } from '../../../utils/trpcHelpers';
import { SetState } from '../types/common';

interface RegistrationGeojson {
  geometry: Point;
  properties: MyContributionsSingleRegistration;
}

interface DonationGeojson {
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
  registrationGeojson: RegistrationGeojson[];
  donationGeojson: DonationGeojson[];
  treePlanted: number;
  restoredTree: number;
  conservArea: number;
  isTargetModalLoading: boolean;
  setIsTargetModalLoading: SetState<boolean>;
  treeTarget: number;
  setTreeTarget: SetState<number>;
  restoreTarget: number;
  setRestoreTarget: SetState<number>;
  conservTarget: number;
  setConservTarget: SetState<number>;
  treeChecked: boolean;
  setTreeChecked: SetState<boolean>;
  restoreChecked: boolean;
  setRestoreChecked: SetState<boolean>;
  conservChecked: boolean;
  setConservChecked: SetState<boolean>;
  userInfo: UserInfo | null;
  setUserInfo: SetState<UserInfo | null>;
}

const MyForestContextV2 = createContext<MyForestContextV2Interface | null>(
  null
);

export const MyForestProviderV2: FC = ({ children }) => {
  const { setErrors } = useContext(ErrorHandlingContext);

  const [projectListResult, setProjectListResult] =
    useState<ProjectListResponse>();
  const [contributionsResult, setContributionsResult] =
    useState<ContributionsResponse>();
  const [registrationGeojson, setRegistrationGeojson] = useState<
    RegistrationGeojson[]
  >([]);
  const [donationGeojson, setDonationGeojson] = useState<DonationGeojson[]>([]);
  const [treePlanted, setTreePlanted] = useState(0);
  const [treeTarget, setTreeTarget] = useState(0);
  const [treeChecked, setTreeChecked] = useState(false);
  const [restoredTree, setRestoredTree] = useState(0);
  const [restoreTarget, setRestoreTarget] = useState(0);
  const [restoreChecked, setRestoreChecked] = useState(false);
  const [conservArea, setConservArea] = useState(0);
  const [conservTarget, setConservTarget] = useState(0);
  const [conservChecked, setConservChecked] = useState(false);
  const [isTargetModalLoading, setIsTargetModalLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const _projectList = trpc.myForestV2.projectList.useQuery();

  const _contributions = trpc.myForestV2.contributions.useQuery({
    profileId: `${userInfo?.profileId}`,
    slug: `${userInfo?.slug}`,
  });

  const aggregate = () => {
    if (_contributions.data?.stats) {
      const totalTrees =
        _contributions.data?.stats.treesDonated.personal +
        _contributions.data?.stats.treesDonated.received +
        _contributions.data?.stats.treesRegistered;

      const totalRestore =
        _contributions.data?.stats.areaRestoredInM2.personal +
        _contributions.data?.stats.areaRestoredInM2.received;

      const totalConserv =
        _contributions.data?.stats.areaConservedInM2.personal +
        _contributions.data?.stats.areaConservedInM2.received;
      setTreePlanted(totalTrees);
      setRestoredTree(totalRestore);
      setConservArea(totalConserv);
    }
  };

  useEffect(() => {
    if (userInfo?.targets !== undefined) {
      setTreeChecked(userInfo?.targets.treesDonated > 0 ? true : false);
      setRestoreChecked(userInfo?.targets.areaRestored > 0 ? true : false);
      setConservChecked(userInfo?.targets.areaConserved > 0 ? true : false);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo?.targets !== undefined) {
      setTreeTarget(userInfo?.targets.treesDonated);
      setRestoreTarget(userInfo.targets.areaRestored);
      setConservTarget(userInfo.targets.areaConserved);
    }
  }, [userInfo]);

  useEffect(() => {
    aggregate();
  }, [_contributions.data?.stats]);

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

  //format geojson
  const _generateDonationGeojson = (
    project: MyForestProject,
    contributionsForProject: MyContributionsSingleProject
  ) => {
    return {
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
      geometry: registrationLocation.geometry,
      properties: registration,
    };
  };

  useEffect(() => {
    if (contributionsResult) {
      const _registrationGeojson: RegistrationGeojson[] = [];
      const _donationGeojson: DonationGeojson[] = [];

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
      registrationGeojson,
      donationGeojson,
      treePlanted,
      restoredTree,
      conservArea,
      isTargetModalLoading,
      setIsTargetModalLoading,
      treeTarget,
      setTreeTarget,
      restoreTarget,
      setRestoreTarget,
      conservTarget,
      setConservTarget,
      treeChecked,
      setTreeChecked,
      restoreChecked,
      setRestoreChecked,
      conservChecked,
      setConservChecked,
      userInfo,
      setUserInfo,
    }),
    [
      projectListResult,
      contributionsResult,
      registrationGeojson,
      donationGeojson,
      treePlanted,
      restoredTree,
      conservArea,
      isTargetModalLoading,
      setIsTargetModalLoading,
      treeTarget,
      setTreeTarget,
      restoreTarget,
      setRestoreTarget,
      conservTarget,
      setConservTarget,
      treeChecked,
      setTreeChecked,
      restoreChecked,
      setRestoreChecked,
      conservChecked,
      setConservChecked,
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
