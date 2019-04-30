import React from 'react'
import { Route, Switch } from 'react-router'
import styled from 'styled-components'
import MenuBar from '../components/MenuBar'
import {
  HOW_TO_PLAY_PAGE,
  GAME_HALL_PAGE,
  MY_COLLECTION_PAGE,
  SLOT_MACHINE_PAGE,
  CAPSULE_PAGE,
} from '@/constants/routes'
import Home from './Mobile/Home'
import Tutorial from './Mobile/Tutorial'
import Hall from './Mobile/Hall'
import Collection from './Mobile/Collection'
import SlotMachine from './Mobile/SlotMachine'
import Capsule from './Mobile/Capsule'
import Menu from './Mobile/Menu'

const Layout = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch; 
`

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const MobileLayout = () => (
  <Wrapper>
    <MenuBar />
    <Layout>
      <Switch>
        <Route path={SLOT_MACHINE_PAGE} component={SlotMachine} />
        <Route path={CAPSULE_PAGE} component={Capsule} />
        <Route path={HOW_TO_PLAY_PAGE} component={Tutorial} />
        <Route path={GAME_HALL_PAGE} component={Hall} />
        <Route path={MY_COLLECTION_PAGE} component={Collection} />
        <Route component={Home} />
      </Switch>
    </Layout>
    <Menu />
  </Wrapper>
)

export default MobileLayout
