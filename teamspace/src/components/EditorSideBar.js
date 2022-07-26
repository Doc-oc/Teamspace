import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faStickyNote,
  faCompass,
  faUsers,
  faCogs,
  faServer,
  faCloud,
  faUserPlus,
  faFileCirclePlus
} from "@fortawesome/free-solid-svg-icons";
import cx from "classnames";
import "../styles/editorSidebar.css"
const menuItems = [
  { title: "Add Note", icon: faStickyNote },
  { title: "Users", icon: faUsers },
  { title: "Invite Users", icon: faUserPlus },
  { title: "Cloud services", icon: faFileCirclePlus },
  { title: "Server list", icon: faServer },
  { title: "Settings", icon: faCogs }
];

const Sidebar = () => {

  return (
    <div className="editorSidebar">
      <ul className="sideBarUL">
        {menuItems.map(item => (
          <li key={item.title}>
            <div className={"editorSidebarListItem"}>
              <FontAwesomeIcon className={"sidebarIcon"} icon={item.icon} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
