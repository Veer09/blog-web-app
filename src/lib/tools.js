import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import SimpleImage from '@editorjs/simple-image'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import CheckList from '@editorjs/checklist'

export const EDITOR_TOOLS = {
    embed: Embed,
    table: Table,
    list: List,
    code: Code,
    linkTool: LinkTool,
    header: Header,
    quote: Quote,
    image:{
        class: SimpleImage
    },
    checklist: CheckList,
  }