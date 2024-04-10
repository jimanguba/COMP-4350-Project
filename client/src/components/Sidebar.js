import React from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'
import LogoutIcon from '@mui/icons-material/Logout'
import ListIcon from '@mui/icons-material/ListAlt'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined' // Statistics
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined'
import ChecklistIcon from '@mui/icons-material/Checklist'
import AddToQueueIcon from '@mui/icons-material/AddToQueue'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import '../styles/StyleForm.css'

const sidebar = () => {
  return (
    <Sidebar className='app'>
      <Menu>
        <MenuItem
          icon={<MenuOutlinedIcon />}
        >
          <Link to='/'>
            <h2>BOOKSHELF</h2>
          </Link>
        </MenuItem>
        {/* <MenuItem
            component={<Link to="/" />}
            icon={<HomeOutlinedIcon />}
        >
            Home
        </MenuItem> */}
        <MenuItem
          component={<Link to='/statistics' />}
          icon={<AssessmentOutlinedIcon />}
        >
          Statistics
        </MenuItem>
        <MenuItem component={<Link to='/book-list' />} icon={<ListIcon />}>
          Book List
        </MenuItem>
        <MenuItem
          component={<Link to='/goals' />}
          icon={<BallotOutlinedIcon />}
        >
          Goals
        </MenuItem>
        <MenuItem component={<Link to='/to-read' />} icon={<AddToQueueIcon />}>
          Books To Read
        </MenuItem>
        <MenuItem
          component={<Link to='/completed-books' />}
          icon={<ChecklistIcon />}
        >
          Completed Books
        </MenuItem>
        <MenuItem
          component={<Link to='/settings' />}
          icon={<SettingsOutlinedIcon />}
        >
          Settings
        </MenuItem>
        <MenuItem component={<Link to='/login' />} icon={<LogoutIcon />}>
          Log Out
        </MenuItem>
      </Menu>
    </Sidebar>
  )
}

export default sidebar
