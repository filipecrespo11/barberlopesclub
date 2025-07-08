"use client";

/**
 * Abre uma nova janela popup centralizada na tela.
 * @param url - A URL para abrir no popup.
 * @param title - O título da janela do popup.
 * @param w - A largura do popup.
 * @param h - A altura do popup.
 * @returns A referência para a janela aberta (Window) ou null se não puder ser aberta.
 */
export function openPopup(url: string, title: string, w: number, h: number): Window | null {
  if (typeof window === "undefined") {
    return null;
  }

  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;

  const newWindow = window.open(
    url,
    title,
    `scrollbars=yes, width=${w / systemZoom}, height=${h / systemZoom}, top=${top}, left=${left}`
  );

  if (newWindow) {
    newWindow.focus();
  }

  return newWindow;
}
