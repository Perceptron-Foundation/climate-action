import { SetState } from '../../../common/types/common';
import { PlantLocation } from '../../../common/types/plantLocation';
import styles from '../../ProjectsMap/ProjectSiteDropDown/SiteDropdown.module.scss';

type SiteData = {
  siteName: string;
  siteArea: number;
  id: number;
};
interface ProjectSiteListProps {
  siteList: SiteData[];
  setSelectedSite: SetState<number | null>;
  setIsMenuOpen: SetState<boolean>;
  selectedSiteData: SiteData | undefined;
  setSelectedPlantLocation: SetState<PlantLocation | null>;
}
const ProjectSiteList = ({
  siteList,
  setSelectedSite,
  setIsMenuOpen,
  selectedSiteData,
  setSelectedPlantLocation,
}: ProjectSiteListProps) => {
  const handleSiteSelection = (index: number) => {
    setSelectedPlantLocation(null);
    setIsMenuOpen(false);
    setSelectedSite(index);
  };

  return (
    <ul className={styles.siteListOptions}>
      {siteList.map((site, index) => {
        return (
          <li
            className={`${styles.listItem} ${
              site.id === selectedSiteData?.id ? styles.selectedItem : ''
            }`}
            onClick={() => handleSiteSelection(index)}
            key={index}
          >
            <p>{site.siteName}</p>
            <p className={styles.siteArea}>{Math.round(site.siteArea)}ha</p>
          </li>
        );
      })}
    </ul>
  );
};

export default ProjectSiteList;
