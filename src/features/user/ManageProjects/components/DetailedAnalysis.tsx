import React, { ReactElement, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import styles from './../StepForm.module.scss';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import ProjectCertificates from './ProjectCertificates';
import InfoIcon from '../../../../../public/assets/images/icons/manageProjects/Info';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';
import { useRouter } from 'next/router';
import { SxProps, TextField, Button, Tooltip } from '@mui/material';
import themeProperties from '../../../../theme/themeProperties';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError, InterventionTypes } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ProjectCreationTabs } from '..';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import {
  DetailedAnalysisProps,
  SiteOwners,
  PlantingSeason,
  ProfileProjectTrees,
  ProfileProjectConservation,
  InterventionOption,
} from '../../../common/types/project';

const dialogSx: SxProps = {
  '& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected': {
    backgroundColor: themeProperties.primaryColor,
    color: '#fff',
  },

  '& .MuiPickersDay-dayWithMargin': {
    '&:hover': {
      backgroundColor: themeProperties.primaryColor,
      color: '#fff',
    },
  },
  '.MuiDialogActions-root': {
    paddingBottom: '12px',
  },
};

const yearDialogSx: SxProps = {
  '& .PrivatePickersYear-yearButton': {
    '&:hover': {
      backgroundColor: themeProperties.primaryColor,
      color: '#fff',
    },

    '&.Mui-selected': {
      backgroundColor: `${themeProperties.primaryColor} !important`,
      color: '#fff',
    },
  },
  '.MuiDialogActions-root': {
    paddingBottom: '12px',
  },
};

type FormData = {
  employeesCount: string;
  acquisitionYear: Date | null;
  mainChallenge: string;
  motivation: string;
  longTermPlan: string;
  siteOwnerName: string;
};

type TreeFormData = FormData & {
  purpose: 'trees';
  yearAbandoned: Date | null;
  firstTreePlanted: Date | null;
  plantingDensity: string;
  maxPlantingDensity: string;
  degradationYear: Date | null;
  degradationCause: string;
};

type ConservationFormData = FormData & {
  purpose: 'conservation';
  areaProtected: string;
  startingProtectionYear: Date | null;
  actions: string;
  benefits: string;
};

