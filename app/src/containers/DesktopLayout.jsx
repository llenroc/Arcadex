import React, { Fragment } from 'react'
import { Route, Switch } from 'react-router'
import styled from 'styled-components'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import {
  HOW_TO_PLAY_PAGE,
  GAME_HALL_PAGE,
  MY_COLLECTION_PAGE,
  SLOT_MACHINE_PAGE,
  CAPSULE_PAGE,
} from '@/constants/routes'
import Home from './Desktop/Home'
import Tutorial from './Desktop/Tutorial'
import Hall from './Desktop/Hall'
import Collection from './Desktop/Collection'
import SlotMachine from './Desktop/SlotMachine'
import Capsule from './Desktop/Capsule'

const Layout = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`

const DesktopLayout = () => (
  <Fragment>
    <NavBar />
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
    <Footer />
  </Fragment>
)

export default DesktopLayout
