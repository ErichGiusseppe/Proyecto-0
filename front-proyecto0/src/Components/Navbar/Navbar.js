import "./styles.css"
import { Link, useMatch, useResolvedPath } from "react-router-dom"
export default function Navbar(){
    return <nav className="nav">
        <Link to="/" className="site-title">Proyecto 0</Link>
        <ul>
            <li>
                <CustomLink to="/tareas" className = "links">Tareas</CustomLink>
            </li>
            <li>
                <CustomLink to="/categorias" className = "links">Categorias</CustomLink>
            </li>
        </ul>
    </nav>
}
function CustomLink({to, children, ...props }){
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({path:resolvedPath.pathname,end: true })
    return (
        <li className={isActive ? "active":"" }>
            <Link to = {to} {...props}>
                {children}
            </Link>
        </li>
    )
}