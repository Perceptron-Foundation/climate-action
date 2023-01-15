import React, { useContext, ReactElement, useState } from 'react';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import styles from './GiftFunds.module.scss';
import { useTranslation } from 'next-i18next';
import { GiftFunds } from '../../common/types/user';

const Details = (): ReactElement | null => {
  const { user } = useContext(UserPropsContext);
  const { t, ready } = useTranslation('giftfunds');
  const [validGiftFunds, setValidGiftFunds] = useState<GiftFunds[] | null>(
    null
  );

  React.useEffect(() => {
    const nonZeroOpenUnitsGiftFunds = user.planetCash?.giftFunds.filter(
      (gift) => gift.openUnits !== 0
    );
    setValidGiftFunds(
      nonZeroOpenUnitsGiftFunds ? nonZeroOpenUnitsGiftFunds : null
    );
  }, [user]);

  if (ready && user.planetCash) {
    return (
      <div className={styles.allGiftFundscontainer}>
        {validGiftFunds?.map((gift: GiftFunds, index: number) => (
          //Not displaying details for gift fund where open units = 0
          <div className={styles.container} key={index}>
            <div className={styles.container_heading}>
              <b>
                {user.planetCash?.country}/{user.planetCash?.currency}{' '}
                {t('title')}
              </b>
            </div>
            <hr />
            <div className={styles.container_details}>
              <div className={styles.project}>
                <b>{t('project')}</b>
                <p>{gift.project}</p>
              </div>

              <div className={styles.unit}>
                <b>{t('units')}</b>
                <p>{Number(gift.openUnits / 100).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default Details;
