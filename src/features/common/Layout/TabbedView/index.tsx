import { ReactElement, useEffect, useState } from 'react';
import { Grid, styled } from '@mui/material';
import TabSteps from './TabSteps';
import { TabItem } from './TabbedViewTypes';

const TabContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: 24,
  borderRadius: 9,
  boxShadow: theme.shadows[1],
  alignItems: 'flex-end',
  '&.tabContainer--list': {
    backgroundColor: 'inherit',
    boxShadow: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    fontSize: '0.875rem',
    alignItems: 'center',
    '& .loadingButton': {
      minWidth: 150,
    },
  },
}));

interface TabbedViewProps {
  children: React.ReactNode;
  step: number | string;
  tabItems: TabItem[];
}

export default function TabbedView({
  children,
  step,
  tabItems,
}: TabbedViewProps): ReactElement {
  const [isShowingList, setIsShowingList] = useState(false);

  useEffect(() => {
    const currentTab = tabItems.find((tabItem) => step === tabItem.step);
    setIsShowingList(currentTab?.hasList || false);
  }, [step, tabItems]);

  return (
    <Grid container className="TabbedView">
      <Grid
        item
        xs={12}
        md={3}
        component={() => <TabSteps step={step} tabItems={tabItems} />}
      ></Grid>
      <Grid
        item
        xs={12}
        md={9}
        component={TabContainer}
        className={
          isShowingList ? 'tabContainer--list' : 'tabContainer--singular'
        }
      >
        {children}
      </Grid>
    </Grid>
  );
}
