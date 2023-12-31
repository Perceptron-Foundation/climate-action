import { ConservAreaClusterMarker } from './ClusterMarker';
import SingleMarker from './SingleMarker';
import { useEffect, useState, ReactElement } from 'react';
import { ClusterMarkerProps, Cluster } from '../../../../common/types/map';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import { useMyForest } from '../../../../common/Layout/MyForestContext';

const ConservationMarker = ({
  viewport,
  mapRef,
}: ClusterMarkerProps): ReactElement => {
  const { conservationProjectGeoJson } = useMyForest();
  const [clusters, setClusters] = useState<Cluster[] | undefined>(undefined);
  const { viewState } = viewport;

  useEffect(() => {
    if (conservationProjectGeoJson) {
      const data = _getClusterGeojson(
        viewState,
        mapRef,
        conservationProjectGeoJson
      );
      setClusters(data);
    }
  }, [viewport, conservationProjectGeoJson]);

  return (
    <>
      {clusters &&
        clusters.map((singleCluster, key) => {
          if (singleCluster.id) {
            return (
              <ConservAreaClusterMarker key={key} geoJson={singleCluster} />
            );
          } else {
            return <SingleMarker key={key} geoJson={singleCluster} />;
          }
        })}
    </>
  );
};

export default ConservationMarker;
