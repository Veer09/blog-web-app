import Embed from '@editorjs/embed'
import List from '@editorjs/list'
import Code from '@editorjs/code'
import SimpleImage from '@editorjs/simple-image'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'

export const EDITOR_TOOLS = {
    embed: {
        class: Embed,
        inlineToolbar: true,
    },
    list: List,
    code: Code,
    header: Header,
    quote: Quote,
    image: {
        class: SimpleImage,
        inlineToolbar: true,
    }
  }