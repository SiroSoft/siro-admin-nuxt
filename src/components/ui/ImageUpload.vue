<script setup lang="ts">
import { ref } from "vue"
import { Upload, X, Link, Loader2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import { uploadService } from "~/services/upload.service"

interface Props {
  value?: string
  error?: string
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  change: [url: string]
}>()

const urlInput = ref("")
const uploading = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

async function handleFile(file: File) {
  uploading.value = true
  try {
    const url = await uploadService.upload(file)
    emit("change", url)
  } catch (err) {
    console.error("Upload failed", err)
  } finally {
    uploading.value = false
  }
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith("image/")) handleFile(file)
}

function handleUrlSubmit() {
  if (urlInput.value) {
    emit("change", urlInput.value)
    urlInput.value = ""
  }
}

function handleRemove() {
  emit("change", "")
}
</script>

<template>
  <div class="space-y-2">
    <div
      @drop="handleDrop"
      @dragover.prevent
      :class="[
        'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors',
        props.value ? 'border-transparent' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        props.disabled && 'opacity-50 cursor-not-allowed',
      ]"
    >
      <div v-if="props.value" class="relative w-full">
        <img :src="props.value" alt="Preview" class="mx-auto max-h-48 rounded-md object-contain" />
        <Button
          v-if="!props.disabled"
          type="button"
          variant="destructive"
          size="icon"
          class="absolute -right-2 -top-2 h-6 w-6 rounded-full"
          @click="handleRemove"
        >
          <X class="h-3 w-3" />
        </Button>
      </div>
      <template v-else-if="uploading">
        <Loader2 class="mb-2 h-8 w-8 animate-spin text-muted-foreground" />
        <p class="text-sm text-muted-foreground">Uploading...</p>
      </template>
      <template v-else>
        <Upload class="mb-2 h-8 w-8 text-muted-foreground" />
        <p class="text-sm text-muted-foreground">Drag & drop or click to upload</p>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          :disabled="props.disabled || uploading"
          @change="($event.target as HTMLInputElement).files?.[0] && handleFile(($event.target as HTMLInputElement).files![0])"
        />
        <Button type="button" variant="outline" size="sm" class="mt-2" :disabled="props.disabled || uploading" @click="fileInputRef?.click()">
          Browse
        </Button>
      </template>
    </div>
    <div v-if="!props.value" class="flex gap-2">
      <Input v-model="urlInput" placeholder="Or paste image URL..." :disabled="props.disabled" />
      <Button type="button" variant="outline" size="sm" :disabled="props.disabled || !urlInput" @click="handleUrlSubmit">
        <Link class="h-3 w-3 mr-1" /> Set
      </Button>
    </div>
    <p v-if="props.error" class="text-sm text-destructive">{{ props.error }}</p>
  </div>
</template>
