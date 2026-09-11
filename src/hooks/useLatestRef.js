import { useEffect, useRef } from 'react'

/**
 * Keeps a ref pointing to the latest value, so that event listeners registered
 * once can call the newest callback without being re-attached on every render.
 *
 * @template T
 * @param {T} value
 * @returns {{ current: T }}
 */
export function useLatestRef(value) {
  const ref = useRef(value)

  useEffect(() => {
    ref.current = value
  })

  return ref
}
