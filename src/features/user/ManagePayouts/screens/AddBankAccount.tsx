import { ReactElement, useContext, useState } from 'react';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { usePayouts } from '../../../common/Layout/PayoutsContext';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import BankDetailsForm, { FormData } from '../components/BankDetailsForm';
import CustomSnackbar from '../../../common/CustomSnackbar';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import isApiCustomError from '../../../../utils/apiRequests/isApiCustomError';
import { PayoutCurrency } from '../../../../utils/constants/payoutConstants';
import { handleError, APIError } from '@planet-sdk/common';

const AddBankAccount = (): ReactElement | null => {
  const { t } = useTranslation('managePayouts');
  const { payoutMinAmounts, setAccounts, accounts } = usePayouts();
  const { token } = useContext(UserPropsContext);
  const { setErrors } = useContext(ErrorHandlingContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const router = useRouter();

  const closeSnackbar = (): void => {
    setIsAccountCreated(false);
  };

  const handleSaveAccount = async (data: FormData) => {
    setIsProcessing(true);
    const accountData = {
      ...data,
      currency: data.currency === PayoutCurrency.DEFAULT ? '' : data.currency,
      payoutMinAmount:
        data.currency === PayoutCurrency.DEFAULT ? '' : data.payoutMinAmount,
    };
    try {
      const res = await postAuthenticatedRequest<Payouts.BankAccount>(
        '/app/accounts',
        accountData,
        token
      );
      if (accounts) {
        setAccounts([...accounts, res]);
      } else {
        setAccounts([res]);
      }
      // show success message
      setIsAccountCreated(true);
      // go to accounts tab
      setTimeout(() => {
        router.push('/profile/payouts');
      }, 3000);
    } catch (err) {
      setIsProcessing(false);
      const serializedErrors = handleError(err as APIError);
      const _serializedErrors = [];

      for (const error of serializedErrors) {
        switch (error.message) {
          case 'min_amount_range':
            _serializedErrors.push({
              message: t('accountError.min_amount_range', {
                ...error.parameters,
              }),
            });
            break;

          case 'account_duplicate':
            _serializedErrors.push({
              message: t('accountError.account_duplicate', {
                currency: error.parameters?.currency
                  ? error.parameters.currency
                  : t('defaultCurrency').toLowerCase(),
              }),
            });
            break;

          case 'min_amount_forbidden':
            _serializedErrors.push({
              message: t('accountError.min_amount_forbidden'),
            });
            break;

          default:
            _serializedErrors.push(error);
            break;
        }
      }

      setErrors(_serializedErrors);
    }
  };

  return payoutMinAmounts ? (
    <CenteredContainer>
      <BankDetailsForm
        payoutMinAmounts={payoutMinAmounts}
        handleSave={handleSaveAccount}
        isProcessing={isProcessing}
      />
      {isAccountCreated && (
        <CustomSnackbar
          snackbarText={t('accountCreationSuccess')}
          isVisible={isAccountCreated}
          handleClose={closeSnackbar}
        />
      )}
    </CenteredContainer>
  ) : null;
};

export default AddBankAccount;
