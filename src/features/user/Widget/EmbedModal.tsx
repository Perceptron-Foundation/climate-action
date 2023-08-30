import React from 'react';
import { Modal, Snackbar, styled } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import styles from './EmbedModal.module.scss';
import { useTranslation } from 'next-i18next';
import { putAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { useRouter } from 'next/router';
import { ThemeContext } from '../../../theme/themeContext';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { handleError, APIError, User } from '@planet-sdk/common';
import { AlertColor } from '@mui/lab';

interface Props {
  embedModalOpen: boolean;
  setEmbedModalOpen: Function;
}

const Alert = styled(MuiAlert)(({ theme }) => {
  return {
    backgroundColor: theme.palette.primary.main,
  };
});

export default function EmbedModal({
  embedModalOpen,
  setEmbedModalOpen,
}: Props) {
  const { t, ready } = useTranslation(['editProfile']);
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [severity, setSeverity] = React.useState<AlertColor>('success');
  const [snackbarMessage, setSnackbarMessage] = React.useState('OK');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const router = useRouter();
  // This effect is used to get and update UserInfo if the isAuthenticated changes

  const { user, setUser, contextLoaded, token, logoutUser } = useUserProps();

  React.useEffect(() => {
    if (user && user?.isPrivate) {
      setIsPrivate(true);
    }
  }, [user]);

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const saveProfile = async () => {
    setIsUploadingData(true);
    const bodyToSend = {
      isPrivate: false,
    };
    if (contextLoaded && token) {
      try {
        const res: User = await putAuthenticatedRequest(
          `/app/profile`,
          bodyToSend,
          token,
          logoutUser
        );
        setSeverity('success');
        setSnackbarMessage(ready ? t('editProfile:profileSaved') : '');
        handleSnackbarOpen();
        setEmbedModalOpen(false);
        setIsUploadingData(false);
        setUser(res);
      } catch (err) {
        setIsUploadingData(false);
        setErrors(handleError(err as APIError));
      }
    }
  };

  const { theme } = React.useContext(ThemeContext);

  return (
    <>
      <Modal
        className={'modalContainer' + ' ' + theme}
        open={embedModalOpen}
        hideBackdrop
      >
        <div className={styles.modal}>
          <div className={styles.headerDiv}>
            <div className={styles.editProfileText}>
              {' '}
              <b> {t('editProfile:changeAccountToPublic')} </b>
            </div>
            <div className={styles.accountPrivacyChangeText}>
              {t('editProfile:accountPrivacyChangeText')}
            </div>
          </div>
          {/* <div className={styles.isPrivateAccountDiv}>
                        <div>
                            <div className={styles.mainText}>
                                {t('editProfile:publicAccount')}
                            </div>
                        </div>
                        <ToggleSwitch
                            checked={!isPrivate}
                            onChange={handleToggleChange}
                        />
                    </div> */}
          <div
            className={styles.formFieldLarge}
            style={{ justifyContent: 'center' }}
          >
            <button
              id={'editProfileSaveProfile'}
              className={styles.saveButton}
              onClick={() => saveProfile()}
            >
              {isUploadingData ? (
                <div className={styles.spinner}></div>
              ) : (
                t('editProfile:continue')
              )}
            </button>
            <button
              id={'editProfileSaveProfile'}
              className={styles.cancelButton}
              onClick={() => {
                setEmbedModalOpen(false);
                router.back();
              }}
            >
              {t('editProfile:cancel')}
            </button>
          </div>
        </div>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <div>
          <Alert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity={severity}
          >
            {snackbarMessage}
          </Alert>
        </div>
      </Snackbar>
    </>
  );
}
