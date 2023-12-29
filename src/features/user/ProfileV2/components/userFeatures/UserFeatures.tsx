import myProfileStyle from '../../styles/MyProfile.module.scss';
import { Button } from '@mui/material';
import { SupportSvg } from '../../../../../../public/assets/images/ProfilePageIcons';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import tenantConfig from '../../../../../../tenant.config';
import { useRouter } from 'next/router';
import Share from '../MicroComponents/Share';
import { UserFeaturesProps } from '../../../../common/types/profile';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import RedeemModal from './RedeemModal';
import {
  RedeemCodeSvg,
  RegisteredTreeSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import theme from '../../../../../theme/themeProperties';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
const config = tenantConfig();

const UserFeatures = ({
  handleShare,
  userProfile,
  showSocialButton,
  setShowSocialButton,
}: UserFeaturesProps) => {
  const { light } = theme;
  const router = useRouter();
  const { t } = useTranslation(['me']);
  const { setRefetchData } = useUserProps();
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const handleSupport = () => {
    router.push(`/s/${userProfile.slug}`);
  };

  const handleShareOnLinkedIn = () => {
    if (config && userProfile) {
      const linkToShare = `${config.tenantURL}/t/${userProfile.slug}`;
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?&url=${linkToShare}`;
      window.open(shareUrl, '_blank');
    }
  };

  const handleRegisterTree = () => {
    setRefetchData(false);
    router.push('profile/register-trees');
  };

  const handleRedeemModalOpen = () => {
    setIsRedeemModalOpen(true);
  };

  const handleRedeemModalClose = () => {
    setIsRedeemModalOpen(false);
  };

  return (
    <div className={myProfileStyle.buttonContainer}>
      {userProfile?.type !== 'tpo' && router.pathname !== '/profile' ? (
        <Button
          variant="contained"
          startIcon={<SupportSvg color={`${light.light}`} />}
          onClick={handleSupport}
        >
          {t('me:support')}
        </Button>
      ) : (
        <Button
          variant="contained"
          startIcon={<RedeemCodeSvg color={`${light.light}`} />}
          onClick={handleRedeemModalOpen}
        >
          {t('redeem:redeem')}
        </Button>
      )}

      {!userProfile.isPrivate && router.pathname !== '/profile' ? (
        <Button
          variant="contained"
          startIcon={<LinkedInIcon />}
          onClick={handleShareOnLinkedIn}
        >
          {t('me:linkedIn')}
        </Button>
      ) : (
        <Button
          variant="contained"
          startIcon={<RegisteredTreeSvg color={`${light.light}`} />}
          onClick={handleRegisterTree}
        >
          {t('me:registerTrees')}
        </Button>
      )}

      <RedeemModal
        redeemModalOpen={isRedeemModalOpen}
        handleRedeemModalClose={handleRedeemModalClose}
      />

      <Share
        handleShare={handleShare}
        userProfile={userProfile}
        showSocialButton={showSocialButton}
        setShowSocialButton={setShowSocialButton}
      />
    </div>
  );
};

export default UserFeatures;
