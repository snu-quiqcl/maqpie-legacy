import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import BuilderPage from './pages/BuilderPage/BuilderPage';
import SchedulerPage from './pages/SchedulerPage/SchedulerPage';
import TtlControllerPage from './pages/TtlControllerPage/TtlControllerPage';

export default function App() {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<div>Home Page</div>} />
            <Route path='/builder' element={<BuilderPage />} />
            <Route path='/scheduler' element={<SchedulerPage />} />
            <Route path='/controller/ttl' element={<TtlControllerPage />} />
            <Route path='*' element={<h1>Not Found</h1>} />
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
