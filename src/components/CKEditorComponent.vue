<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { Ckeditor, useCKEditorCloud } from '@ckeditor/ckeditor5-vue'
import type { Editor } from '@ckeditor/ckeditor5-core'
import type { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'
import axios, { CancelTokenSource } from 'axios'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorData = computed({
  get: () => props.modelValue || '',
  set: (value) => emit('update:modelValue', value),
})

interface UploadResponse {
  url: string
}

const LICENSE_KEY: string = import.meta.env.VITE_CKEDITOR_API_KEY

const editorMenuBar = ref<HTMLElement | null>(null)
const editorWordCount = ref<HTMLElement | null>(null)
const editorInstance = ref<Editor | null>(null)

const cloud = useCKEditorCloud({ version: '45.1.0', premium: true, translations: ['vi'] })

const isLayoutReady = ref<boolean>(false)

const editor = computed(() => {
  if (!cloud.data.value) {
    return null
  }
  return cloud.data.value.CKEditor.ClassicEditor as typeof ClassicEditor
})

class CustomUploadAdapter {
  private loader: any
  private cancelTokenSource: CancelTokenSource

  constructor(loader: any) {
    this.loader = loader
    this.cancelTokenSource = axios.CancelToken.source()
  }

  upload(): Promise<{ default: string }> {
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          const data = new FormData()
          data.append('image', file)
          data.append('metadata', JSON.stringify({ source: 'CKEditor', type: 'image' }))
          data.append('refresh_token', localStorage.getItem('refresh_token') || '')

          axios({
            url: `${import.meta.env.VITE_API_UR}/api/file-management/upload-image`,
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            data,
            cancelToken: this.cancelTokenSource.token,
          })
            .then((response: { data: UploadResponse }) => {
              resolve({ default: response.data.url })
            })
            .catch((error: any) => {
              if (axios.isCancel(error)) {
                reject('Upload cancelled')
              } else {
                reject(error.response?.data?.error || 'Upload failed')
              }
            })
        }),
    )
  }

  abort(): void {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel('Upload cancelled by user')
    }
  }
}

function CustomUploadAdapterPlugin(editor: Editor): void {
  ;(editor.plugins.get('FileRepository') as any).createUploadAdapter = (loader: any) => {
    return new CustomUploadAdapter(loader)
  }
}

