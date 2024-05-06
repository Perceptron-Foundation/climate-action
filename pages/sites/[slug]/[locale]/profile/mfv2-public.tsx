// This page will be moved to a different place in the future, as it is not a part of the user dashboard
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { AbstractIntlMessages } from 'next-intl';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { defaultTenant } from '../../../../../tenant.config';
import Head from 'next/head';
import PublicProfileOuterContainer from '../../../../../src/features/user/MFV2/PublicProfileOuterContainer';
import PublicProfileLayout from '../../../../../src/features/user/MFV2/PublicProfileLayout';

interface Props {
  pageProps: PageProps;
}

const PublicProfilePage = ({ pageProps: { tenantConfig } }: Props) => {
  return tenantConfig ? (
    <>
      <Head>
        <title>My Forest V2</title>
      </Head>
      <PublicProfileOuterContainer>
        <PublicProfileLayout />
      </PublicProfileOuterContainer>
    </>
  ) : (
    <></>
  );
};

export default PublicProfilePage;

export const getStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths.map((path) => {
    return {
      params: {
        slug: path.params.slug,
        locale: 'en',
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

interface PageProps {
  messages: AbstractIntlMessages;
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'donate', 'profile'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
