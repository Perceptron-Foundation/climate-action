import LocationIcon from '../icons/LocationIcon';
import MailIcon from '../icons/MailIcon';
import RightArrowIcon from '../icons/RightArrowIcon';
import { ViewProfileIcon } from '../icons/ViewProfileIcon';
import WebsiteLinkIcon from '../icons/WebsiteLinkIcon';
import styles from './ProjectInfo.module.scss';
import { useTranslation } from 'next-i18next';

interface Props {
  websiteURL: string;
  location: string;
  email: string;
}

const ContactDetails = ({ websiteURL, location, email }: Props) => {
  const { t } = useTranslation(['donate']);

  const contactDetails = [
    {
      icon: <ViewProfileIcon width={10.5} color={'#2F3336'} />,
      title: t('donate:viewProfile'),
      link: '',
    },
    {
      icon: <WebsiteLinkIcon width={10.5} color={'#2F3336'} />,
      title: websiteURL
        .replace('https://www.', '')
        .replace('http://', '')
        .replace('https://', '')
        .replace('https://www.', '')
        .split(/[/?#]/)[0],
      link: websiteURL,
    },
    {
      icon: <LocationIcon width={9.5} color={'#2F3336'} />,
      title: location,
      link: '',
    },
    {
      icon: <MailIcon width={10.5} color={'#2F3336'} />,
      title: email,
      link: `mailto:${email}`,
    },
  ];

  return (
    <div className={styles.contactDetailsContainer}>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>{t('donate:contactDetails')}</div>
          <div className={styles.contactText}>
            {contactDetails.map((contact, index) => (
              <a
                href={contact.link}
                target="_blank"
                key={index}
                rel="noreferrer"
                className={styles.singleContact}
              >
                <div className={styles.icon}>{contact.icon}</div>
                <div className={styles.title}>{contact.title}</div>
                <div className={styles.rightArrow}>
                  <RightArrowIcon width={5} color={'#2F3336'} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
