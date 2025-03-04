import React from 'react';
import { Input } from 'antd';
import { Search } from 'lucide-react';
import styles from './SearchBar.module.scss';

const { Search: AntSearch } = Input;

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  onChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Search...', 
  onSearch, 
  onChange 
}) => {
  return (
    <div className={styles.searchBar}>
      <AntSearch
        placeholder={placeholder}
        allowClear
        enterButton={<Search size={16} />}
        size="large"
        onSearch={onSearch}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;