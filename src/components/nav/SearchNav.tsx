import { useState, ReactElement } from 'react';
import './SearchNav.scss';

import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

export interface SearchMenuItem {
  category: string;
  items: {
    value: string,
    icon: ReactElement<any, any>,
    title: string
  }[];
}

export default function SearchNav({ menuItem, isSp }: { menuItem: SearchMenuItem[], isSp: boolean }) {

  const [activeMenu, setActiveMenu] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const [sns, setSns] = useState('list');
  const handleChange = (event: React.MouseEvent<HTMLElement>, value: string) => {
    setSns(value);
  };

  function valueLabelFormat(value: number) {
    const units = ['KB', 'MB', 'GB', 'TB'];
  
    let unitIndex = 0;
    let scaledValue = value;
  
    while (scaledValue >= 1024 && unitIndex < units.length - 1) {
      unitIndex += 1;
      scaledValue /= 1024;
    }
  
    return `${scaledValue} ${units[unitIndex]}`;
  }
  
  function calculateValue(value: number) {
    return 2 ** value;
  }

  const PrettoSlider = styled(Slider)({
    color: 'var(--main-color)',
    height: 8,
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-thumb': {
      height: 16,
      width: 16,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&:before': {
        display: 'none',
      },
    },
    '& .MuiSlider-valueLabel': {
      backgroundColor: 'var(--main-color)',
    },
  });

  function NonLinearSlider() {
    const [value, setValue] = useState<number>(10);
  
    const handleChange = (event: Event, newValue: number | number[]) => {
      if (typeof newValue === 'number') {
        setValue(newValue);
      }
    };
  
    return (
      <Box>
        <Typography id="non-linear-slider" gutterBottom>
          容量: {valueLabelFormat(calculateValue(value))}
        </Typography>
        <PrettoSlider value={value} min={5} step={1} max={30}
          scale={calculateValue}
          getAriaValueText={valueLabelFormat}
          valueLabelFormat={valueLabelFormat}
          onChange={handleChange}
          valueLabelDisplay="auto" aria-labelledby="non-linear-slider"
        />
      </Box>
    );
  }

  return(
    <>
    {/* 検索サポートコンポネント */}
    <nav className='search-nav'>
      <div className={isSp ? 'side-menu sp' : 'side-menu'}>
        {/* SNS選択エリア */}
        <ToggleButtonGroup className='sns-area' size='small' value={sns} exclusive onChange={handleChange}>
          <ToggleButton className='twitter' value='twitter' aria-label='list'>
            <TwitterIcon/>
          </ToggleButton>
          <ToggleButton className='instagram' value='instagram' aria-label='module'>
            <InstagramIcon/>
          </ToggleButton>
          <ToggleButton className='tiktok' value='tiktok' aria-label='list'>
            <AudiotrackIcon/>
          </ToggleButton>
          <ToggleButton className='youtube' value='youtube' aria-label='module'>
            <YouTubeIcon/>
          </ToggleButton>
        </ToggleButtonGroup>
        {/* 表示方法変更エリア */}
        <></>
        {/* 検索エリア */}
        {!isSp && 
          <div className='search-area'>
            <TextField className='filter' hiddenLabel size='small' variant='filled' value={search} onChange={(e) => setSearch(e.target.value)}/>
            <SearchIcon className='icon' sx={{ fontSize: 20 }}/>
            <NonLinearSlider/>
          </div>
        }
        {/* タグ検索エリア */}
        {menuItem.map((menus) => (
          <div className='category' key={menus.category}>
          <div className='title'>
            {!isSp && menus.category}
          </div>
          <ul>
            {menus.items.map((menu) => (
            <li className={activeMenu === menu.value ? 'active icon' : 'icon'} onClick={() => setActiveMenu(menu.value)} key={menu.value}>
                {menu.icon}{!isSp && menu.title}
            </li>
            ))}
          </ul>
          </div>
        ))}
      </div>
    </nav>
    </>
  )
}