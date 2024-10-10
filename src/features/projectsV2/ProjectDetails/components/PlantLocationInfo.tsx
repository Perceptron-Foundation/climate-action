import { useMemo } from 'react';
import * as turf from '@turf/turf';
import {
  PlantLocation,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';
import styles from '../styles/PlantLocationInfo.module.scss';
import PlantLocationHeader from './microComponents/PlantLocationHeader';
import SpeciesPlanted from './microComponents/SpeciesPlanted';
import SampleTrees from './microComponents/SampleTrees';
import TreeMapperBrand from './microComponents/TreeMapperBrand';
import PlantingDetails from './microComponents/PlantingDetails';
import { useTranslations } from 'next-intl';
import ImageSlider from './microComponents/ImageSlider';
import MobileInfoSwiper from '../../MobileInfoSwiper';

interface Props {
  plantLocationInfo: PlantLocation | SamplePlantLocation | null;
  isMobile: boolean;
}

const PlantLocationInfo = ({ plantLocationInfo, isMobile }: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');

  const isMultiTreeRegistration =
    plantLocationInfo?.type === 'multi-tree-registration';
  const { totalTreesCount, plantedLocationArea } = useMemo(() => {
    const totalTreesCount = isMultiTreeRegistration
      ? plantLocationInfo.plantedSpecies.reduce(
          (sum, species) => sum + species.treeCount,
          0
        )
      : 0;
    const area = plantLocationInfo?.geometry
      ? turf.area(plantLocationInfo?.geometry)
      : 0;
    const plantedLocationArea = area / 10000;
    return { totalTreesCount, plantedLocationArea };
  }, [plantLocationInfo?.geometry, plantLocationInfo?.type]);

  const plantingDensity = totalTreesCount / plantedLocationArea;

  const sampleInterventionSpeciesImages = useMemo(() => {
    if (isMultiTreeRegistration) {
      const result = plantLocationInfo.sampleInterventions.map((item) => {
        return {
          id: item.coordinates[0].id,
          image: item.coordinates[0].image ?? '',
          description: tProjectDetails('sampleTreeTag', { tag: item.tag }),
        };
      });
      return result;
    }
  }, [isMultiTreeRegistration ? plantLocationInfo.sampleInterventions : null]);

  const shouldDisplayImageCarousel =
    sampleInterventionSpeciesImages !== undefined &&
    sampleInterventionSpeciesImages?.length > 0;

  const content = [
    <>
      <PlantLocationHeader
        key="plantLocationHeader"
        plHid={plantLocationInfo?.hid}
        totalTreesCount={totalTreesCount}
        plantedLocationArea={plantedLocationArea}
      />
      {shouldDisplayImageCarousel && (
        <ImageSlider
          key="imageSlider"
          images={sampleInterventionSpeciesImages}
          type="coordinate"
          isMobile={isMobile}
          imageSize="large"
          allowFullView={!isMobile}
        />
      )}
    </>,
    <PlantingDetails
      key="plantingDetails"
      plantingDensity={plantingDensity}
      plantDate={plantLocationInfo?.interventionStartDate}
    />,
    isMultiTreeRegistration && plantLocationInfo.plantedSpecies.length > 0 && (
      <SpeciesPlanted
        key="speciesPlanted"
        totalTreesCount={totalTreesCount}
        plantedSpecies={plantLocationInfo.plantedSpecies}
      />
    ),
    isMultiTreeRegistration &&
      plantLocationInfo.sampleInterventions.length > 0 && (
        <SampleTrees
          key="sampleTrees"
          sampleInterventions={plantLocationInfo.sampleInterventions}
        />
      ),
  ].filter(Boolean);

  return isMobile ? (
    <MobileInfoSwiper slides={content} />
  ) : (
    <section className={styles.plantLocationInfoSection}>
      {content}
      <TreeMapperBrand />
    </section>
  );
};

export default PlantLocationInfo;
