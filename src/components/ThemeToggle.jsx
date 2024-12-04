'use client';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function ThemeToggle({ mode, toggleColorMode }) {
  return (
    <Tooltip title={mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
      <IconButton color="inherit" onClick={toggleColorMode} sx={{ ml: 1 }}>
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
}