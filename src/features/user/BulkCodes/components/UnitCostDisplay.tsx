import type { ReactElement } from 'react';
import type { CurrencyCode, UnitTypes } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import { TextField } from '@mui/material';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
interface UnitCostDisplayProps {
  unitCost: number | '-';
  currency: CurrencyCode | '';
  unitType: UnitTypes | undefined;
}

const UnitCostDisplay = ({
  unitCost,
  currency,
  unitType,
}: UnitCostDisplayProps): ReactElement | null => {
  const t = useTranslations('BulkCodes');

  return (
    <InlineFormDisplayGroup>
      <TextField
        label={t('costPerUnit')}
        value={`${unitCost} ${currency}`}
        inputProps={{ 'aria-label': t('costPerUnit') }}
        disabled
      />
      <TextField
        label={t('unitOfMeasurement')}
        value={
          unitType && unitType !== 'currency' ? t(`units.${unitType}`) : '-'
        }
        inputProps={{ 'aria-label': t('unitOfMeasurement') }}
        disabled
      />
    </InlineFormDisplayGroup>
  );
};

export default UnitCostDisplay;