export default function DetailedAnalysis({
  handleBack,
  userLang,
  token,
  handleNext,
  projectDetails,
  setProjectDetails,
  projectGUID,
  handleReset,
  purpose,
}: DetailedAnalysisProps): ReactElement {
  const { t, ready } = useTranslation(['manageProjects', 'common']);
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const { logoutUser } = useUserProps();
  const [siteOwners, setSiteOwners] = React.useState<SiteOwners[]>([
    {
      id: 1,
      title: ready ? t('manageProjects:siteOwnerPrivate') : '',
      value: 'private',
      isSet: false,
    },
    {
      id: 2,
      title: ready ? t('manageProjects:siteOwnerPublic') : '',
      value: 'public-property',
      isSet: false,
    },
    {
      id: 3,
      title: ready ? t('manageProjects:siteOwnerSmallHolding') : '',
      value: 'smallholding',
      isSet: false,
    },
    {
      id: 4,
      title: ready ? t('manageProjects:siteOwnerCommunal') : '',
      value: 'communal-land',
      isSet: false,
    },
    {
      id: 5,
      title: ready ? t('manageProjects:siteOwnerOwned') : '',
      value: 'owned-by-owner',
      isSet: false,
    },
    {
      id: 6,
      title: ready ? t('manageProjects:siteOwnerOther') : '',
      value: 'other',
      isSet: false,
    },
  ]);
  const [isUploadingData, setIsUploadingData] = React.useState<boolean>(false);

  const [plantingSeasons, setPlantingSeasons] = React.useState<
    PlantingSeason[]
  >([
    { id: 1, title: ready ? t('common:january') : '', isSet: false },
    { id: 2, title: ready ? t('common:february') : '', isSet: false },
    { id: 3, title: ready ? t('common:march') : '', isSet: false },
    { id: 4, title: ready ? t('common:april') : '', isSet: false },
    { id: 5, title: ready ? t('common:may') : '', isSet: false },
    { id: 6, title: ready ? t('common:june') : '', isSet: false },
    { id: 7, title: ready ? t('common:july') : '', isSet: false },
    { id: 8, title: ready ? t('common:august') : '', isSet: false },
    { id: 9, title: ready ? t('common:september') : '', isSet: false },
    { id: 10, title: ready ? t('common:october') : '', isSet: false },
    { id: 11, title: ready ? t('common:november') : '', isSet: false },
    { id: 12, title: ready ? t('common:december') : '', isSet: false },
  ]);

  const [interventionOptions, setInterventionOptions] = React.useState<
    InterventionOption[]
  >([
    ['assisting-seed-rain', false],
    ['control-remove-livestock', false],
    ['cut-suppressing-grass', false],
    ['direct-seeding', false],
    ['enrichment-planting', false],
    ['establish-firebreaks', false],
    ['fire-patrols', false],
    ['fire-suppression-team', false],
    ['liberating-regenerants', false],
    ['maintenance', false],
    ['marking-regenerants', false],
    ['other-interventions', false],
    ['planting-trees', false],
    ['removal-contaminated-soil', false],
    ['removal-invasive-species', false],
    ['soil-improvement', false],
    ['stop-tree-harvesting', false],
  ]);

  const [mainInterventions, setMainInterventions] = React.useState<
    InterventionTypes[]
  >([]);
  const [isInterventionsMissing, setIsInterventionsMissing] = React.useState<
    boolean | null
  >(null);

  const [minDensity, setMinDensity] = React.useState<number | string | null>(0);

  const handleSetPlantingSeasons = (id: number) => {
    const month = plantingSeasons[id - 1];
    const updatedMonth = month;
    updatedMonth.isSet = !month.isSet;
    const plantingSeasonsUpdated = plantingSeasons;
    plantingSeasonsUpdated[id - 1] = updatedMonth;
    setPlantingSeasons([...plantingSeasonsUpdated]);
  };

  const handleSetSiteOwner = (id: number) => {
    const owner = siteOwners[id - 1];
    const updatedOwner = owner;
    updatedOwner.isSet = !owner.isSet;
    const updatedSiteOwners = siteOwners;
    updatedSiteOwners[id - 1] = updatedOwner;
    setSiteOwners([...updatedSiteOwners]);
  };

  const updateMainInterventions = (interventionToUpdate: InterventionTypes) => {
    const updatedInterventions: InterventionOption[] = interventionOptions.map(
      (interventionOption) => {
        const [intervention, isSet] = interventionOption;
        return intervention === interventionToUpdate
          ? [intervention, !isSet]
          : [intervention, isSet];
      }
    );
    setIsInterventionsMissing(
      !updatedInterventions.some(([_intervention, isSet]) => isSet === true)
    );
    setInterventionOptions(updatedInterventions);
  };

  useEffect(() => {
    setMainInterventions(
      interventionOptions
        .filter(([_intervention, isSet]) => isSet)
        .map(([intervention, _isSet]) => intervention)
    );
  }, [interventionOptions]);

  const router = useRouter();

  React.useEffect(() => {
    if (!projectGUID || projectGUID === '') {
      handleReset(ready ? t('manageProjects:resetMessage') : '');
    }
  });

  // TODO - set up better types for Form Data
  const defaultFormData: TreeFormData | ConservationFormData =
    purpose === 'trees'
      ? {
          purpose: 'trees',
          yearAbandoned: new Date(),
          firstTreePlanted: null,
          plantingDensity: '',
          maxPlantingDensity: '',
          employeesCount: '',
          mainChallenge: '',
          siteOwnerName: '',
          acquisitionYear: null,
          degradationYear: null,
          degradationCause: '',
          longTermPlan: '',
          motivation: '',
        }
      : {
          purpose: 'conservation',
          actions: '',
          benefits: '',
          employeesCount: '',
          acquisitionYear: null,
          startingProtectionYear: null,
          areaProtected: '',
          siteOwnerName: '',
          mainChallenge: '',
          longTermPlan: '',
          motivation: '',
        };

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TreeFormData | ConservationFormData>({
    mode: 'onBlur',
    // TODO - set up better form types to resolve this error
    defaultValues: defaultFormData,
  });

  const owners: string[] = [];
  for (let i = 0; i < siteOwners.length; i++) {
    if (siteOwners[i].isSet) {
      owners.push(`${siteOwners[i].value}`);
    }
  }

  const months: number[] = [];
  for (let i = 0; i < plantingSeasons.length; i++) {
    if (plantingSeasons[i].isSet) {
      const j = i + 1;
      months.push(j);
    }
  }
  // for validating maxplanting density value > planting density value
  React.useEffect(() => {
    if (
      projectDetails &&
      projectDetails.purpose === 'trees' &&
      router.query.type === 'detail-analysis'
    ) {
      setMinDensity(projectDetails.metadata.plantingDensity);
    }
  }, [router.query.type]);

  const onSubmit = async (data: TreeFormData | ConservationFormData) => {
    if (mainInterventions.length === 0) {
      setIsInterventionsMissing(true);
      return;
    }
    setIsUploadingData(true);
    const submitData =
      data.purpose === 'trees'
        ? {
            metadata: {
              degradationCause: data.degradationCause,
              degradationYear: data.degradationYear
                ? data.degradationYear.getFullYear()
                : null,
              employeesCount: data.employeesCount,
              acquisitionYear: data.acquisitionYear
                ? data.acquisitionYear.getFullYear()
                : null,
              mainInterventions: mainInterventions,
              longTermPlan: data.longTermPlan,
              mainChallenge: data.mainChallenge,
              motivation: data.motivation,
              plantingDensity: data.plantingDensity,
              maxPlantingDensity: data.maxPlantingDensity,
              plantingSeasons: months,
              siteOwnerName: data.siteOwnerName,
              siteOwnerType: owners,
              yearAbandoned: data.yearAbandoned
                ? data.yearAbandoned.getFullYear()
                : null,
              firstTreePlanted: data.firstTreePlanted
                ? `${data.firstTreePlanted.getFullYear()}-${
                    data.firstTreePlanted.getMonth() + 1
                  }-${data.firstTreePlanted.getDate()}`
                : null,
            },
          }
        : {
            metadata: {
              acquisitionYear: data.acquisitionYear
                ? data.acquisitionYear.getFullYear()
                : null,
              activitySeasons: months,
              areaProtected: data.areaProtected,
              employeesCount: data.employeesCount,
              mainInterventions: mainInterventions,
              startingProtectionYear: data.startingProtectionYear
                ? data.startingProtectionYear.getFullYear()
                : null,
              landOwnershipType: owners,
              actions: data.actions,
              mainChallenge: data.mainChallenge,
              motivation: data.motivation,
              longTermPlan: data.longTermPlan,
              benefits: data.benefits,
              siteOwnerName: data.siteOwnerName,
            },
          };

    try {
      const res = await putAuthenticatedRequest<
        ProfileProjectTrees | ProfileProjectConservation
      >(`/app/projects/${projectGUID}`, submitData, token, logoutUser);
      setProjectDetails(res);
      setIsUploadingData(false);
      setIsInterventionsMissing(null);
      handleNext(ProjectCreationTabs.PROJECT_SITES);
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  // Use Effect to hide error message after 10 seconds

  React.useEffect(() => {
    if (projectDetails) {
      const { metadata, purpose: projectPurpose } = projectDetails;
      const formData: TreeFormData | ConservationFormData =
        projectPurpose === 'trees'
          ? {
              purpose: 'trees',
              yearAbandoned: metadata.yearAbandoned
                ? new Date(new Date().setFullYear(metadata.yearAbandoned))
                : new Date(),
              firstTreePlanted: metadata.firstTreePlanted
                ? new Date(metadata.firstTreePlanted)
                : new Date(),
              plantingDensity: metadata.plantingDensity?.toString() || '',
              maxPlantingDensity: metadata.maxPlantingDensity?.toString() || '',
              employeesCount: metadata.employeesCount?.toString() || '',
              mainChallenge: metadata.mainChallenge || '',
              siteOwnerName: metadata.siteOwnerName || '',
              acquisitionYear: metadata.acquisitionYear
                ? new Date(new Date().setFullYear(metadata.acquisitionYear))
                : new Date(),
              degradationYear: metadata.degradationYear
                ? new Date(new Date().setFullYear(metadata.degradationYear))
                : new Date(),
              degradationCause: metadata.degradationCause || '',
              longTermPlan: metadata.longTermPlan || '',
              motivation: metadata.motivation || '',
            }
          : {
              purpose: 'conservation',
              actions: metadata.actions || '',
              benefits: metadata.benefits || '',
              employeesCount: metadata.employeesCount?.toString() || '',
              acquisitionYear: metadata.acquisitionYear
                ? new Date(new Date().setFullYear(metadata.acquisitionYear))
                : new Date(),
              startingProtectionYear: metadata.startingProtectionYear
                ? new Date(
                    new Date().setFullYear(metadata.startingProtectionYear)
                  )
                : new Date(),
              areaProtected: metadata.areaProtected?.toString() || '',
              mainChallenge: metadata.mainChallenge || '',
              siteOwnerName: metadata.siteOwnerName || '',
              longTermPlan: metadata.longTermPlan || '',
              motivation: metadata.motivation || '',
            };
      // set planting seasons

      if (projectPurpose === 'trees') {
        if (metadata.plantingSeasons && metadata.plantingSeasons.length > 0) {
          const updatedPlantingSeasons = plantingSeasons;
          for (let i = 0; i < metadata.plantingSeasons.length; i++) {
            for (let j = 0; j < updatedPlantingSeasons.length; j++) {
              if (
                updatedPlantingSeasons[j].id === metadata.plantingSeasons[i]
              ) {
                updatedPlantingSeasons[j].isSet = true;
              }
            }
          }
          setPlantingSeasons(updatedPlantingSeasons);
        }
      } else {
        if (metadata.activitySeasons && metadata.activitySeasons.length > 0) {
          const updatedActivitySeasons = plantingSeasons;
          for (let i = 0; i < metadata.activitySeasons.length; i++) {
            for (let j = 0; j < updatedActivitySeasons.length; j++) {
              if (
                updatedActivitySeasons[j].id === metadata.activitySeasons[i]
              ) {
                updatedActivitySeasons[j].isSet = true;
              }
            }
          }
          setPlantingSeasons(updatedActivitySeasons);
        }
      }

      // set owner type

      if (projectPurpose === 'trees') {
        if (metadata.siteOwnerType && metadata.siteOwnerType.length > 0) {
          const newSiteOwners = siteOwners;
          for (let i = 0; i < metadata.siteOwnerType.length; i++) {
            for (let j = 0; j < newSiteOwners.length; j++) {
              if (newSiteOwners[j].value === metadata.siteOwnerType[i]) {
                newSiteOwners[j].isSet = true;
              }
            }
          }
          setSiteOwners(newSiteOwners);
        }
      } else {
        if (
          projectDetails?.metadata?.landOwnershipType &&
          projectDetails?.metadata?.landOwnershipType.length > 0
        ) {
          const newSiteOwners = siteOwners;
          for (
            let i = 0;
            i < projectDetails?.metadata?.landOwnershipType.length;
            i++
          ) {
            for (let j = 0; j < newSiteOwners.length; j++) {
              if (
                newSiteOwners[j].value ===
                projectDetails?.metadata?.landOwnershipType[i]
              ) {
                newSiteOwners[j].isSet = true;
              }
            }
          }
          setSiteOwners(newSiteOwners);
        }
      }

      // set main interventions
      if (metadata.mainInterventions.length > 0) {
        const initialInterventionOptions: InterventionOption[] =
          interventionOptions.map(([intervention, isSet]) =>
            metadata.mainInterventions.includes(intervention)
              ? [intervention, true]
              : [intervention, isSet]
          );
        setInterventionOptions(initialInterventionOptions);
      }

      reset(formData);
    }
  }, [projectDetails]);

  return ready ? (
    <CenteredContainer>
      <StyledForm>
        <div className="inputContainer">
          {purpose === 'trees' ? (
            <>
              <InlineFormDisplayGroup>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={
                    localeMapForDate[userLang]
                      ? localeMapForDate[userLang]
                      : localeMapForDate['en']
                  }
                >
                  <Controller
                    name="yearAbandoned"
                    control={control}
                    defaultValue={new Date()}
                    render={({ field: { onChange, value } }) => (
                      <MuiDatePicker
                        views={['year']}
                        value={value}
                        onChange={onChange}
                        label={t('manageProjects:yearOfAbandonment')}
                        renderInput={(props) => (
                          <TextField
                            required
                            {...props}
                            InputProps={{
                              endAdornment: (
                                <Tooltip
                                  title={t('manageProjects:yearAbandonedInfo')}
                                  arrow
                                >
                                  <span className={styles.tooltipIcon}>
                                    <InfoIcon />
                                  </span>
                                </Tooltip>
                              ),
                            }}
                          />
                        )}
                        disableFuture
                        minDate={new Date(new Date().setFullYear(1950))}
                        maxDate={new Date()}
                        DialogProps={{
                          sx: yearDialogSx,
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>

                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={
                    localeMapForDate[userLang]
                      ? localeMapForDate[userLang]
                      : localeMapForDate['en']
                  }
                >
                  <Controller
                    name="firstTreePlanted"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <MuiDatePicker
                        label={t('manageProjects:labelRestorationStarted')}
                        value={value}
                        onChange={onChange}
                        renderInput={(props) => (
                          <TextField {...props} required />
                        )}
                        disableFuture
                        minDate={new Date(new Date().setFullYear(1950))}
                        inputFormat="d MMMM yyyy"
                        maxDate={new Date()}
                        DialogProps={{
                          sx: dialogSx,
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </InlineFormDisplayGroup>
            </>
          ) : (
            <InlineFormDisplayGroup>
              <Controller
                name="areaProtected"
                control={control}
                rules={{
                  required: t('manageProjects:validation', {
                    fieldName: t('manageProjects:areaProtected'),
                  }),
                  validate: (value) => (value ? parseInt(value, 10) > 0 : true),
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    required
                    label={t('manageProjects:areaProtected')}
                    variant="outlined"
                    type="number"
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    error={errors.areaProtected !== undefined}
                    helperText={
                      errors.areaProtected !== undefined &&
                      errors.areaProtected.message
                    }
                    InputProps={{
                      endAdornment: (
                        <Tooltip
                          title={t('manageProjects:areaProtectedInfo')}
                          arrow
                        >
                          <span className={styles.tooltipIcon}>
                            <InfoIcon />
                          </span>
                        </Tooltip>
                      ),
                    }}
                  />
                )}
              />
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={
                  localeMapForDate[userLang]
                    ? localeMapForDate[userLang]
                    : localeMapForDate['en']
                }
              >
                <Controller
                  name="startingProtectionYear"
                  control={control}
                  rules={{
                    required: t('manageProjects:validation', {
                      fieldName: t('manageProjects:date'),
                    }),
                  }}
                  render={({ field: { value, onChange } }) => (
                    <MuiDatePicker
                      label={t('manageProjects:protectionStartedIN')}
                      value={value}
                      onChange={onChange}
                      renderInput={(props) => (
                        <TextField
                          required
                          {...props}
                          error={errors.startingProtectionYear !== undefined}
                          helperText={
                            errors.startingProtectionYear !== undefined &&
                            errors.startingProtectionYear.message
                          }
                        />
                      )}
                      disableFuture
                      minDate={new Date(new Date().setFullYear(1950))}
                      views={['year']}
                      maxDate={new Date()}
                      DialogProps={{
                        sx: yearDialogSx,
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </InlineFormDisplayGroup>
          )}
          <InlineFormDisplayGroup>
            <Controller
              name="employeesCount"
              control={control}
              rules={{
                required: t('manageProjects:validation', {
                  fieldName: t('manageProjects:employeeCount'),
                }),
                validate: (value) => parseInt(value, 10) > 0,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  required
                  label={t('manageProjects:employeeCount')}
                  variant="outlined"
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]./g, '');
                    onChange(e.target.value);
                  }}
                  value={value}
                  onBlur={onBlur}
                  error={errors.employeesCount !== undefined}
                  helperText={
                    errors.employeesCount !== undefined &&
                    errors.employeesCount.message
                  }
                  InputProps={{
                    endAdornment: (
                      <Tooltip
                        title={t('manageProjects:employeesCountInfo')}
                        arrow
                      >
                        <span className={styles.tooltipIcon}>
                          <InfoIcon />
                        </span>
                      </Tooltip>
                    ),
                  }}
                />
              )}
            />
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={
                localeMapForDate[userLang]
                  ? localeMapForDate[userLang]
                  : localeMapForDate['en']
              }
            >
              <Controller
                name="acquisitionYear"
                control={control}
                rules={{
                  required: t('manageProjects:validation', {
                    fieldName: t('manageProjects:acquisitionYear'),
                  }),
                }}
                render={({ field: { onChange, value } }) => (
                  <MuiDatePicker
                    label={t('manageProjects:acquisitionYear')}
                    value={value}
                    onChange={onChange}
                    renderInput={(props) => (
                      <TextField
                        required
                        {...props}
                        error={errors.startingProtectionYear !== undefined}
                        helperText={
                          errors.startingProtectionYear !== undefined &&
                          errors.startingProtectionYear.message
                        }
                      />
                    )}
                    disableFuture
                    minDate={new Date(new Date().setFullYear(1950))}
                    views={['year']}
                    maxDate={new Date()}
                    DialogProps={{
                      sx: yearDialogSx,
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </InlineFormDisplayGroup>
          <div className={styles.multiSelectContainer}>
            <div className={styles.multiSelectField}>
              <p className={styles.multiSelectLabel}>
                {t('manageProjects:labelMainInterventions') + '*'}
              </p>
              {interventionOptions.map(([intervention, isSet]) => {
                return (
                  <div
                    className={styles.multiSelectInput}
                    key={intervention}
                    onClick={() => updateMainInterventions(intervention)}
                  >
                    <div
                      className={`${styles.multiSelectInputCheck} ${
                        isSet ? styles.multiSelectInputCheckTrue : ''
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13.02"
                        height="9.709"
                        viewBox="0 0 13.02 9.709"
                      >
                        <path
                          id="check-solid"
                          d="M4.422,74.617.191,70.385a.651.651,0,0,1,0-.921l.921-.921a.651.651,0,0,1,.921,0l2.851,2.85,6.105-6.105a.651.651,0,0,1,.921,0l.921.921a.651.651,0,0,1,0,.921L5.343,74.617a.651.651,0,0,1-.921,0Z"
                          transform="translate(0 -65.098)"
                          fill="#fff"
                        />
                      </svg>
                    </div>
                    <p style={{ color: 'var(--dark)' }}>
                      {t(`manageProjects:interventionTypes.${intervention}`)}
                    </p>
                  </div>
                );
              })}
            </div>
            {isInterventionsMissing === true && (
              <span className={styles.formErrors}>
                {t('manageProjects:missingInterventionsError')}
              </span>
            )}
          </div>
          <div className={styles.multiSelectField}>
            <p className={styles.multiSelectLabel}>
              {' '}
              {purpose === 'trees'
                ? t('manageProjects:labelRestorationSeasons')
                : t('manageProjects:protectionSeasons')}{' '}
            </p>
            {plantingSeasons.map((month) => {
              return (
                <div
                  className={styles.multiSelectInput}
                  key={month.id}
                  onClick={() => {
                    handleSetPlantingSeasons(month.id);
                  }}
                >
                  <div
                    className={`${styles.multiSelectInputCheck} ${
                      month.isSet ? styles.multiSelectInputCheckTrue : ''
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13.02"
                      height="9.709"
                      viewBox="0 0 13.02 9.709"
                    >
                      <path
                        id="check-solid"
                        d="M4.422,74.617.191,70.385a.651.651,0,0,1,0-.921l.921-.921a.651.651,0,0,1,.921,0l2.851,2.85,6.105-6.105a.651.651,0,0,1,.921,0l.921.921a.651.651,0,0,1,0,.921L5.343,74.617a.651.651,0,0,1-.921,0Z"
                        transform="translate(0 -65.098)"
                        fill="#fff"
                      />
                    </svg>
                  </div>
                  <p style={{ color: 'var(--dark)' }}>{month.title}</p>
                </div>
              );
            })}
          </div>
          {purpose === 'trees' ? (
            <>
              <InlineFormDisplayGroup spacing="none">
                {/* Integer - the planting density expressed in trees per ha */}
                <Controller
                  name="plantingDensity"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value.length === 0 || parseInt(value, 10) > 1,
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextField
                      label={t('manageProjects:plantingDensity')}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <p className={styles.inputEndAdornment}>
                            {t('manageProjects:treePerHa')}
                          </p>
                        ),
                      }}
                      onChange={(e) => {
                        setMinDensity(Number(e.target.value));
                        e.target.value = e.target.value.replace(/[^0-9]./g, '');
                        onChange(e.target.value);
                      }}
                      value={value}
                      onBlur={onBlur}
                      error={errors.plantingDensity !== undefined}
                      helperText={
                        errors.plantingDensity !== undefined &&
                        errors.plantingDensity.message
                      }
                    />
                  )}
                />
                <p className={styles.hyphen}>-</p>
                <Controller
                  name="maxPlantingDensity"
                  control={control}
                  rules={{
                    min: {
                      value: minDensity,
                      message: t('manageProjects:errorForMaxPlantingDensity'),
                    },
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextField
                      label={t('manageProjects:maxPlantingDensity')}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <p className={styles.inputEndAdornment}>
                            {t('manageProjects:treePerHa')}
                          </p>
                        ),
                      }}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]./g, '');
                        onChange(e.target.value);
                      }}
                      value={value}
                      onBlur={onBlur}
                      error={errors.maxPlantingDensity !== undefined}
                      helperText={
                        errors.maxPlantingDensity !== undefined &&
                        errors.maxPlantingDensity.message
                      }
                    />
                  )}
                />
              </InlineFormDisplayGroup>

              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={
                  localeMapForDate[userLang]
                    ? localeMapForDate[userLang]
                    : localeMapForDate['en']
                }
              >
                <Controller
                  name="degradationYear"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <MuiDatePicker
                      views={['year']}
                      value={value}
                      onChange={onChange}
                      label={t('manageProjects:yearOfDegradation')}
                      renderInput={(props) => <TextField {...props} />}
                      disableFuture
                      minDate={new Date(new Date().setFullYear(1950))}
                      maxDate={new Date()}
                      DialogProps={{
                        sx: yearDialogSx,
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </>
          ) : (
            <Controller
              name="actions"
              control={control}
              rules={{
                maxLength: {
                  value: 300,
                  message: t('manageProjects:max300Chars'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  label={t('manageProjects:forestProtectionType')}
                  variant="outlined"
                  multiline
                  minRows={2}
                  maxRows={4}
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
            />
          )}
          {purpose === 'trees' ? (
            <InlineFormDisplayGroup>
              <Controller
                name="degradationCause"
                control={control}
                rules={{
                  maxLength: {
                    value: 300,
                    message: t('manageProjects:max300Chars'),
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    label={t('manageProjects:causeOfDegradation')}
                    variant="outlined"
                    multiline
                    minRows={2}
                    maxRows={4}
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                    error={errors.degradationCause !== undefined}
                    helperText={
                      errors.degradationCause && errors.degradationCause.message
                    }
                    InputProps={{
                      endAdornment: (
                        <Tooltip title={t('manageProjects:max300Chars')} arrow>
                          <span className={styles.tooltipIcon}>
                            <InfoIcon />
                          </span>
                        </Tooltip>
                      ),
                    }}
                  />
                )}
              />
            </InlineFormDisplayGroup>
          ) : (
            <Controller
              name="benefits"
              control={control}
              rules={{
                maxLength: {
                  value: 300,
                  message: t('manageProjects:max300Chars'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  label={t('manageProjects:conservationImpacts')}
                  variant="outlined"
                  multiline
                  minRows={2}
                  maxRows={4}
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  error={errors.degradationCause !== undefined}
                  helperText={
                    errors.degradationCause !== undefined &&
                    errors.degradationCause.message
                  }
                />
              )}
            />
          )}
          {/* the main challenge the project is facing (max. 300 characters) */}
          <Controller
            name="mainChallenge"
            control={control}
            rules={{
              maxLength: {
                value: 300,
                message: t('manageProjects:max300Chars'),
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={t('manageProjects:mainChallenge')}
                variant="outlined"
                multiline
                minRows={2}
                maxRows={4}
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.mainChallenge !== undefined}
                helperText={
                  errors.mainChallenge !== undefined &&
                  errors.mainChallenge.message
                }
                InputProps={{
                  endAdornment: (
                    <Tooltip
                      title={t('manageProjects:mainChallengeInfo')}
                      arrow
                    >
                      <span className={styles.tooltipIcon}>
                        <InfoIcon />
                      </span>
                    </Tooltip>
                  ),
                }}
              />
            )}
          />
          {/* the reason this project has been created (max. 300 characters) */}
          <Controller
            name="motivation"
            control={control}
            rules={{
              maxLength: {
                value: 300,
                message: t('manageProjects:max300Chars'),
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={t('manageProjects:whyThisSite')}
                variant="outlined"
                multiline
                minRows={2}
                maxRows={4}
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.motivation !== undefined}
                helperText={
                  errors.motivation !== undefined && errors.motivation.message
                }
                InputProps={{
                  endAdornment: (
                    <Tooltip title={t('manageProjects:max300Chars')} arrow>
                      <span className={styles.tooltipIcon}>
                        <InfoIcon />
                      </span>
                    </Tooltip>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="longTermPlan"
            control={control}
            rules={{
              maxLength: {
                value: 300,
                message: t('manageProjects:max300Chars'),
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={t('manageProjects:longTermPlan')}
                variant="outlined"
                multiline
                minRows={2}
                maxRows={4}
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.longTermPlan !== undefined}
                helperText={
                  errors.longTermPlan !== undefined &&
                  errors.longTermPlan.message
                }
              />
            )}
          />
          <div className={styles.multiSelectField}>
            <p className={styles.multiSelectLabel}>
              {t('manageProjects:siteOwner')}
            </p>
            {siteOwners.map((owner) => {
              return (
                <div
                  className={styles.multiSelectInput}
                  style={{ width: 'fit-content' }}
                  key={owner.id}
                  onClick={() => handleSetSiteOwner(owner.id)}
                >
                  <div
                    className={`${styles.multiSelectInputCheck} ${
                      owner.isSet ? styles.multiSelectInputCheckTrue : ''
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13.02"
                      height="9.709"
                      viewBox="0 0 13.02 9.709"
                    >
                      <path
                        id="check-solid"
                        d="M4.422,74.617.191,70.385a.651.651,0,0,1,0-.921l.921-.921a.651.651,0,0,1,.921,0l2.851,2.85,6.105-6.105a.651.651,0,0,1,.921,0l.921.921a.651.651,0,0,1,0,.921L5.343,74.617a.651.651,0,0,1-.921,0Z"
                        transform="translate(0 -65.098)"
                        fill="#fff"
                      />
                    </svg>
                  </div>
                  <p style={{ color: 'var(--dark)' }}>{owner.title}</p>
                </div>
              );
            })}
          </div>
          <Controller
            name="siteOwnerName"
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={t('manageProjects:ownerName')}
                variant="outlined"
                onChange={onChange}
                value={value}
                onBlur={onBlur}
              />
            )}
          />
          <ProjectCertificates
            projectGUID={projectGUID}
            token={token}
            setIsUploadingData={setIsUploadingData}
            userLang={userLang}
          />
        </div>

        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_MEDIA)}
            variant="outlined"
            className="formButton"
            startIcon={<BackArrow />}
          >
            <p>{t('manageProjects:backToMedia')}</p>
          </Button>

          <Button
            onClick={handleSubmit(onSubmit)}
            className="formButton"
            data-test-id="detailAnalysisCont"
            variant="contained"
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('manageProjects:saveAndContinue')
            )}
          </Button>

          <Button
            className="formButton"
            variant="contained"
            onClick={() => handleNext(ProjectCreationTabs.PROJECT_SITES)}
          >
            {t('manageProjects:skip')}
          </Button>
        </div>
      </StyledForm>
    </CenteredContainer>
  ) : (
    <></>
  );
}
