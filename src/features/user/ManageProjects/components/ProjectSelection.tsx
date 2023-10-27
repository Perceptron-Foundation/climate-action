import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import Styles from '../../../../../src/features/user/ManageProjects/StepForm.module.scss';
import { SetState } from '../../../common/types/common';

interface ProjectSelectionProps {
  setTabSelected: SetState<number>;
}

export default function ProjectSelection({
  setTabSelected,
}: ProjectSelectionProps): ReactElement {
  const router = useRouter();
  const { t, ready } = useTranslation('manageProjects');

  return ready ? (
    <div className={Styles.projectTypes}>
      <div>
        <button
          id={'addProjectBut'}
          className={'add-projects-button'}
          onClick={() => {
            setTabSelected(1);
            router.push('/profile/projects/new-project/?purpose=trees');
          }}
        >
          {t('manageProjects:restorationProject')}
        </button>
      </div>
      <div>
        <button
          id={'conservationProj'}
          className={'add-projects-button'}
          onClick={() => {
            setTabSelected(1);
            router.push('/profile/projects/new-project/?purpose=conservation');
          }}
        >
          {t('manageProjects:conservationProject')}
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
}
