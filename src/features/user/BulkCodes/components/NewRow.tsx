import {
  TableRow,
  TableCell,
  TextField,
  MenuItem,
  IconButton,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { DevTool } from '@hookform/devtools';
import ReactHookFormSelect from '../../../common/InputTypes/ReactHookFormSelect';
import { Recipient } from '../BulkCodesTypes';
import PlusIcon from '../../../../../public/assets/images/icons/PlusIcon';
import themeProperties from '../../../../theme/themeProperties';
import { isEmailValid } from '../../../../utils/isEmailValid';
import { SetState } from '../../../common/types/common';

interface Props {
  setRecipients: SetState<Recipient[]>;
}

const NewRow = ({ setRecipients }: Props) => {
  const { t } = useTranslation('bulkCodes');
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Recipient>({
    mode: 'onBlur',
    defaultValues: {
      recipient_name: '',
      recipient_email: '',
      recipient_notify: 'no',
      units: '',
      recipient_message: '',
    },
  });

  const hasErrors = Object.keys(errors).length > 0;

  const handleSave = (newRecipient: Recipient): void => {
    setRecipients((currentRecipients) => [newRecipient, ...currentRecipients]);
    reset();
  };

  const validateRequiredIfNotify = (
    value: string,
    formValues: Recipient
  ): string | true => {
    return formValues.recipient_notify === 'yes' && value.length === 0
      ? t('errorAddRecipient.requiredForNotifications')
      : true;
  };

  return (
    <>
      <TableRow sx={hasErrors ? { verticalAlign: 'top' } : {}}>
        <TableCell>
          <form onSubmit={handleSubmit(handleSave)}>
            <Box
              sx={{
                height: 40,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IconButton
                size="small"
                type="submit"
                aria-label="add a recipient"
                title={t('titleAddRecipientButton')}
                color="primary"
              >
                <PlusIcon color={themeProperties.primaryColor} />
              </IconButton>
            </Box>
          </form>
        </TableCell>
        <TableCell>
          <Controller
            name="recipient_name"
            control={control}
            rules={{
              validate: {
                requiredForNotifications: validateRequiredIfNotify,
              },
            }}
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                error={errors.recipient_name !== undefined}
                helperText={errors.recipient_name?.message}
              />
            )}
          />
        </TableCell>
        <TableCell>
          <Controller
            name="recipient_email"
            control={control}
            rules={{
              validate: {
                requiredForNotifications: validateRequiredIfNotify,
                emailInvalid: (value) =>
                  value.length === 0 ||
                  isEmailValid(value) ||
                  t('errorAddRecipient.emailInvalid'),
              },
            }}
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                error={errors.recipient_email !== undefined}
                helperText={errors.recipient_email?.message}
              />
            )}
          />
        </TableCell>
        <TableCell>
          <ReactHookFormSelect
            name="recipient_notify"
            label=""
            control={control}
            size="small"
          >
            <MenuItem key="no" value="no">
              {t('notifyRecipientOptions.no')}
            </MenuItem>
            <MenuItem key="yes" value="yes">
              {t('notifyRecipientOptions.yes')}
            </MenuItem>
          </ReactHookFormSelect>
        </TableCell>
        <TableCell>
          <Controller
            name="units"
            control={control}
            rules={{ required: t('errorAddRecipient.unitsNotProvided') }}
            render={({ field: { onChange, ..._field } }) => (
              <TextField
                size="small"
                {..._field}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  onChange(e.target.value);
                }}
                error={errors.units !== undefined}
                helperText={errors.units?.message}
              />
            )}
          />
        </TableCell>
        <TableCell>
          <Controller
            name="recipient_message"
            control={control}
            render={({ field }) => (
              <TextField
                sx={{ minWidth: 200 }}
                size="small"
                multiline
                maxRows={3}
                {...field}
              />
            )}
          />
        </TableCell>
      </TableRow>
      <DevTool control={control} />
    </>
  );
};

export default NewRow;
