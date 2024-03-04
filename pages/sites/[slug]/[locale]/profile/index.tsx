import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import { useUserProps } from '../../../../../src/features/common/Layout/UserPropsContext';
import Profile from '../../../../../src/features/user/Profile/components/ProfileBox';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import MyContributions from '../../../../../src/features/user/Profile/components/MyContributions';
import Head from 'next/head';
import { AbstractIntlMessages, useTranslations } from 'next-intl';
import { User } from '@planet-sdk/common';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { MyForestProvider } from '../../../../../src/features/common/Layout/MyForestContext';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { defaultTenant } from '../../../../../tenant.config';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';
import myProfileStyle from '../../../../../src/features/user/Profile/styles/MyProfile.module.scss';
import deepmerge from 'deepmerge';

interface Props {
  pageProps: PageProps;
}

function ProfilePage({ pageProps: { tenantConfig } }: Props): ReactElement {
  const t = useTranslations('Me');
  // External imports
  const router = useRouter();
  const { user, contextLoaded } = useUserProps();
  const { setTenantConfig } = useTenant();

  // Internal states
  const [profile, setProfile] = React.useState<null | User>();

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (contextLoaded) {
      if (user) {
        setProfile(user);
      }
    }
  }, [contextLoaded, user, router]);

  return (
    tenantConfig && (
      <UserLayout>
        <Head>
          <title>{t('profile')}</title>
        </Head>
        {profile && (
          <>
            <MyForestProvider>
              <div className={myProfileStyle.profileContainer}>
                <Profile userProfile={profile} />
                <MyContributions profile={profile} />
              </div>
            </MyForestProvider>
          </>
        )}
      </UserLayout>
    )
  );
}

export default ProfilePage;

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

  const userMessages = {
    ...(
      await import(
        `../../../../../public/static/locales/${context.params?.locale}/common.json`
      )
    ).default,
    ...(
      await import(
        `../../../../../public/static/locales/${context.params?.locale}/me.json`
      )
    ).default,
    ...(
      await import(
        `../../../../../public/static/locales/${context.params?.locale}/profile.json`
      )
    ).default,
    ...(
      await import(
        `../../../../../public/static/locales/${context.params?.locale}/country.json`
      )
    ).default,
    ...(
      await import(
        `../../../../../public/static/locales/${context.params?.locale}/donate.json`
      )
    ).default,
  };

  const defaultMessages = {
    ...(await import('../../../../../public/static/locales/en/common.json'))
      .default,
    ...(await import('../../../../../public/static/locales/en/me.json'))
      .default,
    ...(await import('../../../../../public/static/locales/en/profile.json'))
      .default,
    ...(await import('../../../../../public/static/locales/en/country.json'))
      .default,
    ...(await import('../../../../../public/static/locales/en/donate.json'))
      .default,
  };

  const messages: AbstractIntlMessages = deepmerge(
    defaultMessages,
    userMessages
  );

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
