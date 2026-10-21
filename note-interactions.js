// Small progressive enhancement for standalone article pages.
const status = document.getElementById('interaction-status')
document.addEventListener('click', async event => {
  const target = event.target
  if (!(target instanceof Element)) return
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
    dialog.addEventListener('close', () => { dialog.remove(); target.focus() }, { once: true })
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
