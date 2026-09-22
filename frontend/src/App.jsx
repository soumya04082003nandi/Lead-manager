import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/app.routes'
import {AuthProvider} from "./context/authContext"

const App = ()=>{
    return(

        <BrowserRouter>
            <AuthProvider>
                <AppRoutes/>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
