'use client'

/**
 * LanguagePickerModal
 *
 * Shown only on the very first visit (tracked via localStorage).
 * Asks the visitor which UI language they prefer and navigates to the
 * corresponding locale root. After a choice is made the key is set and
 * the modal never appears again.
 *
 * The component is fully self-contained: it reads the current locale from
 * the `locale` prop (passed by RootHtml) so it can skip the modal when
 * the visitor is already on the right page.
 */

import { useEffect, useRef, useState } from 'react'
import { LOCALE_META } from '@/i18n/config'

const STORAGE_KEY = 'lang-chosen'

export default function LanguagePickerModal({ locale }) {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef(null)

  /* Open the modal on first visit only ----------------------------------- */
  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setOpen(true)
      }
    } catch {
      /* localStorage blocked (private mode etc.) — skip silently */
    }
  }, [])

  /* Trap focus inside the dialog ----------------------------------------- */
  useEffect(() => {
    if (!open) return
    const el = dialogRef.current
    if (!el) return

    // Move focus to the dialog
    el.focus()

    function handleKeyDown(e) {
      if (e.key === 'Escape') choose(locale) // dismiss = stay on current locale
      if (e.key !== 'Tab') return
      const focusable = el.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function choose(chosenLocale) {
    try {
      localStorage.setItem(STORAGE_KEY, chosenLocale)
    } catch {
      /* ignore */
    }
    setOpen(false)

    const target = LOCALE_META[chosenLocale].path
    if (chosenLocale !== locale) {
      window.location.href = target
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="lp-backdrop"
        aria-hidden="true"
        onClick={() => choose(locale)}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lp-title"
        className="lp-modal"
        tabIndex={-1}
      >
        <p className="lp-eyebrow">Language / زبان</p>

        <div className="lp-options">
          <button
            className="lp-option"
            lang="en"
            dir="ltr"
            onClick={() => choose('en')}
            autoFocus={locale === 'en'}
          >
            <span className="lp-option-label">English</span>
          </button>

          <button
            className="lp-option"
            lang="fa"
            dir="rtl"
            onClick={() => choose('fa')}
            autoFocus={locale === 'fa'}
          >
            <span className="lp-option-label">فارسی</span>
          </button>
        </div>
      </div>
    </>
  )
}
