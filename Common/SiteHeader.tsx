import { JSX } from "react"
import './SiteHeader.css'


function SiteHeader() : JSX.Element
{
    return (
        <>
            <div className="site-header">
                <p>||<a href="../">Portfolio</a> || <a href="../Blogs.html">Blogs</a> || <a href="../Monthly_Projects.html">Monthly Projects</a>||</p>
            </div>
        </>
    )
}

export default SiteHeader