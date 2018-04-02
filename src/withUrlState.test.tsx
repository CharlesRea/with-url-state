// tslint:disable:no-any
import { mount } from 'enzyme'
import * as React from 'react'
import { createBrowserHistory, History, LocationDescriptorObject } from 'history'
import * as queryString from 'query-string'
import { withUrlState, UrlStateProps } from './withUrlState'

type ControlState = { animal?: string, color: string }
declare const global: { window: any }

const UrlBasedControls = (props: UrlStateProps<ControlState>) => (
  <div>
    <div className="currentAnimal">{props.urlState.animal}</div>
    <div className="currentColor">{props.urlState.color}</div>
    <button className="Green" onClick={() => props.setUrlState({ color: 'Green' })}>
      Green
    </button>
    <button className="Red" onClick={() => props.setUrlState({ color: 'Red' })}>
      Red
    </button>
  </div>
)

const parseQueryString = (qs: string) => queryString.parse(qs);
const stringifyState = (state: ControlState) => queryString.stringify(state);

describe('withUrlState', () => {
  beforeEach(() => {
    const search = queryString.stringify({ color: 'Blue' })
    
    window.history.replaceState(window.history.state, '', search)
  })

  it('will not override any params which are already provided in the query string', () => {
    const UrlConnectedControls: any =
      withUrlState<{}, ControlState>(parseQueryString, stringifyState, () => ({ color: 'Red' }))(UrlBasedControls)
    expect(parseQueryString(window.location.search)).toEqual({ color: 'Blue' })

    const wrapper = mount(<UrlConnectedControls />)

    expect(parseQueryString(window.location.search)).toEqual({ color: 'Blue' })
    expect(wrapper.find('.currentColor').text()).toBe('Blue')
  })

  it('will append any additional any params which are not provided in the querystring', () => {
    const UrlConnectedControls: any =
      withUrlState<{}, ControlState>(parseQueryString, stringifyState,() => ({ animal: 'Ant', color: 'Blue' }))(UrlBasedControls)
    expect(queryString.parse(window.location.search)).toEqual({ color: 'Blue' })

    const wrapper = mount(<UrlConnectedControls />)

    expect(queryString.parse(window.location.search)).toEqual({ animal: 'Ant', color: 'Blue' })
    expect(wrapper.find('.currentAnimal').text()).toBe('Ant')
    expect(wrapper.find('.currentColor').text()).toBe('Blue')
  })

  it('sets the url with the initial state', () => {
    const UrlConnectedControls: any =
      withUrlState<{}, ControlState>(parseQueryString, stringifyState,() => ({ animal: 'Ant', color: 'Blue' }))(UrlBasedControls)
    expect(queryString.parse(window.location.search)).toEqual({ color: 'Blue' })

    mount(<UrlConnectedControls />)

    expect(queryString.parse(window.location.search)).toEqual({ animal: 'Ant', color: 'Blue' })
  })

  it('provides the current urls state to the wrapped component', () => {
    const UrlConnectedControls: any =
      withUrlState<{}, ControlState>(parseQueryString, stringifyState,() => ({ animal: 'Ant', color: 'Blue' }))(UrlBasedControls)

    const wrapper = mount(<UrlConnectedControls />)

    expect(wrapper.find('.currentAnimal').text()).toBe('Ant')
    expect(wrapper.find('.currentColor').text()).toBe('Blue')
  })

  it('updates the url when the wrapped component updates the state', () => {
    const UrlConnectedControls: any =
      withUrlState<{}, ControlState>(parseQueryString, stringifyState,() => ({ animal: 'Ant', color: 'Blue' }))(UrlBasedControls)

    const wrapper = mount(<UrlConnectedControls />)
    expect(wrapper.find('.currentAnimal').text()).toBe('Ant')
    expect(wrapper.find('.currentColor').text()).toBe('Blue')
    expect(queryString.parse(window.location.search)).toEqual({ animal: 'Ant', color: 'Blue' })

    wrapper.find('.Green').simulate('click')
    expect(wrapper.find('.currentAnimal').text()).toBe('Ant')
    expect(wrapper.find('.currentColor').text()).toBe('Green')
    expect(queryString.parse(window.location.search)).toEqual({ animal: 'Ant', color: 'Green' })
  })
})
