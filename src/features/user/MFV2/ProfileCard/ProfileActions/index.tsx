import React, { useState } from 'react';
import {
  AllDonations,
  RedeemIcon,
  SupportUserIcon,
  WebsiteLinkIcon,
} from '../../../../../../public/assets/images/icons/ProfilePageV2Icons';
import styles from './ProfileActions.module.scss';
import RedeemModal from '../../../Profile/components/ProfileBox/microComponents/RedeemModal';
import SocialMediaShareButton from './SocialMediaShareButton';
import { useTranslations } from 'next-intl';
import { ProfileV2Props } from '../../../../common/types/profile';
import WebappButton from '../../../../common/WebappButton';

const ProfileActions = ({ profileType, userProfile }: ProfileV2Props) => {
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const t = useTranslations('Profile');

  const handleRedeemModalOpen = () => {
    setIsRedeemModalOpen(true);
  };

  const handleRedeemModalClose = () => {
    setIsRedeemModalOpen(false);
  };

  const handleWebsiteShareUrl = () => {
    const profileURL = userProfile?.url
      ? userProfile.url.includes('http') || userProfile.url.includes('https')
        ? userProfile.url
        : `http://${userProfile.url}`
      : '';
    return profileURL;
  };

  return profileType === 'private' ? (
    <div className={styles.privateProfileActions}>
      <WebappButton
        icon={<AllDonations />}
        text={t('feature.allDonations')}
        elementType={'link'}
        href={'/profile/history'}
      />
      <WebappButton
        icon={<RedeemIcon />}
        text={t('feature.redeem')}
        onClick={handleRedeemModalOpen}
        elementType={'button'}
      />
      <RedeemModal
        redeemModalOpen={isRedeemModalOpen}
        handleRedeemModalClose={handleRedeemModalClose}
      />
      <SocialMediaShareButton userProfile={userProfile} />
    </div>
  ) : (
    <div className={styles.publicProfileActions}>
      <WebappButton
        icon={<SupportUserIcon />}
        text={t('feature.supportUserText', {
          username: userProfile?.displayName.split(' ')[0],
        })}
        variant="primary"
        elementType={'link'}
        href={`/s/${userProfile?.slug}`}
      />
      <div className={styles.websiteShareActions}>
        <WebappButton
          icon={<WebsiteLinkIcon />}
          text={t('feature.website')}
          elementType={'link'}
          href={handleWebsiteShareUrl()}
          target={'_blank'}
        />
        <SocialMediaShareButton userProfile={userProfile} />
      </div>
    </div>
  );
};

export default ProfileActions;
