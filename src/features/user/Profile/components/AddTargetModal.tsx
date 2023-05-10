import React from 'react';
import Modal from '@mui/material/Modal';
import { useForm } from 'react-hook-form';
import Fade from '@mui/material/Fade';
import styles from '../styles/RedeemModal.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useTranslation } from 'next-i18next';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { ThemeContext } from '../../../../theme/themeContext';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';

export default function AddTargetModal({
  addTargetModalOpen,
  handleAddTargetModalClose,
}: any) {
  // External imports
  const { t, ready } = useTranslation(['me']);
  const { user, token, contextLoaded, setUser, logoutUser } = useUserProps();
  const { register, errors } = useForm({ mode: 'onBlur' });
  const { theme } = React.useContext(ThemeContext);
  const { setErrors } = React.useContext(ErrorHandlingContext);

  // Internal states
  const [target, setTarget] = React.useState(0);
  const [isLoadingForm, setIsLoading] = React.useState(false);

  // Function to change target
  const changeTarget = async () => {
    setIsLoading(true);
    if (contextLoaded && token) {
      const bodyToSend = {
        target: !target ? user.score.target : target,
      };

      try {
        const res = await putAuthenticatedRequest(
          `/app/profile`,
          bodyToSend,
          token,
          logoutUser
        );
        handleAddTargetModalClose();
        const newUserInfo = {
          ...user,
          score: res.score,
        };
        setUser(newUserInfo);
        setIsLoading(false);
      } catch (err) {
        handleAddTargetModalClose();
        setIsLoading(false);
        setErrors(handleError(err as APIError));
      }
    }
  };

  return ready && user ? (
    <Modal
      className={'modalContainer' + ' ' + theme}
      open={addTargetModalOpen}
      onClose={handleAddTargetModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={addTargetModalOpen}>
        <div className={styles.modal}>
          <b> {t('me:setTarget')} </b>
          <div className={styles.inputField}>
            <MaterialTextField
              placeholder={user.score.target ? user.score.target : '10000'}
              InputProps={{ inputProps: { min: 1 } }}
              label=""
              type="number"
              defaultValue={user.score.target ? user.score.target : null}
              onChange={(e) => setTarget(e.target.value)}
              variant="outlined"
              inputRef={register({
                min: 1,
              })}
              name="addTarget"
            />
          </div>
          {errors.addTarget && (
            <span className={'formErrors'}>{t('me:targetErrorMessage')}</span>
          )}
          {errors.addTarget ? (
            <div className="primaryButton" style={{ marginTop: '24px' }}>
              {t('me:targetSave')}
            </div>
          ) : (
            <button
              id={'AddTargetCont'}
              className="primaryButton"
              style={{ marginTop: '24px' }}
              onClick={() => changeTarget()}
            >
              {isLoadingForm ? (
                <div className={'spinner'}></div>
              ) : (
                t('me:targetSave')
              )}
            </button>
          )}
        </div>
      </Fade>
    </Modal>
  ) : (
    <></>
  );
}
