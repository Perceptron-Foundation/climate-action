import React from 'react';
import { ShareIcon } from '../../../../../../public/assets/images/icons/ProfilePageV2Icons';
import ProfileCardButton from '../ProfileCardButton';
import ShareModal from '.';
import { useTranslations } from 'next-intl';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ProfileV2Props } from '../../../../common/types/common';

const SocialMediaShareButton = ({ userProfile }: ProfileV2Props) => {
  const [isShareModelOpen, setIsShareModelOpen] = React.useState(false);
  const { tenantConfig } = useTenant();
  const t = useTranslations('Profile');

  const webShareData = {
    title: t('shareFeature.shareTextTitle'),
    url: `${process.env.SCHEME}://${tenantConfig.config.tenantURL}/t/${userProfile?.slug}`,
    text: t('shareFeature.textToShare', { name: userProfile?.displayName }),
  };

  const isNativeShareSupported =
    navigator?.canShare && navigator.canShare(webShareData);

  const webShareMobile = async () => {
    try {
      await navigator.share(webShareData);
    } catch (error) {
      console.error(`Could not share at this time`, error);
    }
  };

  const handleNativeSocialMediaShare = () => {
    webShareMobile();
  };

  const handleShareModalOpen = () => {
    setIsShareModelOpen(true);
  };

  const handleShareModalClose = () => {
    setIsShareModelOpen(false);
  };

  return (
    <>
      <ProfileCardButton
        icon={<ShareIcon />}
        text={t('feature.share')}
        onClick={
          isNativeShareSupported
            ? handleNativeSocialMediaShare
            : handleShareModalOpen
        }
        isLink="false"
      />
      {!isNativeShareSupported && (
        <ShareModal
          shareModalOpen={isShareModelOpen}
          handleShareModalClose={handleShareModalClose}
          userProfile={userProfile}
        />
      )}
    </>
  );
};

export default SocialMediaShareButton;
