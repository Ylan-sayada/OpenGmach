import { FunctionComponent } from 'react'
import { Spinner } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import Nav from "../components/Nav"
import { sysConfig } from '../data/atoms/landingAtoms';
import Footer from './Footer';

type Props = {
    children: React.ReactNode
}
const Layout: FunctionComponent<Props> = ({ children }) => {
    const isConfig = useRecoilValue(sysConfig);
    return (<>{isConfig.isInit === undefined ?
        <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spinner animation="border" variant="primary" style={{ width: "20vw", height: "20vw" }} />
        </div> :
        <div className="content">
            {isConfig.isInit && <Nav />}
            {children}
            {isConfig.isInit && <Footer />}
        </div>
    }
    </>
    )
}
export default Layout