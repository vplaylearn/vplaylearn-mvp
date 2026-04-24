import { useState , useEffect} from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./sidebar.css";



export default function Sidebar() {
  const [open, setOpen] = useState(null);
  const location = useLocation();

  const menu = [
    { title: "Home", path: "/"},
    { title: "Games", path: "/games" },
    { title: "Puzzles", path: "/puzzles" },
    {
      title: "Idioms and proverbs",
      key: "idioms",
      children: [
        { title: "English", path: "/english-idioms" },
        { title: "Kannada", path: "/kannada-idioms" },
        { title: "Tamil", path: "/tamil-idioms" },
        { title: "Telugu", path: "/telugu-idioms" },
        { title: "Hindi", path: "/hindi-idioms" }
      ],
    },
  ];

  useEffect(() => {
  if (location.pathname.includes("profile") || location.pathname.includes("security")) {
    setOpen("settings");
  }
}, [location]);

  const toggle = (key) => {
    setOpen(open === key ? null : key);
  };

  return (
    // <div className="sidebar">
    //   <ul>
    //     {menu.map((item) => (
    //       <div key={item.title}>
    //         {/* MAIN ITEM */}
    //         {item.path ? (
    //           <NavLink to={item.path} className="link">
    //             <li>{item.title}</li>
    //           </NavLink>
    //         ) : (
    //           <li onClick={() => toggle(item.key)} className="menu-item">
    //             {item.title}
    //             <span>{open === item.key ? "▲" : "▼"}</span>
    //           </li>
    //         )}

    //         {/* SUBMENU */}
    //         {item.children && (
    //           <ul className={`submenu ${open === item.key ? "show" : ""}`}>
    //             {item.children.map((sub) => (
    //               <NavLink to={sub.path} key={sub.title} className="link">
    //                 <li className="submenu-item">{sub.title}</li>
    //               </NavLink>
    //             ))}
    //           </ul>
    //         )}
    //       </div>
    //     ))}
    //   </ul>
    // </div>
    <div className="sidebar">
  <ul>
    {menu.map((item) => (
      <li key={item.title}>
        
        {/* MAIN ITEM */}
        {item.path ? (
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `menu-item link ${isActive ? "active" : ""}`
            }
          >
            <span>{item.title}</span>
          </NavLink>
        ) : (
          <div
            className="menu-item"
            onClick={() => toggle(item.key)}
          >
            <span>{item.title}</span>
            <span>{open === item.key ? "▲" : "▼"}</span>
          </div>
        )}

        {/* SUBMENU */}
        {item.children && (
          <ul className={`submenu ${open === item.key ? "show" : ""}`}>
            {item.children.map((sub) => (
              <li key={sub.title}>
                <NavLink
                  to={sub.path}
                  className={({ isActive }) =>
                    `submenu-item link ${isActive ? "active" : ""}`
                  }
                >
                  {sub.title}
                </NavLink>
              </li>
            ))}
          </ul>
        )}

      </li>
    ))}
  </ul>
</div>
  );
}