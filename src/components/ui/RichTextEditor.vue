<script setup lang="ts">
import { watch } from "vue"
import { useEditor, EditorContent } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Undo, Redo,
} from "lucide-vue-next"
import { cn } from "~/utils"

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  minHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Write something...",
  minHeight: 200,
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const editor = useEditor({
  content: props.modelValue || "",
  editable: !props.disabled,
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2] },
    }),
    Placeholder.configure({ placeholder: props.placeholder }),
  ],
  onUpdate: ({ editor: ed }) => {
    emit("update:modelValue", ed.getHTML())
  },
})

watch(() => props.modelValue, (newVal) => {
  if (editor.value && newVal !== editor.value.getHTML()) {
    editor.value.commands.setContent(newVal || "")
  }
})

watch(() => props.disabled, (newVal) => {
  editor.value?.setEditable(!newVal)
})
</script>

<template>
  <div :class="cn(
    'rounded-md border overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
    props.error ? 'border-destructive' : 'border-input',
  )">
    <div
      class="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-2 py-1.5"
      role="toolbar"
      aria-label="Text formatting"
    >
      <button
        type="button"
        @click="editor?.chain().focus().toggleBold().run()"
        :disabled="props.disabled"
        aria-label="Bold"
        :class="cn(
          'rounded p-1.5 transition-colors',
          editor?.isActive('bold') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
          props.disabled && 'opacity-50 cursor-not-allowed',
        )"
      >
        <Bold class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleItalic().run()"
        :disabled="props.disabled"
        aria-label="Italic"
        :class="cn(
          'rounded p-1.5 transition-colors',
          editor?.isActive('italic') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
          props.disabled && 'opacity-50 cursor-not-allowed',
        )"
      >
        <Italic class="h-3.5 w-3.5" />
      </button>
      <span class="mx-1 h-4 w-px bg-border" />
      <button
        type="button"
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
        :disabled="props.disabled"
        aria-label="Heading 1"
        :class="cn(
          'rounded p-1.5 transition-colors',
          editor?.isActive('heading', { level: 1 }) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
          props.disabled && 'opacity-50 cursor-not-allowed',
        )"
      >
        <Heading1 class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        :disabled="props.disabled"
        aria-label="Heading 2"
        :class="cn(
          'rounded p-1.5 transition-colors',
          editor?.isActive('heading', { level: 2 }) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
          props.disabled && 'opacity-50 cursor-not-allowed',
        )"
      >
        <Heading2 class="h-3.5 w-3.5" />
      </button>
      <span class="mx-1 h-4 w-px bg-border" />
      <button
        type="button"
        @click="editor?.chain().focus().toggleBulletList().run()"
        :disabled="props.disabled"
        aria-label="Bullet list"
        :class="cn(
          'rounded p-1.5 transition-colors',
          editor?.isActive('bulletList') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
          props.disabled && 'opacity-50 cursor-not-allowed',
        )"
      >
        <List class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :disabled="props.disabled"
        aria-label="Ordered list"
        :class="cn(
          'rounded p-1.5 transition-colors',
          editor?.isActive('orderedList') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
          props.disabled && 'opacity-50 cursor-not-allowed',
        )"
      >
        <ListOrdered class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleBlockquote().run()"
        :disabled="props.disabled"
        aria-label="Quote"
        :class="cn(
          'rounded p-1.5 transition-colors',
          editor?.isActive('blockquote') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
          props.disabled && 'opacity-50 cursor-not-allowed',
        )"
      >
        <Quote class="h-3.5 w-3.5" />
      </button>
      <span class="mx-1 h-4 w-px bg-border" />
      <button
        type="button"
        @click="editor?.chain().focus().undo().run()"
        :disabled="props.disabled"
        aria-label="Undo"
        :class="cn(
          'rounded p-1.5 transition-colors',
          'text-muted-foreground hover:bg-muted',
          props.disabled && 'opacity-50 cursor-not-allowed',
        )"
      >
        <Undo class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().redo().run()"
        :disabled="props.disabled"
        aria-label="Redo"
        :class="cn(
          'rounded p-1.5 transition-colors',
          'text-muted-foreground hover:bg-muted',
          props.disabled && 'opacity-50 cursor-not-allowed',
        )"
      >
        <Redo class="h-3.5 w-3.5" />
      </button>
    </div>
    <EditorContent
      :editor="editor"
      :class="cn(
        'prose prose-sm max-w-none p-3 focus:outline-none',
        props.disabled && 'cursor-not-allowed opacity-60',
      )"
      :style="{ minHeight: props.minHeight + 'px' }"
    />
    <p v-if="props.error" class="px-3 pb-2 text-sm text-destructive">{{ props.error }}</p>
  </div>
</template>
