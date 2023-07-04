import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import SideNav, { SideMenuItem } from 'components/nav/SideNav';
import './Search.scss';

import { styled } from '@mui/material/styles';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
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

export default function Search() {
  const navigate = useNavigate();
  const isSp = useMediaQuery({ maxWidth: 767 });
  const menuItem: SideMenuItem[] = [
    {
      category: 'カテゴリー1',
      items: [
        { value: 'Choice1', icon: <RocketLaunchIcon/>, title: '選択肢1'},
        { value: 'Choice2', icon: <RocketLaunchIcon/>, title: '選択肢2'},
      ]
    },{
      category: 'カテゴリー2',
      items: [
        { value: 'Choice3', icon: <RocketLaunchIcon/>, title: '選択肢3'},
        { value: 'Choice4', icon: <RocketLaunchIcon/>, title: '選択肢4'},
      ]
    },
  ]

  const [navShow, setNavShow] = useState<boolean>(true);

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

  function Additional() {
    return (
      <>
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
      {!isSp && 
      <div className='search-area'>
        <TextField className='filter' hiddenLabel size='small' variant='filled' value={search} onChange={(e) => setSearch(e.target.value)}/>
        <SearchIcon className='icon' sx={{ fontSize: 20 }}/>
        <NonLinearSlider/>
      </div>
      }
      </>
    )
  }

  return(
    <>
    <SideNav menuItem={menuItem} additional={<Additional/>} isSp={isSp}/>
    <section className={navShow ? isSp ? 'with-nav sp search' : 'with-nav search' : 'search'}>
      <div className='contents'>
        <p className='title'>Title1</p>
      </div>
      <div className='contents'>
        <p className='title'>Title2</p>
      </div>
      <div className='contents'>
        <p className='title'>Title3</p>
      </div>
      <div className='contents'>
        <p className='title'>Title4</p>
      </div>
    </section>
    </>
  )
}