import { useState, ChangeEvent } from 'react';
import { SearchTextField } from './CustomSearchTextField';
import CrossIcon from '../icons/CrossIcon';
import style from './Search.module.scss';
import SearchIcon from '../icons/SearchIcon';
import { useTranslations } from 'next-intl';

interface ActiveSearchFieldProps {
  setIsSearching: (value: boolean) => void;
  setIsFilterOpen: (value: boolean) => void;
}
const ActiveSearchField = ({
  setIsSearching,
  setIsFilterOpen,
}: ActiveSearchFieldProps) => {
  const [input, setInput] = useState('');
  const t = useTranslations('ProjectDetails');

  const resetSearchTab = () => {
    setInput('');
    setIsSearching(false);
    setIsFilterOpen(false);
  };

  return (
    <>
      <button className={style.activeSearchIcon}>
        <SearchIcon />
      </button>
      <SearchTextField
        id="standard-search"
        variant="standard"
        placeholder={t('searchProject')}
        value={input}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setInput(event.target.value);
        }}
      />

      <button onClick={resetSearchTab} className={style.crossIcon}>
        <CrossIcon width={18} />
      </button>
    </>
  );
};

export default ActiveSearchField;
