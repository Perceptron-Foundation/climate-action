import React from 'react';
import styles from './LandingSection.module.scss';

export default function LandingSection(props: any) {
  return (
    <div
      className={
        props.noFixedHeight
          ? styles.landingSectionNoFixedHeight
          : styles.landingSection
      }
      style={{
        background: `transparent url(${
          props.imageSrc
            ? props.imageSrc
            : '/tenants/planet/images/home/BackgroundImage.png'
        }) 0% 0% no-repeat padding-box`,
        mixBlendMode: 'darken',
        backgroundSize: 'cover',
      }}
    >
      {/* <LazyLoad> */}
      {/* <img
        className={
          props.fixedBg ? styles.backgroundImageFixed : styles.backgroundImage
        }
        src={
          props.imageSrc
            ? props.imageSrc
            : '/tenants/planet/images/home/BackgroundImage.png'
        }
      /> */}
      {/* </LazyLoad> */}

      {props.children}
    </div>
  );
}
