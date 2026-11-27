import React, { useCallback, useEffect, useRef, useState } from 'react';
import config from '@plone/volto/registry';
import {
  CONSENT_CATEGORIES,
  getAcceptedPreferences,
  getDefaultPreferences,
  getConsentStatus,
  getStoredConsent,
  saveConsent,
} from './consentimento';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Consentimento = () => {
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState('summary');
  const [preferences, setPreferences] = useState(getDefaultPreferences);
  const dialogRef = useRef(null);
  const settings = config.settings.procergsConsentimento || {};
  const privacyUrl = settings.privacyPolicyUrl || '/politica-de-privacidade';

  useEffect(() => {
    let cancelled = false;
    getConsentStatus().then((status) => {
      if (cancelled) return;
      // Se o consentimento está inativo no backend, não mostra o banner
      if (status && status.ativo === false) return;
      if (!getStoredConsent()) setVisible(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    const previous = document.activeElement;
    dialogRef.current?.focus();
    return () => previous?.focus?.();
  }, [visible]);

  useEffect(() => {
    if (visible) dialogRef.current?.focus();
  }, [view, visible]);

  const close = useCallback((value) => {
    saveConsent(value);
    setVisible(false);
  }, []);

  const handleAcceptAll = () => close(getAcceptedPreferences());

  const handleSave = () => close(preferences);

  const handleToggle = (id) =>
    setPreferences((current) => ({ ...current, [id]: !current[id] }));

  const handleKeyDown = (event) => {
    if (event.key !== 'Tab') return;
    const items = dialogRef.current?.querySelectorAll(FOCUSABLE);
    if (!items?.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!visible) return null;

  const isSettings = view === 'settings';

  return (
    <div className="consentimento__overlay">
      <div
        ref={dialogRef}
        className={`consentimento__modal${
          isSettings ? ' consentimento__modal--settings' : ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consentimento-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <h2 id="consentimento-title" className="consentimento__title">
          Aviso de Privacidade
        </h2>

        {isSettings ? (
          <>
            <ul className="consentimento__options">
              {CONSENT_CATEGORIES.map(({ id, label, required }) => (
                <li key={id} className="consentimento__option">
                  <label
                    className="consentimento__switch"
                    htmlFor={`consentimento-${id}`}
                  >
                    <span className="consentimento__switch-label">
                      {label}
                    </span>
                    <input
                      id={`consentimento-${id}`}
                      type="checkbox"
                      role="switch"
                      className="consentimento__switch-input"
                      checked={required ? true : Boolean(preferences[id])}
                      disabled={required}
                      onChange={() => handleToggle(id)}
                    />
                    <span
                      className="consentimento__switch-track"
                      aria-hidden="true"
                    >
                      <span className="consentimento__switch-thumb" />
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="consentimento__actions">
              <button
                type="button"
                className="consentimento__button consentimento__button--link"
                onClick={() => setView('summary')}
              >
                &lt; Voltar
              </button>
              <button
                type="button"
                className="consentimento__button consentimento__button--outline"
                onClick={handleAcceptAll}
              >
                Aceitar todos os cookies
              </button>
              <button
                type="button"
                className="consentimento__button consentimento__button--primary"
                onClick={handleSave}
              >
                Salvar
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="consentimento__text">
              <p>
                Para oferecer à você a melhor experiência possível,
                utilizamos cookies em nosso site. Os cookies essenciais para o funcionamento da página são ativados automaticamente, mas você também pode permitir outras categorias. Escolha entre{' '}
                <strong>aceitar todos os cookies</strong> ou{' '}
                <strong>ajustar suas preferências de privacidade</strong>.
              </p>
              <p>
                Para mais informações sobre os cookies que usamos e
                como revogar seu consentimento a qualquer momento, acesse nossa{' '}
                <a href={privacyUrl}>Política de Privacidade</a>.
              </p>
            </div>
            <div className="consentimento__actions">
              <button
                type="button"
                className="consentimento__button consentimento__button--outline"
                onClick={() => setView('settings')}
              >
                Ajustar configurações de privacidade
              </button>
              <button
                type="button"
                className="consentimento__button consentimento__button--primary"
                onClick={handleAcceptAll}
              >
                Aceitar todos os cookies
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Consentimento;