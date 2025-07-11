import './App.css'
import Meminator from './pages/Meminator';
import SelfMeminator from './pages/SelfMeminator';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navigation from './Navigation.tsx';

function App() {

    return (

        <BrowserRouter>
            <>
                <header>
                    <h1>The React Meminator</h1>
                </header>
                <Navigation />
                <section id="main">
                    <Routes>
                        <Route path="/" element={<Meminator />} />
                        <Route path="/self-meminator" element={<SelfMeminator />} />
                    </Routes>
                </section>
            </>

        </BrowserRouter>
    )
}

export default App
