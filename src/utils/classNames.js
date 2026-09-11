/**
 * Joins the truthy values into a single `className` string.
 *
 * @example classNames('hrnet-modal', isVisible && 'is-visible', userClass)
 * @param {...(string | false | null | undefined)} values
 * @returns {string}
 */
export function classNames(...values) {
  return values.filter(Boolean).join(' ')
}
