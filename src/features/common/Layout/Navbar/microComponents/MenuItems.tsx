import { useTenant } from '../../TenantContext';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import UserIcon from './UserIcon';
import { useState, useEffect } from 'react';
import AboutUsSubMenu from './AboutUsSubMenu';
import { SetState } from '../../../types/common';
import { useMobileDetection } from '../../../../../utils/navbarUtils';

type Submenu = Omit<navLinkOptions, 'subMenu' | 'loggedInTitle'>;
interface navLinkOptions {
  title: string;
  onclick: string;
  visible: boolean;
  subMenu?: Submenu[];
  loggedInTitle?: string | undefined;
}
interface MenuItemProps {
  navLink: string;
  navLinkOptions: navLinkOptions;
  isMobile: boolean;
  menu: boolean;
  setMenu: SetState<boolean>;
}

const MenuItem = ({
  navLink,
  navLinkOptions,
  isMobile,
  menu,
  setMenu,
}: MenuItemProps) => {
  const router = useRouter();
  const t = useTranslations('Common');
  const { tenantConfig } = useTenant();
  const hasSubMenu =
    navLinkOptions.subMenu && navLinkOptions.subMenu.length > 0;

  const handleClick = () => {
    if (isMobile && hasSubMenu) {
      setMenu(!menu);
    }
  };

  const handleMouseOver = () => {
    if (hasSubMenu) {
      setMenu(isMobile ? menu : true);
    }
  };

  const handleMouseLeave = () => {
    if (hasSubMenu) {
      setMenu(isMobile ? menu : false);
    }
  };

  const isActive = () => {
    const { slug } = tenantConfig.config;
    const { pathname } = router;
    const donatePaths = [
      '/',
      '/[p]',
      '/[p]/[id]',
      '/sites/[slug]/[locale]',
      '/sites/[slug]/[locale]/[p]',
      '/sites/[slug]/[locale]/[p]/[id]',
    ];

    const linkPaths = {
      home: '/sites/[slug]/[locale]/home',
      leaderboard: '/sites/[slug]/[locale]/all',
    };

    const isDonatePath = donatePaths.includes(pathname);
    const isHomePath = pathname === linkPaths.home && navLink === 'home';
    const isLeaderboardPath =
      pathname === linkPaths.leaderboard && navLink === 'leaderboard';
    const isPlanetHome =
      slug === 'planet' &&
      pathname === '/sites/[slug]/[locale]' &&
      navLink === 'home';

    if (isPlanetHome) {
      return true;
    }

    if (navLink === 'donate') {
      return isDonatePath;
    }

    return isHomePath || isLeaderboardPath;
  };

  return navLinkOptions.visible ? (
    <div
      className={`${hasSubMenu ? 'subMenu' : ''}`}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      key={navLink}
    >
      <Link
        prefetch={false}
        href={isMobile && hasSubMenu ? router.asPath : navLinkOptions.onclick}
      >
        {navLinkOptions.title !== 'signIn' && (
          <div className={`linkContainer`}>
            <p className={isActive() ? 'active_icon' : ''}>
              {t(navLinkOptions.title)}
            </p>
          </div>
        )}
      </Link>
      <div className={`subMenuItems ${menu ? 'showSubMenu' : ''}`}>
        {hasSubMenu && <AboutUsSubMenu subMenu={navLinkOptions.subMenu} />}
      </div>
    </div>
  ) : null;
};

const MenuItems = () => {
  const { tenantConfig } = useTenant();
  const [isMobile, setIsMobile] = useState(false);
  const [menu, setMenu] = useState(false);
  const links = Object.keys(tenantConfig?.config?.header?.items || {});

  useEffect(() => {
    const maxWidth = '768px';
    useMobileDetection(maxWidth, (isMobile: boolean) => {
      setIsMobile(isMobile);
    });
  }, []);

  return tenantConfig ? (
    <div className={'menuItems'}>
      {links
        .filter((navLink) => navLink !== 'shop' && navLink !== 'me')
        .map((navLink) => {
          const navLinkOptions = tenantConfig.config.header.items[navLink];

          return (
            <MenuItem
              key={navLink}
              navLink={navLink}
              navLinkOptions={navLinkOptions}
              isMobile={isMobile}
              menu={menu}
              setMenu={setMenu}
            />
          );
        })}
      {tenantConfig.config.header.items['me']?.visible && (
        <div>
          <UserIcon />
        </div>
      )}
    </div>
  ) : null;
};

export default MenuItems;
