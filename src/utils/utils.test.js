import { describe, expect, it } from 'vitest'
import { classNames } from './classNames.js'
import { getFocusableElements } from './getFocusableElements.js'

describe('classNames', () => {
  it('joins truthy values and skips the falsy ones', () => {
    expect(classNames('a', false, null, undefined, '', 'b')).toBe('a b')
  })

  it('returns an empty string without values', () => {
    expect(classNames()).toBe('')
  })
})

describe('getFocusableElements', () => {
  it('returns the tabbable elements in DOM order', () => {
    const container = document.createElement('div')
    container.innerHTML = `
      <a href="#a">link</a>
      <a>anchor without href</a>
      <button>enabled</button>
      <button disabled>disabled</button>
      <input type="hidden" />
      <input id="text" />
      <div tabindex="0">custom</div>
      <div tabindex="-1">programmatic only</div>
      <div inert><button>inert</button></div>
      <button aria-hidden="true">hidden</button>
    `

    const labels = getFocusableElements(container).map(
      (element) => element.textContent || element.id,
    )
    expect(labels).toEqual(['link', 'enabled', 'text', 'custom'])
  })
})
