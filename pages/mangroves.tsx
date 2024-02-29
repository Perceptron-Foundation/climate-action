import { useRouter } from 'next/router';
import React from 'react';
import Mangroves from '../src/tenants/salesforce/Mangroves';
import tenantConfig from '../tenant.config';
import GetHomeMeta from '../src/utils/getMetaTags/GetHomeMeta';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface Props {
  initialized: boolean;
  pageProps: {
    campaignLeaderBoard: {
      mostDonated: { created: string; donorName: string; treeCount: string }[];
      mostRecent: { created: string; donorName: string; treeCount: string }[];
    };
    campaignTenantScore: { total: number };
  };
}

export default function MangrovesLandingPage({
  initialized,
  pageProps,
}: Props) {
  const router = useRouter();
  const config = tenantConfig();

  if (!config.header.items['home'].visible) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
  }

  return (
    <>
      <GetHomeMeta />
      {initialized ? (
        <Mangroves
          leaderboard={pageProps.campaignLeaderBoard}
          tenantScore={pageProps.campaignTenantScore}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  let campaignLeaderBoard = { mostDonated: [], mostRecent: [] };
  let campaignTenantScore = { total: 0 };

  try {
    const leaderboardRes = await fetch(
      `${process.env.WEBHOOK_URL}/oceanforce-2023-leaderboard`
    );
    const leaderBoardArr = await leaderboardRes.json();
    console.log('updated leaderboard');
    campaignLeaderBoard = leaderBoardArr[0];
  } catch (err) {
    console.log(err);
  }

  try {
    const tenantscoreRes = await fetch(
      `${process.env.WEBHOOK_URL}/oceanforce-2023`
    );
    const tenantScoreArr = await tenantscoreRes.json();
    console.log('updated treecount');
    campaignTenantScore = tenantScoreArr[0];
  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donationLink',
          'editProfile',
          'giftfunds',
          'leaderboard',
          'managePayouts',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTrees',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
      campaignLeaderBoard,
      campaignTenantScore,
    },
    revalidate: 60,
  };
}
