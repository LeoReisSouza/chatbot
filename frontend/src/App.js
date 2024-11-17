import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage';
import ProfilePage from 'scenes/profilePage';
import LoginPage from 'scenes/loginPage';
import ChatPage from 'scenes/chatPage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from "@mui/material/styles";
import { themeSettings } from 'theme';


function App() {
    const mode = useSelector((state) => state.mode);
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    // const isAuth = Boolean(useSelector((state) => state.token));

    return <div className='app'>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Routes>
                    <Route path='/' element={<ChatPage />} />

                    <Route path='*' element={<Navigate to="/" />} />
                    {/* <Route path='/home' element={<HomePage />} /> */}
                    {/* <Route path='/chat' element={<ChatPage />} /> */}
                    {/* <Route path='/profile/:userId' element={isAuth ? <ProfilePage /> : <Navigate to="/" />} /> */}
                </Routes>
            </ThemeProvider>
        </BrowserRouter>
    </div>;
}

export default App;