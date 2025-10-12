import { Box, Flex, Icon, List, Spacer, Text } from '@chakra-ui/react'
import { faDashboard, faFlushed, faGear, faTasks } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { NavLink } from 'react-router-dom'

export const Sidebar = () => {
  return (
    <Box h='100vh' bgColor='#f6f3f1' spaceY={12}>
      <List.Root style={{listStyle: 'none'}}
        spaceY={4}>
        <List.Item paddingTop={10}>
          <NavLink to='/dashboard' className='navlink'>
            <FontAwesomeIcon icon={faDashboard}/> Dashbord
          </NavLink>
        </List.Item>

        <List.Item>
          <NavLink to='/dashboard' className='navlink'>
            <FontAwesomeIcon icon={faTasks}/>List of Tasks
          </NavLink>
        </List.Item>

        <List.Item>
          <NavLink className='navlink' to='/dashboard'>
            <FontAwesomeIcon icon={faGear}/> Setting
          </NavLink>
        </List.Item>
      </List.Root>

      <List.Root className='sidebar-list-wrapper'
        spaceY={2}>
        <List.Item className='sidebar-list-item'>
          <NavLink to='/title' className='navlink'>Hi Fast AI</NavLink>
        </List.Item>
      </List.Root>
    </Box>
  )
}
