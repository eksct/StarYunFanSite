// A deployment can remove chunks used by an already-open tab. Keep a usable way back.
(() => {
  let destination = ''
  function show(path = '') {
    destination = path || destination
    if (document.querySelector('.site-load-error')) return
    const banner = document.createElement('div')
    banner.className = 'site-load-error'
    banner.setAttribute('role', 'alert')
    Object.assign(banner.style, { position: 'fixed', inset: 'auto 1rem 1rem', zIndex: '1000', padding: '1rem',
      border: '1px solid var(--c-border, #aaa)', borderRadius: '8px', background: 'var(--c-bg, #fff)', color: 'var(--c-text, #111)' })
    const message = document.createElement('p')
    message.textContent = '页面资源加载失败。请检查网络，或重新加载以获取最新版本。'
    const retry = document.createElement('button')
    retry.type = 'button'; retry.className = 'btn'; retry.textContent = '重新加载'
    retry.addEventListener('click', () => {
      if (destination) {
        const url = new URL(location.href)
        url.hash = '#' + destination
        history.replaceState(null, '', url)
      }
      location.reload()
    })
    banner.append(message, retry)
    document.body.append(banner)
  }
  const ready = path => document.body ? show(path) : document.addEventListener('DOMContentLoaded', () => show(path), { once: true })
  window.addEventListener('vite:preloadError', event => { event.preventDefault(); ready() })
  window.addEventListener('error', event => { if (event.target instanceof HTMLScriptElement) ready() }, true)
  window.addEventListener('site:navigation-error', event => ready(event.detail?.path || ''))
})()
