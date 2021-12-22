import i18next from '../../../i18n';
import React, { ReactElement } from 'react'
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import { useRouter } from 'next/router';
import ManageProjects from '../../../src/features/user/ManageProjects';
import { UserPropsContext } from '../../../src/features/common/Layout/UserPropsContext';
import AccessDeniedLoader from '../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../../src/features/common/Layout/Footer';
import Head from 'next/head';

export default function AddProjectType(): ReactElement {
    const { useTranslation } = i18next;
    const router = useRouter();
    const { t } = useTranslation(['donate', 'manageProjects']);
    const [purpose, setPurpose] = React.useState(false)
    const { user, contextLoaded, token, loginWithRedirect } = React.useContext(
        UserPropsContext
    );
    const [accessDenied, setAccessDenied] = React.useState(false);
    const [setupAccess, setSetupAccess] = React.useState(false);
    React.useEffect(() => {
        if (router.query.purpose) {
            setPurpose(true)
        }
        else
            setPurpose(false)
    }, [router]);
    console.log(`router`, router)

    React.useEffect(() => {
        async function loadUserData() {
            const usertype = user.type;
            if (usertype === 'tpo') {
                setAccessDenied(false);
                setSetupAccess(true);
            } else {
                setAccessDenied(true);
                setSetupAccess(true);
            }
        }

        if (contextLoaded) {
            if (token && user) {
                loadUserData();
            } else {
                localStorage.setItem('redirectLink', '/profile/projects/add-project/restoration-project');
                loginWithRedirect({
                    redirectUri: `${process.env.NEXTAUTH_URL}/login`,
                    ui_locales: localStorage.getItem('language') || 'en',
                });
            }
        }
    }, [contextLoaded]);

    // User is not TPO
    if (accessDenied && setupAccess) {
        return (
            <>
                <AccessDeniedLoader />
                <Footer />
            </>
        );
    }

    return (
        <div className={'profilePage'}>
            <UserLayout>
                <Head>
                    <title>{t('manageProjects:addProject')}</title>
                </Head>
                <div className="profilePageHeader">
                    <div>
                        <div className={'profilePageTitle'}>
                            {' '}
                            {t('manageProjects:addProject')}
                        </div>
                    </div>
                </div>
                <div className={'add-project-title'}>
                    <p>
                        {t('manageProjects:addProjetDescription')}<br/>
                        {t('manageProjects:addProjetContact')}
                        <span>
                            {t('manageProjects:supportLink')}
                        </span>
                    </p>
                </div>
                
                {!purpose ?
                    <div className={'add-project-container'}>
                        <div className={'add-project'}>
                            <button
                                id={'addProjectBut'}
                                className={'add-projects-button'}
                                onClick={() => router.push('/profile/projects/new-project/?purpose=restoration')}
                            >
                                {t('manageProjects:restorationProject')}
                            </button>

                            <button
                                id={'conservationProj'}
                                className={'add-projects-button'}
                                onClick={() => router.push('/profile/projects/new-project/?purpose=conservation')}
                            >
                                {t('manageProjects:conservationProject')}
                            </button>
                        </div>
                    </div>
                    : null
                }


                {purpose ?
                    (
                        router.query.purpose == "conservation" ?
                            (<ManageProjects token={token} conservationProject={true} />)
                            :
                            (<ManageProjects token={token} />)
                    )
                    :
                    null}

            </UserLayout>
        </div>
    )
}
