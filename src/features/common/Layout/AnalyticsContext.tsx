import { useContext, createContext, useMemo, useState, FC } from 'react';
import { format } from 'date-fns';

import { SetState } from '../types/common';

export interface Project {
  id: string;
  name: string;
}

interface AnalyticsContextInterface {
  projectList: Project[] | null;
  setProjectList: SetState<Project[] | null>;
  project: Project | null;
  setProject: SetState<Project | null>;
  fromDate: Date;
  setFromDate: SetState<Date>;
  toDate: Date;
  setToDate: SetState<Date>;
}

const AnalyticsContext = createContext<AnalyticsContextInterface | null>(null);

export const AnalyticsProvider: FC = ({ children }) => {
  const [projectList, setProjectList] = useState<Project[] | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [fromDate, setFromDate] = useState(new Date('2021-04-18'));
  const [toDate, setToDate] = useState(new Date('2022-06-27'));

  const value: AnalyticsContextInterface | null = useMemo(
    () => ({
      projectList,
      setProjectList,
      project,
      setProject,
      fromDate,
      setFromDate,
      toDate,
      setToDate,
    }),
    [
      projectList,
      setProjectList,
      project,
      setProject,
      fromDate,
      setFromDate,
      toDate,
      setToDate,
    ]
  );

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = (): AnalyticsContextInterface => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('AnalyticsContext must be used within AnalyticsProvider');
  }
  return context;
};
