import React, { ReactElement, useContext, useState } from 'react';
import axios from 'axios';
import i18next from '../../../../../i18n';
import { Button, TextField, styled } from 'mui-latest';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import { useBulkCode } from '../../../common/Layout/BulkCodeContext';
import styles from '../BulkCodes.module.scss';
import { useRouter } from 'next/router';

import BulkCodesForm from './BulkCodesForm';
import ProjectSelector from './ProjectSelector';
import BulkGiftTotal from './BulkGiftTotal';
import RecipientsUploadForm from './RecipientsUploadForm';

import BulkCodesError from './BulkCodesError';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import cleanObject from '../../../../utils/cleanObject';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useAuth0 } from '@auth0/auth0-react';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { v4 as uuidv4 } from 'uuid';
import { BulkCodeMethods } from '../../../../utils/constants/bulkCodeMethods';
import { TENANT_ID } from '../../../../utils/constants/environment';
import getsessionId from '../../../../utils/apiRequests/getSessionId';
import { Recipient } from '../BulkCodesTypes';

const { useTranslation } = i18next;

const InlineFormGroup = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  columnGap: '10px',
});

interface IssueCodesFormProps {}

const IssueCodesForm = ({}: IssueCodesFormProps): ReactElement | null => {
  const { t, ready } = useTranslation(['common', 'bulkCodes']);
  const router = useRouter();
  const { project, planetCashAccount, projectList, bulkMethod } = useBulkCode();
  const { user } = useContext(UserPropsContext);
  const { getAccessTokenSilently } = useAuth0();
  const { handleError } = useContext(ErrorHandlingContext);
  const { control, handleSubmit, errors, watch } = useForm();
  const [localRecipients, setLocalRecipients] = useState<Recipient[]>([]);
  const [comment, setComment] = useState('');
  const [occasion, setOccasion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const codeQuantity = watch('codeQuantity', 0);
  const unitsPerCode = watch('unitsPerCode', 0);

  const onSubmit = async (data) => {
    const token = await getAccessTokenSilently();
    setIsProcessing(true);
    if (bulkMethod === BulkCodeMethods.GENERIC) {
      if (project) {
        const donationData = {
          purpose: project.purpose,
          project: project.guid,
          prePaid: true,
          comment,
          quantity: data.codeQuantity * data.unitsPerCode,
          gift: {
            type: 'code-bulk',
            occasion,
            numberOfCodes: data.codeQuantity,
            unitsPerCode: project.unitCost * data.unitsPerCode,
          },
        };
        const cleanedData = cleanObject(donationData);

        try {
          const res = await axios.post(
            process.env.API_ENDPOINT + '/app/donations',
            cleanedData,
            {
              headers: {
                'Content-Type': 'application/json',
                'tenant-key': `${TENANT_ID}`,
                'X-SESSION-ID': await getsessionId(),
                Authorization: `Bearer ${token}`,
                'x-locale': `${
                  localStorage.getItem('language')
                    ? localStorage.getItem('language')
                    : 'en'
                }`,
                'IDEMPOTENCY-KEY': uuidv4(),
              },
            }
          );
          if (res.status === 200) {
            router.push(`/profile/history?ref=${res.data.uid}`);
          }
        } catch (err) {
          setIsProcessing(false);
          console.error(err);
          handleError(err);
        }
      } else {
        setIsProcessing(false);
        handleError(Error('Project not selected'));
      }
    } else {
      if (project) {
        // TODO : Add comment and occasion

        let totalUnits = 0;
        const recipients = [];

        for (let recepients of localRecipients) {
          totalUnits = totalUnits + parseInt(recepients.units);
        }

        localRecipients.forEach((recipient) => {
          const temp = {
            recipientName: recipient.recipient_name,
            recipientEmail: recipient.recipient_email,
            message: recipient.recipient_message,
            notifyRecipient: recipient.recipient_notify,
            value: parseInt(recipient.units),
            // occasion: recipient.recipient_occasion,
          };
          recipients.push(temp);
        });

        const donationData = {
          purpose: project.purpose,
          project: project.guid,
          prePaid: true,
          treeCount: totalUnits,
          comment,
          gift: {
            type: 'discrete-bulk',
            occasion,
            recipients,
          },
        };

        const cleanedDonationData = cleanObject(donationData);
        try {
          const res = await axios.post(
            process.env.API_ENDPOINT + '/app/donations',
            cleanedDonationData,
            {
              headers: {
                'Content-Type': 'application/json',
                'tenant-key': `${TENANT_ID}`,
                'X-SESSION-ID': await getsessionId(),
                Authorization: `Bearer ${token}`,
                'x-locale': `${
                  localStorage.getItem('language')
                    ? localStorage.getItem('language')
                    : 'en'
                }`,
                'IDEMPOTENCY-KEY': uuidv4(),
              },
            }
          );
          if (res.status === 200) {
            router.push(`/profile/history?ref=${res.data.uid}`);
          }
        } catch (err) {
          setIsProcessing(false);
          console.error(err);
          handleError(err);
        }
      } else {
        setIsProcessing(false);
        handleError(Error('Project not selected'));
      }
    }
  };

  const getBulkCodeTotalAmount = () => {
    if (bulkMethod === BulkCodeMethods.GENERIC) {
      return project
        ? `${(project.unitCost * codeQuantity * unitsPerCode).toFixed(2)}`
        : undefined;
    } else {
      let totalUnits = 0;
      for (let recepients of localRecipients) {
        totalUnits = totalUnits + recepients.units * 1;
      }
      return project ? (totalUnits * project.unitCost).toFixed(2) : undefined;
    }
  };

  const getBulkCodeTotalUnits = () => {
    if (bulkMethod === BulkCodeMethods.GENERIC) {
      return project ? codeQuantity * unitsPerCode : undefined;
    } else {
      let totalUnits = 0;
      for (let recepients of localRecipients) {
        totalUnits = totalUnits + recepients.units * 1;
      }
      return totalUnits;
    }
  };

  if (ready) {
    return (
      <BulkCodesForm className="IssueCodesForm">
        <div className="inputContainer">
          <ProjectSelector
            projectList={projectList || []}
            project={project}
            active={false}
            planetCashAccount={planetCashAccount}
          />
          <TextField
            onChange={(e: React.ChangeEvent<any>) => setComment(e.target.value)}
            value={comment}
            label={t('bulkCodes:labelComment')}
          />
          <TextField
            onChange={(e: React.ChangeEvent<any>) =>
              setOccasion(e.target.value)
            }
            value={occasion}
            label={t('bulkCodes:occasion')}
          />
          {bulkMethod === 'generic' && (
            <InlineFormGroup>
              <div style={{ width: '100%' }}>
                <Controller
                  name="unitsPerCode"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={''}
                  render={(props: ControllerRenderProps) => (
                    <TextField
                      {...props}
                      onChange={props.onChange}
                      value={props.value}
                      label={t('bulkCodes:unitsPerCode')}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      }}
                      error={errors.unitsPerCode}
                    />
                  )}
                />
                {errors.unitsPerCode && (
                  <span className={styles.formErrors}>
                    {t('bulkCodes:unitsRequired')}
                  </span>
                )}
              </div>
              <div style={{ width: '100%' }}>
                <Controller
                  name="codeQuantity"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={''}
                  render={(props: ControllerRenderProps) => (
                    <TextField
                      {...props}
                      onChange={props.onChange}
                      value={props.value}
                      label={t('bulkCodes:totalNumberOfCodes')}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      }}
                      error={errors.codeQuantity}
                    />
                  )}
                />
                {errors.codeQuantity && (
                  <span className={styles.formErrors}>
                    {t('bulkCodes:quantityCodesRequired')}
                  </span>
                )}
              </div>
            </InlineFormGroup>
          )}
          {bulkMethod === 'import' && (
            <RecipientsUploadForm
              onRecipientsUploaded={setLocalRecipients}
              localRecipients={localRecipients}
            />
          )}
          <BulkGiftTotal
            amount={getBulkCodeTotalAmount()}
            currency={planetCashAccount?.currency}
            units={getBulkCodeTotalUnits()}
            unit={project?.unit}
          />
          {/* TODOO translation and pluralization */}
        </div>

        <BulkCodesError />

        <Button
          variant="contained"
          color="primary"
          className="formButton"
          disabled={
            !(
              user.planetCash &&
              !(user.planetCash.balance + user.planetCash.creditLimit <= 0)
            ) || isProcessing
          }
          onClick={
            bulkMethod === BulkCodeMethods.GENERIC
              ? handleSubmit(onSubmit)
              : onSubmit
          }
        >
          {isProcessing
            ? t('bulkCodes:issuingCodes')
            : t('bulkCodes:issueCodes')}
        </Button>
      </BulkCodesForm>
    );
  }

  return null;
};

export default IssueCodesForm;
