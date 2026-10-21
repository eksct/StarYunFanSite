// Small progressive enhancement for standalone article pages.
const status = document.getElementById('interaction-status')
const system = window.matchMedia('(prefers-color-scheme: dark)')
const themeSelect = document.querySelector('[data-theme-select]')
let mode = 'system'
function readTheme() {
  try {
    const stored = localStorage.getItem('site.theme')
    mode = stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch { mode = 'system' }
}
function applyTheme() {
  document.documentElement.dataset.theme = mode === 'system' ? system.matches ? 'dark' : 'light' : mode
  if (themeSelect) themeSelect.value = mode
}
readTheme(); applyTheme()
themeSelect?.addEventListener('change', () => {
  mode = themeSelect.value
  try {
    if (mode === 'system') localStorage.removeItem('site.theme')
    else localStorage.setItem('site.theme', mode)
  } catch { /* The current page still follows the chosen mode. */ }
  applyTheme()
})
system.addEventListener('change', applyTheme)
window.addEventListener('storage', event => {
  if (event.key === 'site.theme' || event.key === null) { readTheme(); applyTheme() }
})
document.addEventListener('click', async event => {
  const target = event.target
  if (!(target instanceof Element)) return
  if (target.closest('[data-action="print"]')) { window.print(); return }
  const copy = target.closest('[data-action="copy"]')
  if (copy) {
    const code = copy.closest('.code-block')?.querySelector('code')?.textContent || ''
    try {
      await navigator.clipboard.writeText(code)
      if (status) status.textContent = '代码已复制'
    } catch { window.prompt('请复制代码：', code) }
  }
  if (target instanceof HTMLImageElement && target.classList.contains('prose-img') && target.complete && target.naturalWidth) {
    const dialog = document.createElement('dialog')
    dialog.className = 'image-dialog'
    const close = document.createElement('button')
    close.type = 'button'; close.textContent = '关闭图片预览'
    const image = document.createElement('img')
    image.src = target.src; image.alt = target.alt
    dialog.setAttribute('aria-label', '图片预览')
    dialog.append(close, image); document.body.append(dialog)
    close.addEventListener('click', () => dialog.close())
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close() })
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.addEventListener('close', () => { document.body.style.overflow = overflow; dialog.remove(); target.focus() }, { once: true })
    dialog.showModal(); close.focus()
  }
})
document.addEventListener('keydown', event => {
  if (event.target instanceof HTMLImageElement && ['Enter', ' '].includes(event.key)) {
    event.preventDefault(); event.target.click()
  }
})
document.querySelectorAll('.prose-img').forEach(image => {
  const failed = () => {
    if (image.classList.contains('image-failed')) return
    image.removeAttribute('role'); image.removeAttribute('tabindex'); image.removeAttribute('aria-label')
    image.alt = '图片加载失败：' + image.alt
    image.classList.add('image-failed')
  }
  image.addEventListener('error', failed, { once: true })
  if (image.complete && !image.naturalWidth) failed()
})
