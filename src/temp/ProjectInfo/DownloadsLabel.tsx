import React from 'react';
import styles from '../../features/projectsV2/ProjectDetails/styles/ProjectInfo.module.scss';

interface Props {
  children: React.JSX.Element;
}

const DownloadsLabel = ({ children }: Props) => {
  return <div className={styles.downloadLabel}>{children}</div>;
};

export default DownloadsLabel;
