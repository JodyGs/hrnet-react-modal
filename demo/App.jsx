import { useState } from 'react'
import { Modal, useModal } from '../src/index.js'

function ConfirmationExample() {
  const { isOpen, open, close } = useModal()

  return (
    <section className="demo-card">
      <h2>1. HRnet confirmation</h2>
      <p>Same usage as the <code>#confirmation</code> modal of the jQuery app.</p>
      <button type="button" onClick={open}>
        Save employee
      </button>
      <Modal isOpen={isOpen} onClose={close} ariaLabel="Confirmation">
        <p>Employee Created!</p>
      </Modal>
    </section>
  )
}

function FadeExample() {
  const { isOpen, open, close } = useModal()
  const [log, setLog] = useState([])
  const addLog = (message) => setLog((entries) => [...entries.slice(-3), message])

  return (
    <section className="demo-card">
      <h2>2. Title, fade and callbacks</h2>
      <p>
        <code>fadeDuration=300</code>, <code>fadeDelay=0.5</code>, <code>onOpen</code> and{' '}
        <code>onAfterClose</code>.
      </p>
      <button type="button" onClick={open}>
        Open with fade
      </button>
      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Delete employee"
        fadeDuration={300}
        fadeDelay={0.5}
        onOpen={() => addLog('onOpen')}
        onAfterClose={() => addLog('onAfterClose')}
      >
        <p>Focus is trapped inside the dialog: try Tab and Shift+Tab.</p>
        <div className="demo-actions">
          <button type="button" onClick={close}>
            Cancel
          </button>
          <button type="button" onClick={close}>
            Confirm
          </button>
        </div>
      </Modal>
      <output className="demo-log">{log.join(' → ') || 'No event yet'}</output>
    </section>
  )
}

function ForcedChoiceExample() {
  const { isOpen, open, close } = useModal()

  return (
    <section className="demo-card">
      <h2>3. Forced choice</h2>
      <p>
        <code>escapeClose=false</code>, <code>clickClose=false</code>, <code>showClose=false</code>.
      </p>
      <button type="button" onClick={open}>
        Open
      </button>
      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Terms of use"
        escapeClose={false}
        clickClose={false}
        showClose={false}
      >
        <p>This dialog can only be closed with the button below.</p>
        <button type="button" onClick={close}>
          I agree
        </button>
      </Modal>
    </section>
  )
}

function CustomStyleExample() {
  const { isOpen, open, close } = useModal()

  return (
    <section className="demo-card">
      <h2>4. Custom styles</h2>
      <p>
        Custom classes (<code>modalClass</code>, <code>blockerClass</code>, <code>closeClass</code>)
        and CSS variables.
      </p>
      <button type="button" onClick={open}>
        Open themed modal
      </button>
      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Design system"
        closeText="Close the dialog"
        modalClass="demo-modal"
        blockerClass="demo-blocker"
        closeClass="demo-close"
        fadeDuration={200}
      >
        <p>This modal follows the WealthHealth colours.</p>
      </Modal>
    </section>
  )
}

export function App() {
  return (
    <main className="demo">
      <header>
        <h1>@jodygs/hrnet-react-modal</h1>
        <p>React replacement of the jQuery plugin jquery-modal, used by HRnet.</p>
      </header>
      <ConfirmationExample />
      <FadeExample />
      <ForcedChoiceExample />
      <CustomStyleExample />
    </main>
  )
}
