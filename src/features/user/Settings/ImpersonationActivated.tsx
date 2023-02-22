import React from 'react';
import { useTranslation } from 'next-i18next';
import LogoutIcon from '../../../../public/assets/images/icons/Sidebar/LogoutIcon';
import styles from './SwitchUser.module.scss';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { useContext } from 'react';
import { useRouter } from 'next/router';

const ImpersonationActivated = () => {
  const { setValidEmail, validEmail, setTargetEmail, setImpersonationEmail } =
    useContext(UserPropsContext);
  const { push } = useRouter();
  const closeAlert = () => {
    localStorage.removeItem('secondUser');
    setTargetEmail('');
    setValidEmail('');
    setImpersonationEmail('');
    push(`/profile/switch-user`);
  };

  const { t } = useTranslation('me');

  return (
    validEmail && (
      <div className={styles.impersonationAlertContainer}>
        <div>{t('me:targetUser')}</div>
        <div>{`<${validEmail}>`}</div>
        <div className={styles.logoutContainer}>
          <button onClick={() => closeAlert()}>
            <LogoutIcon />
          </button>
        </div>
        <div className={styles.exit}>{t('me:exitImpersonation')}</div>
      </div>
    )
  );
};

export default ImpersonationActivated;
