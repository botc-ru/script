/**
 * Поток создания PDF. react-pdf верстает документ и разбирает картинки долго, и в основном
 * потоке страница в это время не отвечала. Общение — сообщениями `ScriptPdfRequest`
 * и `ScriptPdfResponse`, см. `loadScriptPdf`.
 */
import { generateScriptPdf } from '../generateScriptPdf'
import { createPdfJobQueue } from './createPdfJobQueue'
import { installBufferShim } from './installBufferShim'
import type { ScriptPdfRequest } from './ScriptPdfRequest'

installBufferShim()

const handle = createPdfJobQueue(generateScriptPdf, (response) => postMessage(response))

addEventListener('message', (event: MessageEvent<ScriptPdfRequest>) => handle(event.data))