const config = computed<any | null>(() => {
  if (!isLayoutReady.value || !cloud.data.value) {
    return null
  }

  const {
    Alignment,
    Autoformat,
    AutoImage,
    AutoLink,
    Autosave,
    BalloonToolbar,
    BlockQuote,
    Bold,
    Bookmark,
    CloudServices,
    Code,
    CodeBlock,
    Emoji,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    GeneralHtmlSupport,
    Heading,
    Highlight,
    HorizontalLine,
    HtmlComment,
    HtmlEmbed,
    ImageBlock,
    ImageCaption,
    ImageEditing,
    ImageInline,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    ImageUtils,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    Mention,
    PageBreak,
    Paragraph,
    PasteFromOffice,
    PlainTableOutput,
    RemoveFormat,
    ShowBlocks,
    SourceEditing,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableLayout,
    TableProperties,
    TableToolbar,
    TextPartLanguage,
    TextTransformation,
    TodoList,
    Underline,
    WordCount,
  } = cloud.data.value.CKEditor
  const { ExportPdf, ExportWord } = cloud.data.value.CKEditorPremiumFeatures

  return {
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'showBlocks',
        'sourceEditing',
        '|',
        'heading',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'link',
        'insertTable',
        'insertTableLayout',
        'highlight',
        'blockQuote',
        'codeBlock',
        '|',
        'alignment',
        '|',
        'bulletedList',
        'numberedList',
        'todoList',
        'outdent',
        'indent',
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      Alignment,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      BalloonToolbar,
      BlockQuote,
      Bold,
      Bookmark,
      CloudServices,
      Code,
      CodeBlock,
      Emoji,
      Essentials,
      ExportPdf,
      ExportWord,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      GeneralHtmlSupport,
      Heading,
      Highlight,
      HorizontalLine,
      HtmlComment,
      HtmlEmbed,
      ImageBlock,
      ImageCaption,
      ImageEditing,
      ImageInline,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      ImageUtils,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      MediaEmbed,
      Mention,
      PageBreak,
      Paragraph,
      PasteFromOffice,
      PlainTableOutput,
      RemoveFormat,
      ShowBlocks,
      SourceEditing,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableLayout,
      TableProperties,
      TableToolbar,
      TextPartLanguage,
      TextTransformation,
      TodoList,
      Underline,
      WordCount,
    ],
    extraPlugins: [CustomUploadAdapterPlugin],
    balloonToolbar: ['bold', 'italic', '|', 'link', '|', 'bulletedList', 'numberedList'],
    exportPdf: {
      stylesheets: [
        './export-style.css',
        'https://cdn.ckeditor.com/ckeditor5/45.1.0/ckeditor5.css',
        'https://cdn.ckeditor.com/ckeditor5-premium-features/45.1.0/ckeditor5-premium-features.css',
      ],
      fileName: 'export-pdf-demo.pdf',
      converterOptions: {
        format: 'Tabloid',
        margin_top: '20mm',
        margin_bottom: '20mm',
        margin_right: '24mm',
        margin_left: '24mm',
        page_orientation: 'portrait',
      },
    },
    exportWord: {
      stylesheets: [
        './export-style.css',
        'https://cdn.ckeditor.com/ckeditor5/45.1.0/ckeditor5.css',
        'https://cdn.ckeditor.com/ckeditor5-premium-features/45.1.0/ckeditor5-premium-features.css',
      ],
      fileName: 'export-word-demo.docx',
      converterOptions: {
        document: {
          orientation: 'portrait',
          size: 'Tabloid',
          margins: {
            top: '20mm',
            bottom: '20mm',
            right: '24mm',
            left: '24mm',
          },
        },
      },
    },
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, 'default', 18, 20, 22],
      supportAllValues: true,
    },
    heading: {
      options: [
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
      ],
    },
    htmlSupport: {
      allow: [
        {
          name: /^.*$/,
          styles: true,
          attributes: true,
          classes: undefined,
        },
      ],
    },
    image: {
      toolbar: [
        'toggleImageCaption',
        'imageTextAlternative',
        '|',
        'imageStyle:inline',
        'imageStyle:wrapText',
        'imageStyle:breakText',
        '|',
        'resizeImage',
      ],
    },
    initialData: editorData.value,
    language: 'vi',
    licenseKey: LICENSE_KEY,
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file',
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    mention: {
      feeds: [
        {
          marker: '@',
          feed: [],
        },
      ],
    },
    menuBar: {
      isVisible: true,
    },
    placeholder: 'Nhập nội dung tại đây...',
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties',
      ],
    },
    removePlugins: ['Markdown', 'PasteFromMarkdownExperimental'],
  }
})

onMounted(() => {
  isLayoutReady.value = true
})

function onReady(editor: Editor): void {
  editorInstance.value = editor

  if (editorWordCount.value && editorMenuBar.value && editor.ui.view?.menuBarView?.element) {
    ;[...editorWordCount.value.children].forEach((child) => child.remove())
    ;[...editorMenuBar.value.children].forEach((child) => child.remove())

    const wordCount = editor.plugins.get('WordCount')
    editorWordCount.value.appendChild((wordCount as any).wordCountContainer)
    editorMenuBar.value.appendChild(editor.ui.view.menuBarView.element)
  }

  if (props.modelValue && props.modelValue.length > 0) {
    editor.setData(props.modelValue)
  }

  editor.model.document.on('change:data', () => {
    const data = editor.getData()
    if (data !== props.modelValue) {
      editorData.value = data
    }
  })
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (
      editorInstance.value &&
      newValue !== undefined &&
      newValue !== editorInstance.value.getData()
    ) {
      editorInstance.value.setData(newValue || '')
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="main-container">
    <div
      class="editor-container editor-container_classic-editor editor-container_include-word-count"
      ref="editorContainerElement"
    >
      <div class="editor-container__editor">
        <div ref="editorElement">
          <ckeditor
            v-if="editor && config"
            :editor="editor"
            :config="config"
            @ready="onReady"
            class="form-control border rounded p-2"
          />
        </div>
      </div>
      <div class="editor_container__word-count" ref="editorWordCount"></div>
    </div>
  </div>
</template>
